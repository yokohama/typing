-- Add up migration script here
ALTER TABLE shutings ADD COLUMN is_random BOOLEAN DEFAULT FALSE;
