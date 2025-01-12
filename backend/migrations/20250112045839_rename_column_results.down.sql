ALTER TABLE results RENAME COLUMN completion_time TO time;
ALTER TABLE results RENAME COLUMN perfect_within_correct_count TO perfect_count;
ALTER TABLE results RENAME COLUMN gain_coin TO coin;
ALTER TABLE results ADD COLUMN time_bonus INT NOT NULL DEFAULT 0;
