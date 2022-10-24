// SETUP
require("dotenv").config(); // Loads all variables in .env and adds them to process.env

const spicedPg = require("spiced-pg");
const DATABASE_URL = process.env.DATABASE_URL;
const db = spicedPg(DATABASE_URL);

// FUNCTIONS

// REGISTER & LOGIN
function checkEmail(email) {
    const sql = `
    SELECT id, email
    FROM users
    WHERE email = $1
    ;`;
    return db
        .query(sql, [email])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in checkEmail:", error));
}

function createUser(firstName, lastName, email, password) {
    const sql = `
        INSERT INTO users (first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        ;`;
    return db
        .query(sql, [firstName, lastName, email, password]) // correct way to add data to sql
        .then((result) => result.rows)
        .catch((error) => console.log("Error in createUser:", error));
}

function getUser(email) {
    const sql = `
    SELECT *
    FROM users
    WHERE email = $1
    ;`;
    return db
        .query(sql, [email])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getUser:", error));
}

// Password reset
function storeCode(email, code) {
    const sql = `
    INSERT INTO users (code)
    VALUES ($2)
    WHERE email = $1
    ;`;
    return db
        .query(sql, [email, code])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getUser:", error));
}

function resetPassword(id, password) {
    const sql = `
    UPDATE users SET password = $2
    WHERE id = $1
    ;`;
    return db
        .query(sql, [id, password]) // correct way to add data to sql
        .then((result) => result.rows)
        .catch((error) => console.log("Error in editRepresentative:", error));
}

// EXPORTS
module.exports = {
    checkEmail,
    createUser,
    getUser,
    storeCode,
    resetPassword,
};
