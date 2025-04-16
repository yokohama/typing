ALTER TABLE results RENAME COLUMN time TO completion_time;
ALTER TABLE results RENAME COLUMN perfect_count TO perfect_within_correct_count;
ALTER TABLE results RENAME COLUMN coin TO gain_coin;
ALTER TABLE results DROP COLUMN time_bonus;
