-- Add up migration script here
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    shuting_id INT REFERENCES shutings(id) ON DELETE CASCADE,
    correct_count INT NOT NULL,
    incorrect_count INT NOT NULL,
    time INT NOT NULL,
    score INT NOT NULL,
    perfect_count INT NOT NULL,
    time_bonus INT NOT NULL,
    point INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
