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
        .query(sql, [firstName, lastName, email, password])
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

function getUserById(id) {
    const sql = `
    SELECT *
    FROM users
    WHERE id = $1
    ;`;
    return db
        .query(sql, [id])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getUser:", error));
}

// Password reset
function storeCode(email, code) {
    const sql = `
    INSERT INTO codes (user_email, code)
    VALUES ($1, $2)
    RETURNING *
    ;`;
    return db
        .query(sql, [email, code])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in storeCode:", error));
}

function checkCode(email) {
    const sql = `
    SELECT code
    FROM codes
    WHERE user_email = $1 AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
    ORDER BY created_at DESC
    ;`;
    return db
        .query(sql, [email])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in checkCode:", error));
}

function resetPassword(email, password) {
    const sql = `
    UPDATE users SET password = $2
    WHERE email = $1
    ;`;
    return db
        .query(sql, [email, password])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in resetPassword:", error));
}

// Profile
function getProfile(id) {
    const sql = `
    SELECT user.id, first_name, last_name, email, password, created_at, picture, bio
    FROM users LEFT OUTER JOIN profiles
    ON users.id = user_id
    WHERE email = $1
    ;`;
    return db
        .query(sql, [id])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getRepresentative:", error));
}

function updateProfile(id, first_name, last_name, email, bio) {
    const sql = `
    UPDATE users SET first_name = $2, last_name = $3, email = $4, bio = $5
    WHERE id = $1
    RETURNING id, first_name, last_name, email, bio, created_at
    ;`;
    return db
        .query(sql, [id, first_name, last_name, email, bio])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in updateProfile:", error));
}

function updateProfileAndPic(id, first_name, last_name, email, bio, picture) {
    const sql = `
    UPDATE users SET first_name = $2, last_name = $3, email = $4, bio = $5, picture = $6
    WHERE id = $1
    RETURNING id, first_name, last_name, email, bio, picture, created_at
    ;`;
    return db
        .query(sql, [id, first_name, last_name, email, bio, picture])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in updateProfile:", error));
}

// DELETE
function deleteMessages(id) {
    const sql = `
    DELETE FROM messages
    WHERE sender_id = $1 OR receiver_id = $1
    ;`;
    return db
        .query(sql, [id])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in deleteAccount:", error));
}

function deleteRequests(id) {
    const sql = `
    DELETE FROM requests
    WHERE sender_id = $1 OR receiver_id = $1
    ;`;
    return db
        .query(sql, [id])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in deleteAccount:", error));
}

function deleteCodes(email) {
    const sql = `
    DELETE FROM codes
    WHERE user_email = $1
    ;`;
    return db
        .query(sql, [email])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in deleteAccount:", error));
}

function deleteAccount(id, email) {
    const sql = `
    DELETE FROM users
    WHERE id = $1 AND email = $2
    ;`;
    return db
        .query(sql, [id, email])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in deleteAccount:", error));
}

// SEARCH USER
function searchUser(name) {
    const sql = `
    SELECT *
    FROM users
    WHERE first_name ILIKE $1
    OR last_name ILIKE $1
    ORDER BY first_name ASC
    ;`;
    return db
        .query(sql, [name])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in searchUser:", error));
}

function searchUserFullname(firstName, lastName) {
    const sql = `
    SELECT *
    FROM users
    WHERE first_name ILIKE $1
    AND last_name ILIKE $2
    ORDER BY first_name ASC
    ;`;
    return db
        .query(sql, [firstName, lastName])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in searchUserFullName:", error));
}

// FRIENDSHIP
// finds friendship status between two people
function getFriendshipStatus(user1, user2) {
    const sql = `
    SELECT *
    FROM requests
    WHERE (sender_id = $1 AND receiver_id = $2)
    OR (sender_id = $2 AND receiver_id = $1)
    ORDER BY created_at DESC
    LIMIT 1
    `;
    return db
        .query(sql, [user1, user2])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getFriendshipStatus:", error));
}

// creates a friendship request to database
function askFriendship(user1, user2) {
    const sql = `
    INSERT INTO requests (sender_id, receiver_id)
    VALUES ($1, $2)
    RETURNING status
    ;`;
    return db
        .query(sql, [user1, user2])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in askFriendship:", error));
}

// cancel friendship request and unfriend
function cancelFriendshipRequest(user1, user2) {
    const sql = `
    UPDATE requests
    SET status = NULL
    WHERE (sender_id = $1 AND receiver_id = $2)
    OR (sender_id = $2 AND receiver_id = $1)
    RETURNING status
    ;`;
    return db
        .query(sql, [user1, user2])
        .then((result) => result.rows)
        .catch((error) =>
            console.log("Error in cancelFriendshipRequest:", error)
        );
}

// accept friendship request
function acceptFriendshipRequest(user1, user2) {
    const sql = `
    UPDATE requests
    SET status = true
    WHERE (sender_id = $2 AND receiver_id = $1 AND status = false)
    RETURNING status
    ;`;
    return db
        .query(sql, [user1, user2])
        .then((result) => result.rows)
        .catch((error) =>
            console.log("Error in acceptFriendshipRequest:", error)
        );
}

// get friendships
function getFriendships(id) {
    const sql = `
    SELECT users.id, first_name, last_name, picture, status, online
    FROM users JOIN requests
    ON (status = false AND receiver_id = $1 AND users.id = requests.sender_id)
    OR (status = true AND receiver_id = $1 AND users.id = requests.sender_id)
    OR (status = true AND sender_id = $1 AND users.id = requests.receiver_id)
    ;`;
    return db
        .query(sql, [id])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getFriendships:", error));
}

function getFriendsId(id) {
    const sql = `
    SELECT users.id
    FROM users JOIN requests
    ON (status = true AND receiver_id = $1 AND users.id = requests.sender_id)
    OR (status = true AND sender_id = $1 AND users.id = requests.receiver_id)
    ;`;
    return db
        .query(sql, [id])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getFriendships:", error));
}

// get messages
function getMessages(user1, user2, limit) {
    const sql = `
    SELECT messages.id, sender_id, receiver_id, first_name, last_name, picture, text, messages.created_at
    FROM messages JOIN users
    ON (users.id = messages.sender_id AND sender_id = $1 AND receiver_id = $2)
    OR (users.id = messages.sender_id AND sender_id = $2 AND receiver_id = $1)
    ORDER BY messages.created_at ASC
    LIMIT $3
    ;`;
    return db
        .query(sql, [user1, user2, limit])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getMessages:", error));
}

function getMessagesGlobal(limit) {
    const sql = `
    SELECT messages.id, sender_id, receiver_id, first_name, last_name, picture, text, messages.created_at
    FROM messages JOIN users
    ON (users.id = messages.sender_id AND receiver_id = 0)
    ORDER BY messages.created_at ASC
    LIMIT $1
    ;`;
    return db
        .query(sql, [limit])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getMessages:", error));
}

// add new message
function addMessage(user1, user2, text) {
    const sql = `
        INSERT INTO messages (sender_id, receiver_id, text)
        VALUES ($1, $2, $3)
        RETURNING id
        ;`;
    return db
        .query(sql, [user1, user2, text])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in addMessage:", error));
}

// get sigle message by message id
function getMessage(messageId) {
    const sql = `
        SELECT messages.id, sender_id, receiver_id, first_name, last_name, picture, text, messages.created_at, sender_id, receiver_id
        FROM messages JOIN users
        ON sender_id = users.id
        WHERE messages.id = $1
        ;`;
    return db
        .query(sql, [messageId])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getMessage:", error));
}

// ONLINE STATUS
function setUserOnlineStatus(id, boolean) {
    const sql = `
    UPDATE users
    SET online = $2
    WHERE id = $1
    ;`;
    return db
        .query(sql, [id, boolean])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in setUserOnlineStatus:", error));
}

// ADD POST
function addPostWithPic(poster_id, title, post_text, image) {
    const sql = `
    INSERT INTO posts (poster_id, title, post_text, image)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    ;`;
    return db
        .query(sql, [poster_id, title, post_text, image])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in addPostWithPic:", error));
}

function addPostNoPic(poster_id, title, post_text) {
    const sql = `
    INSERT INTO posts (poster_id, title, post_text)
    VALUES ($1, $2, $3)
    RETURNING *
    ;`;
    return db
        .query(sql, [poster_id, title, post_text])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in addPostNoPic:", error));
}

// function getPostById(postId) {
//     const sql = `
//     SELECT posts.id, poster_id, title, post_text, image, posts.created_at
//     FROM posts
//     JOIN users ON poster_id = users.id
//     WHERE posts.id = $1
//     ;`;
//     return db
//         .query(sql, [postId])
//         .then((result) => result.rows)
//         .catch((error) => console.log("Error in addPostWithPic:", error));
// }

function getAllPostsByUserId(userId) {
    const sql = `
    SELECT *
    FROM posts
    WHERE poster_id = $1
    ;`;
    return db
        .query(sql, [userId])
        .then((result) => result.rows)
        .catch((error) => console.log("Error in getAllPostsByUserI:", error));
}

// EXPORTS
module.exports = {
    checkEmail,
    createUser,
    getUser,
    getUserById,
    storeCode,
    checkCode,
    resetPassword,
    getProfile,
    updateProfile,
    updateProfileAndPic,
    deleteMessages,
    deleteRequests,
    deleteCodes,
    deleteAccount,
    searchUser,
    searchUserFullname,
    getFriendshipStatus,
    askFriendship,
    cancelFriendshipRequest,
    acceptFriendshipRequest,
    getFriendships,
    getFriendsId,
    getMessages,
    getMessagesGlobal,
    addMessage,
    getMessage,
    setUserOnlineStatus,
    addPostWithPic,
    addPostNoPic,
    // getPostById,
    getAllPostsByUserId,
};
