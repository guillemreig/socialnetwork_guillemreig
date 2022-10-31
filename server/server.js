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
bcrypt;

// Cookies
const cookieSession = require("cookie-session");

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

// MIDDLEWARE
app.use(
    cookieSession({
        secret: process.env.SESSION_SECRET,
        maxAge: 1000 * 60 * 60 * 24 * 1, // miliseconds * seconds * minutes * hours * days
        sameSite: true,
    })
);

app.use(compression());

app.use(express.static(path.join(__dirname, "..", "client", "public")));

app.use(express.json()); // This is needed to read the req.body

// ROUTES
// Get user id from cookie
app.get("/user/id.json", (req, res) => {
    console.log("req.session :", req.session);

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
    console.log("GET USER. id :", req.params.id);

    let id = req.params.id;
    // if 'id' is 0 the request comes from own Home page and wants own user data
    if (id == 0) {
        id = req.session.id;
    }
    // if 'id' is another number, it comes from OtherUserPage and wants somoene else's data
    db.getUserById(id)
        .then((data) => {
            console.log("data :", data);
            delete data[0].password; // caution!
            data[0].created_at = data[0].created_at.toString().split(" GMT")[0];

            res.json(data[0]);
        })
        .catch((error) => {
            console.log(error);
        });
});

// Registration
app.post("/registration", (req, res) => {
    console.log("REGISTRATION. req.body :", req.body);

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
    console.log("LOG IN. req.body:", req.body);

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
    console.log("GET CODE. req.body:", req.body);

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
            console.log("data :", data);
            // (Code to send the code to email here)

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
    console.log("RESET PASSWORD req.body :", req.body);

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
    console.log("EDIT PROFILE. req.body :", req.body);
    console.log("req.file :", req.file);

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
            }
        })
        .then(() => {
            if (req.file) {
                // CREATE URL
                const picture = `https://s3.amazonaws.com/spicedling/${req.file.filename}`;
                console.log("picture url :", picture);

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

// SEARCH USER
app.get("/users/:string", (req, res) => {
    console.log("SEARCH USER. req.params.string :", req.params.string);

    const searchArr = req.params.string.split(" ");
    console.log("searchArr :", searchArr);

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
    console.log("GET USER STATUS. id1, id2 :", req.session.id, req.params.id);

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
                    data[0].created_at = data[0].created_at
                        .toString()
                        .split(" GMT")[0];
                }

                res.json(data[0]);
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

// make friendship request
app.get("/befriend/:id.json", (req, res) => {
    console.log("BEFRIEND. id1, id2 :", req.session.id, req.params.id);

    const id1 = req.session.id;
    const id2 = req.params.id;

    if (id1 == id2) {
        res.redirect("/");
    }

    db.askFriendship(id1, id2)
        .then((data) => {
            console.log("data :", data);

            res.json(data[0]);
        })
        .catch((error) => {
            console.log(error);
        });
});

// cancel friendship request
app.get("/cancel/:id.json", (req, res) => {
    console.log("CANCEL. id1, id2 :", req.session.id, req.params.id);

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
    console.log("ACCEPT. id1, id2 :", req.session.id, req.params.id);

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

// CATCH ALL

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// INITIALIZATION
app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
