-- Add up migration script here
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    level INT NOT NULL,
    correct INT NOT NULL,
    incorrect INT NOT NULL,
    time INT NOT NULL,
    score INT NOT NULL,
    perfect_count INT NOT NULL,
    time_bonus INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
