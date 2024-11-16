-- Add up migration script here
ALTER TABLE users ADD COLUMN point INT NOT NULL DEFAULT 0;
