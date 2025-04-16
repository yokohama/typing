-- Add up migration script here
CREATE TABLE gift_requests (
    id SERIAL PRIMARY KEY,
    parent_user_id INT NOT NULL,
    child_user_id INT NOT NULL,
    point INT NOT NULL,
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    rejected_at TIMESTAMP,
    deleted_at TIMESTAMP,

    CONSTRAINT fk_child_user FOREIGN KEY (child_user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_parent_user FOREIGN KEY (parent_user_id) REFERENCES users (id) ON DELETE CASCADE
);
