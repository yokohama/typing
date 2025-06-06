use serde::Deserialize;
use validator::Validate;

use crate::requests::validations;

#[derive(Debug, Deserialize, Validate)]
pub struct Create {
    pub parent_user_id: i32,
    pub child_user_id: i32,
    #[validate(custom = "validations::valid_coin")]
    pub coin: i32,
}
