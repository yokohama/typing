use serde::Deserialize;
use validator::Validate;

use crate::requests::validations;

#[derive(Debug, Deserialize, Validate)]
pub struct UpdateProfile {
    #[validate(custom = "validations::name")]
    pub name: String,
}
