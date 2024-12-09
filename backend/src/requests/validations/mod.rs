use std::env;

use axum::{
    async_trait,
    extract::{
        Request,
        rejection::JsonRejection,
        FromRequest
    },
    response::Json,
};
use validator::Validate;
use serde::de::DeserializeOwned;
use validator::ValidationError;
use tracing::info;

use crate::middleware::error;

#[derive(Debug, Clone, Default)]
pub struct JsonValidatedForm<T>(pub T);

#[async_trait]
impl<T, S> FromRequest<S> for JsonValidatedForm<T>
where
    T: DeserializeOwned + Validate,
    S: Send + Sync,
    Json<T>: FromRequest<S, Rejection = JsonRejection>,
{
    type Rejection = error::AppError;

    async fn from_request(
        req: Request, 
        state: &S
    ) -> Result<Self, Self::Rejection> {

        let result = Json::<T>::from_request(req, state).await;
        match result {
            Ok(Json(value)) => {
                if let Err(e) = value.validate() {
                    info!("{:#?}", e);
                    Err(error::AppError::from(e))
                } else {
                    Ok(Self(value))
                }
            },
            Err(e) => {
                info!("{:#?}", e);
                Err(error::AppError::from(e))
            }
        }
    }
}

pub fn name(value: &str) -> Result<(), ValidationError> {
    let char_count = value.chars().count();

    if char_count <= 10 {
        Ok(())
    } else {
        let mut error = ValidationError::new("Invalid name length");
        error.add_param("msg".into(), &"名前は10文字以内です。".to_string());
        Err(error)
    }
}

pub fn valid_point(value: i32) -> Result<(), ValidationError> {
    let step = env::var("GIFT_REQUEST_COIN_STEP")
        .ok()
        .and_then(|s| s.parse::<i32>().ok())
        .unwrap_or(20);

    if value <= 0 || value % step != 0 {
        return Err(ValidationError::new("数字の値が不正です。"));
    }

    Ok(())
}
