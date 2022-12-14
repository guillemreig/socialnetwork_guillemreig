DROP TABLE IF EXISTS requests;
DROP TABLE IF EXISTS codes;
DROP TABLE IF EXISTS posts;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email VARCHAR NOT NULL UNIQUE,
    password VARCHAR NOT NULL,
    picture VARCHAR,
    bio VARCHAR,
    online BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE codes (
    id SERIAL PRIMARY KEY,
    user_email VARCHAR NOT NULL REFERENCES users (email),
    code VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE requests (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users (id),
    receiver_id INTEGER NOT NULL REFERENCES users (id),
    status BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users (id),
    receiver_id INTEGER NOT NULL,
    text VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
    id SERIAL PRIMARY KEY,
    poster_id INTEGER NOT NULL REFERENCES users (id),
    image VARCHAR DEFAULT NULL,
    title VARCHAR,
    post_text VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


