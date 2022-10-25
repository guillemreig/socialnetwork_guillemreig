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

// Variables
const namesRegex = /^[a-z ,.'-]+$/i; // names check
const emailRegex =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/; // email check

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

// Registration
app.post("/registration", (req, res) => {
    console.log("REGISTRATION. req.body :", req.body);

    if (
        // Check if empty fields
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.email ||
        !req.body.password
    ) {
        res.json({
            success: false,
            message: "Missing fields!",
        });
    } else if (
        // Check if valid input format
        !req.body.email.match(emailRegex) ||
        !req.body.firstName.match(namesRegex) ||
        !req.body.lastName.match(namesRegex)
    ) {
        res.json({
            success: false,
            message: "Invalid input!",
        });
    } else {
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
                req.session = Object.assign(req.session, data[0]);
                res.json({
                    success: true,
                    message: "Registration successful!",
                });
            })
            .catch((error) => {
                console.log(error);
            });
    }
});

// Log in
app.post("/login", (req, res) => {
    console.log("LOG IN. req.body:", req.body);
    db.getUser(req.body.email)
        .then((data) => {
            if (data.length) {
                bcrypt
                    .compare(req.body.password, data[0].password)
                    .then((compare) => {
                        if (compare) {
                            delete data[0].password; // caution!

                            console.log("data[0] :", data[0]);
                            req.session = Object.assign(req.session, data[0]);
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
            console.log(error);
        });
});

// get user data
app.get("/user", (req, res) => {
    console.log("GET USER. req.session.id :", req.session.id);
    db.getUserById(req.session.id)
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
            console.log("data[0].user_email :", data[0].user_email);
            console.log("data[0].code :", data[0].code);
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
            console.log(error);
        });
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// INITIALIZATION
app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
