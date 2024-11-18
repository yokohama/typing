use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct Create {
    pub correct_count: i32,
    pub incorrect_count: i32,
    pub time: i32,
    pub perfect_count: i32,
}

#[derive(Deserialize)]
pub struct Query {
    pub user_id: Option<i32>,
    pub shuting_id: Option<i32>,
}
