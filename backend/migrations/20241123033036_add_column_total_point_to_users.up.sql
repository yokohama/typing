-- Add up migration script here
ALTER TABLE users ADD COLUMN total_point INT NOT NULL DEFAULT 0;

