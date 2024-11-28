use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct Create {
    pub parent_user_id: i32,
    pub child_user_id: i32,
}
