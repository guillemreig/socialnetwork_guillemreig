// SETUP
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");
const cryptoRandomString = require("crypto-random-string");

// Database
const db = require("./db");

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
        throw new Error("ERROR: REGISTRATION missing fields");
    } else if (
        // Check if valid input format
        !req.body.email.match(emailRegex) ||
        !req.body.firstName.match(namesRegex) ||
        !req.body.lastName.match(namesRegex)
    ) {
        throw new Error("ERROR: REGISTRATION invalid input");
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

// Reset password
app.post("/getcode", (req, res) => {
    console.log("GET CODE. req.body:", req.body);
    db.getUser(req.body.email)
        .then((data) => {
            if (data.length) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                console.log("secretCode :", secretCode);
                req.session.code = secretCode; // I don't like storing the code in a cookie. Should be stored in the server.
                // bcrypt
                //     .compare(req.body.password, data[0].password)
                //     .then((compare) => {
                //         if (compare) {
                //             delete data[0].password; // caution!
                //             console.log("data[0] :", data[0]);
                //             req.session = Object.assign(req.session, data[0]);
                //             res.json({
                //                 success: true,
                //                 message: "Log in successful!",
                //             });
                //         } else {
                //             res.json({
                //                 success: false,
                //                 message: "Wrong password!",
                //             });
                //         }
                //     });
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

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// INITIALIZATION
app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
