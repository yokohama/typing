-- Add up migration script here

CREATE TABLE parents_children (
    parent_user_id INT NOT NULL,
    child_user_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    deleted_at TIMESTAMP DEFAULT NOW(),
    -- 同じ親子の重複ブロック
    PRIMARY KEY (child_user_id, parent_user_id),
    CONSTRAINT fk_child_user FOREIGN KEY (child_user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_parent_user FOREIGN KEY (parent_user_id) REFERENCES users (id) ON DELETE CASCADE,
    -- 自己参照を防ぐ
    CONSTRAINT chk_no_self_reference CHECK (child_user_id != parent_user_id) 
);
