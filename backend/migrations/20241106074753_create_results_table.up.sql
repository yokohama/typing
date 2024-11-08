-- Add up migration script here
CREATE TABLE results (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INT REFERENCES lessons(id) ON DELETE CASCADE,
    score FLOAT,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
