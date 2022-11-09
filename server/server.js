// SETUP
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cryptoRandomString = require("crypto-random-string");

// Database
const db = require("./db");

/// AWS ///
// const aws = require("aws-sdk");
// let secrets;

// Encryption
const bcrypt = require("bcryptjs");

// Cookies
// const cookieSession = require("cookie-session");
const { cookieSessionMiddleware } = require("./middleware");

// Image upload
const { uploader } = require("./middleware");

const fs = require("fs");

/// AWS ///
const aws = require("aws-sdk");
const secrets = require("./secrets");

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

// socket.io
const server = require("http").Server(app);

const io = require("socket.io")(server, {
    allowRequest: (req, callback) => {
        callback(null, req.headers.referer.startsWith("http://localhost:3000"));
    },
});

// allow socket.io to use cookie session
io.use((socket, next) => {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// store user.id-socket.id pairs
const socketId = {};

io.on("connection", async (socket) => {
    const userId = socket.request.session.id;
    socketId[userId] = socket.id;

    // console.log("connection. id:", userId, "socketId:", socket.id);
    // console.log("socketId", socketId);

    db.setUserOnlineStatus(userId, true); // Update online status

    db.getFriendsId(userId).then((data) => {
        // console.log("getFriendsId data:", data);

        for (const element of data) {
            const friendId = element.id;
            if (Object.prototype.hasOwnProperty.call(socketId, friendId)) {
                // console.log(`Friend Id: ${friendId} is online. Noticie friend`);

                io.to(socketId[friendId]).emit("friendOnline", userId);
            }
        }
    });

    if (!userId) {
        return socket.disconnect(true);
    }

    socket.on("disconnect", function () {
        // console.log("disconnect. id:", userId);
        db.setUserOnlineStatus(userId, false);
        db.getFriendsId(userId).then((data) => {
            // console.log("getFriendsId data:", data);

            for (const element of data) {
                const friendId = element.id;
                if (Object.prototype.hasOwnProperty.call(socketId, friendId)) {
                    // console.log(
                    //     `Friend Id: ${friendId} is offline. Noticie friend`
                    // );

                    io.to(socketId[friendId]).emit("friendOffline", userId);
                }
            }
        });
    });

    // 1. send them the latest messages
    // const latestMessages = await db.getMessages();
    // socket.emit("chatMessages", latestMessages);

    // 2. listen for a new message event
    socket.on("sendMessage", async (message) => {
        // console.log(message);

        const { chatId, text } = message;

        // console.log(
        //     "userId:",
        //     userId,
        //     "socket.id",
        //     socket.id,
        //     "chatId",
        //     chatId
        // );
        // 1. store the message in the database
        try {
            const messageId = await db.addMessage(userId, chatId, text);
            const messageData = await db.getMessage(messageId[0].id);

            // 2. send the message to all connected sockets
            // include all relevant information (user id, user name, picture, message, timestamp)
            if (messageData[0].receiver_id === 0) {
                io.emit("newMessage", messageData[0]); // if it's a message to the global chat, send to everyone
            } else {
                io.to(socketId[userId]).emit("newMessage", messageData[0]);
                io.to(socketId[chatId]).emit("newMessage", messageData[0]);
            } // if the message is directed at a private chat, send only to participants
        } catch (error) {
            console.error(error);
        }

        // try...

        // catch...
    });
});

// MIDDLEWARE
app.use(cookieSessionMiddleware);

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(express.json()); // This is needed to read the req.body

// ROUTES
// Get user id from cookie
app.get("/user/id.json", (req, res) => {
    // console.log("req.session :", req.session);

    if (req.session.id) {
        res.json({
            id: req.session.id,
        });
    } else {
        res.json({
            id: undefined,
        });
    }
});

// get user data (own or other)
app.get("/user/:id.json", (req, res) => {
    // console.log("GET USER. id :", req.params.id);
    let userId;

    if (req.params.id == 0) {
        userId = req.session.id; // if 'id' is 0 the request comes from own Home page and wants own user data
    } else {
        userId = req.params.id; // if 'id' is another number, it comes from OtherUserPage and wants somoene else's data
    }

    Promise.all([
        db.getUserById(userId),
        db.getFriendships(userId),
        db.getAllPostsByUserId(userId),
    ])
        .then((data) => {
            // console.log("promiseall data :", data); // data[0] is user data. data[1] is friends data
            const pendingRequests = data[1].some((obj) => obj.status == false);

            console.log("pendingRequests :", pendingRequests);

            if (pendingRequests && req.params.id == 0) {
                io.to(socketId[userId]).emit("newRequestUpdate", true);
            }

            delete data[0][0].password; // caution! Password must be deleted from data before sending it to client!

            data[0][0].created_at = data[0][0].created_at
                .toString()
                .split(" GMT")[0]; // We can change the format of the date here

            data[2].forEach((element) => {
                element.created_at = element.created_at
                    .toString()
                    .split(" GMT")[0];
            });

            res.json(data);
        })
        .catch((error) => {
            console.log(error);
        });
});

// Registration
app.post("/registration", (req, res) => {
    // console.log("REGISTRATION. req.body :", req.body);

    // Check if email already exists
    db.checkEmail(req.body.email)
        .then((data) => {
            if (data.length && data[0].id != req.session.id) {
                res.json({
                    success: false,
                    message: "Email already in use!",
                });
            } else {
                // Generate salt for password
                return bcrypt.genSalt();
            }
        })
        .then((salt) => {
            // Hash the password with the salt
            return bcrypt.hash(req.body.password, salt); // It's a promise so it must be returned
        })
        .then((hash) => {
            // Create user
            return db.createUser(
                req.body.firstName,
                req.body.lastName,
                req.body.email,
                hash
            );
        })
        .then((data) => {
            // Store user data as cookie, and send data to client
            req.session.id = data[0].id;
            res.json({
                success: true,
                message: "Registration successful!",
            });
        })
        .catch((error) => {
            res.json({
                success: false,
                message: "Error during registration!",
            });
            console.log(error);
        });
});

// Log in
app.post("/login", (req, res) => {
    // console.log("LOG IN. req.body:", req.body);

    // Get user info from database
    db.getUser(req.body.email)
        .then((data) => {
            if (data.length) {
                // Compare passwords
                bcrypt
                    .compare(req.body.password, data[0].password)
                    .then((compare) => {
                        if (compare) {
                            // Store user id to cookie
                            req.session.id = data[0].id;

                            res.json({
                                success: true,
                                message: "Log in successful!",
                            });
                        } else {
                            res.json({
                                success: false,
                                message: "Wrong password!",
                            });
                        }
                    });
            } else {
                res.json({
                    success: false,
                    message: "No matching email!",
                });
            }
        })
        .catch((error) => {
            res.json({
                success: false,
                message: "Error logging in!",
            });
            console.log(error);
        });
});

// Log out
app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

// Reset password
app.post("/getcode", (req, res) => {
    // console.log("GET CODE. req.body:", req.body);

    db.getUser(req.body.email)
        .then((data) => {
            if (data.length) {
                // Generate code
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                console.log("secretCode :", secretCode);

                // Store the email-code pair in the database
                return db.storeCode(req.body.email, secretCode);
            } else {
                res.json({
                    success: false,
                    message: "No matching email!",
                });
            }
        })
        .then((data) => {
            // (Code to send the code to email here)
            data;

            return undefined;
        })
        .then(() => {
            res.json({
                success: true,
                message: "Code sent!",
            });
        })
        .catch((error) => {
            res.json({
                success: false,
                message: "Error getting the code!",
            });
            console.log(error);
        });
});

app.post("/resetpassword", (req, res) => {
    // console.log("RESET PASSWORD req.body :", req.body);

    db.checkCode(req.body.email)
        .then((data) => {
            console.log("data :", data);
            if (data.length > 0) {
                if (req.body.code === data[0].code) {
                    // Generate salt
                    return bcrypt.genSalt();
                } else {
                    // End the process
                    res.json({
                        success: false,
                        message: "Wrong code! Try again.",
                    });
                }
            } else {
                res.json({
                    success: false,
                    message: "Code expired! Try again.",
                });
            }
        })
        .then((salt) => {
            // Hash the new password with the salt
            return bcrypt.hash(req.body.password, salt);
        })
        .then((hash) => {
            // Reset password
            return db.resetPassword(req.body.email, hash);
        })
        .then(() => {
            res.json({
                success: true,
                message: "Password has been reset!",
            });
        })
        .catch((error) => {
            res.json({
                success: false,
                message: "Error updating password!",
            });
            console.log(error);
        });
});

// Edit profile
app.post("/profile", uploader.single("file"), (req, res) => {
    // console.log("EDIT PROFILE. req.body :", req.body);
    // console.log("req.file :", req.file);

    const { id } = req.session;
    const { first_name, last_name, email, bio } = req.body;

    // Check if email already exists
    db.checkEmail(email)
        .then((data) => {
            if (data.length && data[0].id != id) {
                res.json({
                    success: false,
                    message: "Email already in use!",
                });
            } else {
                return db.getUserById(id);
            }
        })
        .then((data) => {
            const oldEmail = data[0].email;

            if (oldEmail != email) {
                return db.deleteCodes(oldEmail); // If email has changed, delete old codes before changing email
            }
        })
        .then(() => {
            if (req.file) {
                const { filename, mimetype, size, path } = req.file;

                const promise = s3
                    .putObject({
                        Bucket: "spicedling",
                        ACL: "public-read",
                        Key: filename,
                        Body: fs.createReadStream(path),
                        ContentType: mimetype,
                        ContentLength: size,
                    })
                    .promise();

                return promise;
                // return undefined; // Here should go the image upload thing
            }
        })
        .then(() => {
            if (req.file) {
                // CREATE URL
                const picture = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;
                // console.log("picture url :", picture);

                // DELETE IMAGE FROM LOCAL STORAGE
                fs.unlink(req.file.path, function (err) {
                    if (err) {
                        console.error("Error in fs.unlink:", err);
                    } else {
                        console.log("File removed!", req.file.path);
                    }
                });

                // PUT DATA IN DATABASE AND GET THE ID AND CREATED_AT
                return db.updateProfileAndPic(
                    id,
                    first_name,
                    last_name,
                    email,
                    bio,
                    picture
                );
            } else {
                return db.updateProfile(id, first_name, last_name, email, bio);
            }
        })
        .then(() => {
            res.json({
                success: true,
                message: "Profile edit successful!",
            });
        })
        .catch((error) => {
            res.json({
                success: false,
                message: "Error updating profile!",
            });
            console.log(error);
        });
});

// DELETE ACCOUNT
app.post("/deleteaccount", (req, res) => {
    console.log("DELETE ACCOUNT req.body :", req.body);
    const id = req.session.id;
    const email = req.body.email;

    db.checkCode(email)
        .then((data) => {
            if (data.length > 0) {
                if (req.body.code === data[0].code) {
                    // Delete account, codes, friends and messages
                    // promise all
                    Promise.all([
                        db.deleteMessages(id),
                        db.deleteRequests(id),
                        db.deleteCodes(email),
                    ])
                        .then(() => {
                            return db.deleteAccount(id, email);
                        })
                        .then(() => {
                            res.json({
                                success: true,
                                message: "Account deleted successfully!",
                            });
                        })
                        .catch((error) => {
                            res.json({
                                success: false,
                                message:
                                    "Server error! Please contact tech support.",
                            });
                            console.log(error);
                        });
                } else {
                    res.json({
                        success: false,
                        message: "Wrong code! Try again.",
                    });
                }
            } else {
                res.json({
                    success: false,
                    message: "Code expired! Try again.",
                });
            }
        })
        .catch((error) => {
            res.json({
                success: false,
                message: "Server error! Please contact tech support.",
            });
            console.log(error);
        });
});

// SEARCH USER
app.get("/users/:string", (req, res) => {
    // console.log("SEARCH USER. req.params.string :", req.params.string);

    const searchArr = req.params.string.split(" ");
    // console.log("searchArr :", searchArr);

    if (searchArr.length > 1) {
        db.searchUserFullname(searchArr[0], searchArr[1] + "%")
            .then((data) => {
                console.log("data :", data);
                res.json(data);
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        db.searchUser(searchArr[0] + "%")
            .then((data) => {
                console.log("data :", data);
                res.json(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

// FRIENDSHIP
// FRIEND BUTTON
// get user friend status
app.get("/status/:id.json", (req, res) => {
    // console.log("GET USER STATUS. id1, id2 :", req.session.id, req.params.id);

    const id1 = req.session.id;
    const id2 = req.params.id;

    if (id1 == id2) {
        // It's the same user
        res.json({
            status: "self",
        });
    } else {
        db.getFriendshipStatus(id1, id2)
            .then((data) => {
                console.log("data :", data);

                if (data[0]) {
                    res.json(data[0]);
                } else {
                    res.json({ status: null });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

// make friendship request
app.get("/befriend/:id.json", (req, res) => {
    // console.log("BEFRIEND. id1, id2 :", req.session.id, req.params.id);

    const id1 = req.session.id;
    const id2 = req.params.id;

    if (id1 == id2) {
        res.redirect("/");
    }

    db.askFriendship(id1, id2)
        .then((data) => {
            console.log("askFriendship data :", data);

            if (Object.prototype.hasOwnProperty.call(socketId, id2)) {
                io.to(socketId[id2]).emit("newRequestUpdate", true);
            }

            res.json(data[0]);
        })
        .catch((error) => {
            console.log(error);
        });
});

// cancel friendship request
app.get("/cancel/:id.json", (req, res) => {
    // console.log("CANCEL. id1, id2 :", req.session.id, req.params.id);

    const id1 = req.session.id;
    const id2 = req.params.id;

    if (id1 == id2) {
        res.redirect("/");
    }

    db.cancelFriendshipRequest(id1, id2)
        .then((data) => {
            console.log("data :", data);

            res.json({ success: true });
        })
        .catch((error) => {
            console.log(error);
        });
});

// accept friendship request
app.get("/accept/:id.json", (req, res) => {
    // console.log("ACCEPT. id1, id2 :", req.session.id, req.params.id);

    const id1 = req.session.id;
    const id2 = req.params.id;

    if (id1 == id2) {
        res.redirect("/");
    }

    db.acceptFriendshipRequest(id1, id2)
        .then((data) => {
            console.log("data :", data);

            res.json({ success: true });
        })
        .catch((error) => {
            console.log(error);
        });
});

// get all friends and pending requests
app.get("/friendships.json", (req, res) => {
    const id = req.session.id;
    // console.log("GET ALL FRIENDS. id:", id);

    db.getFriendships(id)
        .then((data) => {
            // console.log("data :", data);

            res.json(data);
        })
        .catch((error) => {
            console.log(error);
        });
});

// CHAT
// get messages
app.get("/messages/:id.json", (req, res) => {
    const user1 = req.session.id;
    const user2 = req.params.id;
    const limit = 10;

    if (user2 == 0) {
        console.log("GET MESSAGES GLOBAL. id2:", user2);
        db.getMessagesGlobal(limit)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                console.log(error);
            });
    } else {
        console.log("GET MESSAGES. id1:", user1, "id2:", user2);
        db.getMessages(user1, user2, limit)
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

// ADD POST
// Get all posts
app.get("/allposts/:id.json", (req, res) => {
    console.log(
        "GET ALL POSTS. req.session.id :",
        req.session.id,
        "req.params,id :",
        req.params.id
    );

    let userId;

    if (req.params.id == 0) {
        userId = req.session.id; // if 'id' is 0 the request comes from own Home page and wants own user data
    } else {
        userId = req.params.id; // if 'id' is another number, it comes from OtherUserPage and wants somoene else's data
    }

    db.getAllPostsByUserId(userId)
        .then((data) => {
            data.forEach((element) => {
                element.created_at = element.created_at
                    .toString()
                    .split(" GMT")[0];
            });
            res.json(data);
        })
        .catch((error) => {
            console.log(error);
        });
});

// Create post
app.post("/post", uploader.single("file"), (req, res) => {
    console.log("POST. req.body :", req.body);
    console.log("req.file :", req.file);

    const { id } = req.session;
    const { title, post_text } = req.body;

    if (req.file) {
        const { filename, mimetype, size, path } = req.file;

        const promise = s3
            .putObject({
                Bucket: "spicedling",
                ACL: "public-read",
                Key: filename,
                Body: fs.createReadStream(path),
                ContentType: mimetype,
                ContentLength: size,
            })
            .promise();

        promise
            .then(() => {
                // CREATE URL
                const image = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;

                // DELETE IMAGE FROM LOCAL STORAGE
                fs.unlink(req.file.path, function (err) {
                    if (err) {
                        console.error("Error in fs.unlink:", err);
                    } else {
                        console.log("File removed!", req.file.path);
                    }
                });
                // PUT DATA IN DATABASE AND GET THE ID
                console.log("addPostWithPic");
                return db.addPostWithPic(id, title, post_text, image);
            })
            // .then((data) => {
            //     return db.getPostById(data[0].id);
            // })
            .then((data) => {
                res.json({
                    success: true,
                    post: data[0],
                });
            })
            .catch((error) => {
                res.json({
                    success: false,
                    message: "Error posting with image!",
                });
                console.log(error);
            });
    } else {
        console.log("addPostNoPic");
        db.addPostNoPic(id, title, post_text)
            // .then((data) => {
            //     return db.getPostById(data[0].id);
            // })
            .then((data) => {
                res.json({
                    success: true,
                    post: data[0],
                });
            })
            .catch(() => {
                res.json({
                    success: false,
                    message: "Error posting!",
                });
            });
    }
});

// CATCH ALL
app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// INITIALIZATION
// socket.io changes 'app' to 'server'
server.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});

// app.listen(process.env.PORT || 3001, function () {
//     console.log("I'm listening.");
// });
