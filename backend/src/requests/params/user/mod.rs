use serde::Deserialize;
use validator::Validate;

use crate::requests::validations;

#[derive(Default, Debug, Deserialize, Validate)]
pub struct UpdateProfile {
    #[validate(custom = "validations::name")]
    pub name: Option<String>,
    pub point: Option<i32>,
}
