use serde::Deserialize;
use validator::Validate;

use crate::requests::validations;

#[derive(Default, Debug, Deserialize, Validate)]
pub struct UpdateProfile {
    #[validate(custom = "validations::name")]
    pub name: Option<String>,
    pub coin: Option<i32>,
    pub total_gain_coin: Option<i32>,
}

#[derive(Deserialize)]
pub struct Query {
    pub user_id: Option<i32>,
}
