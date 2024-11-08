use serde::Deserialize;
use validator::Validate;

use crate::requests::validations;

#[derive(Debug, Deserialize, Validate)]
pub struct Create {
    pub answer: String,
    pub time: i32,
}

#[derive(Deserialize)]
pub struct LessonQuery {
    pub lesson_id: Option<i32>,
}
