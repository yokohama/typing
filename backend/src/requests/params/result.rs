use serde::Deserialize;
use validator::Validate;

#[derive(Debug, Deserialize, Validate)]
pub struct Create {
    pub corrects: i32,
    pub incorrects: i32,
    pub time: i32,
    pub perfect_count: i32,
}

#[derive(Deserialize)]
pub struct Query {
    pub user_id: Option<i32>,
    pub level: Option<i32>,
}
