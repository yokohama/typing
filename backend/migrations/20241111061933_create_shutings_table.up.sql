-- Add up migration script here
CREATE TABLE shutings (
    id SERIAL PRIMARY KEY,
    level INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
