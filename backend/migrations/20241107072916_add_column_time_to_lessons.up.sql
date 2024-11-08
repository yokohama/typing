-- Add up migration script here
ALTER TABLE results ADD COLUMN time INT NOT NULL DEFAULT 0;
ALTER TABLE results ADD COLUMN answer TEXT;
