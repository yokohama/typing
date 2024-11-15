-- Add up migration script here
CREATE TABLE shutings (
    id SERIAL PRIMARY KEY,
    level INT NOT NULL DEFAULT 1,
    word VARCHAR(255) NOT NULL,
    limit_sec INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
