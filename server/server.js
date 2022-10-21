// SETUP
const express = require("express");
const app = express();
const compression = require("compression");
const path = require("path");

// Database
const db = require("./db");
db;

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

// function ensure signed in
// if (req.session.id)
// return res.json()

// ROUTES
app.get("/user/id.json", (req, res) => {
    console.log("req.session :", req.session);
    if (req.session.userId) {
        return res.json({
            userId: req.session.userId,
        });
    }
    return res.json({
        userId: undefined,
    });
});

// Sign up
app.post("/registration.json", (req, res) => {
    console.log("REGISTRATION. req.body :", req.body);

    if (
        // Check if empty fields
        !req.body.first_name ||
        !req.body.last_name ||
        !req.body.email ||
        !req.body.password
    ) {
        throw new Error("ERROR: REGISTRATION missing fields");
    } else if (
        // Check if valid input format
        !req.body.email.match(emailRegex) ||
        !req.body.first_name.match(namesRegex) ||
        !req.body.last_name.match(namesRegex)
    ) {
        throw new Error("ERROR: REGISTRATION invalid input");
    } else {
        // Check if email already exists
        db.checkEmail(req.body.email)
            .then((data) => {
                if (data.length && data[0].id != req.session.id) {
                    throw new Error("ERROR: REGISTRATION email already in use");
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
                    req.body.first_name,
                    req.body.last_name,
                    req.body.email,
                    hash
                );
            })
            .then((data) => {
                // Store user id as cookie, and send data to client
                req.session.userId = data[0].id;
                res.json({
                    success: true,
                    message: "Registration successful!",
                });
            })
            .catch((error) => {
                res.json({
                    success: false,
                    message: error,
                });
            });
    }
});

// Log in
app.post("/login", (req, res) => {
    console.log("LOGIN. req.body :", req.body);

    req;
    res;
    // validate the user
    // put user id in session
    // respond with JSON (wether is successful or not)
});

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "..", "client", "index.html"));
});

// INITIALIZATION
app.listen(process.env.PORT || 3001, function () {
    console.log("I'm listening.");
});
