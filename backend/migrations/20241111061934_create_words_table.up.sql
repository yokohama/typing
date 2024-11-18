CREATE TABLE words (
    id SERIAL PRIMARY KEY,
    shuting_id INT REFERENCES shutings(id) ON DELETE CASCADE,
    word VARCHAR(255) NOT NULL,
    limit_sec INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP
);
