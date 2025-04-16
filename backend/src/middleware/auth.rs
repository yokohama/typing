use std::env;

use axum::{
    Json,
    async_trait,
    extract::FromRequestParts,
    http::request::Parts, RequestPartsExt,
};
use axum_extra::{
    headers::{
        authorization::Bearer, 
        Authorization
    },
    TypedHeader,
};

use serde::{Serialize, Deserialize};
use jsonwebtoken::{
    encode, 
    decode,
    Header, 
    Validation,
    EncodingKey,
    DecodingKey,
};
use chrono::{ Utc, Duration}; 
use tracing::error; 

use crate::middleware::error;

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: i32,
    pub exp: usize,
}

// テスト
#[async_trait]
impl<S> FromRequestParts<S> for Claims
where
    S: Send + Sync,
{
    type Rejection = error::AppError;

    async fn from_request_parts(parts: &mut Parts, _state: &S) -> Result<Self, Self::Rejection> {
        let TypedHeader(Authorization(bearer)) = parts
            .extract::<TypedHeader<Authorization<Bearer>>>()
            .await
            .map_err(|e| { 
                error!("{:#?}", e.to_string());
                error::AppError::MissingCredentials("Wrong token.".to_string())
            })?;

        // JWTトークンの認証
        let jwt_secret = get_secret()?;
        let token_data = decode::<Claims>(
            bearer.token(), 
            &DecodingKey::from_secret(jwt_secret.as_ref()),
            &Validation::default()
        )
            .map_err(|e| {
                error!("{:#?}", e.to_string());
                let msg = format!("Token: {} was missing.", bearer.token());
                error::AppError::MissingCredentials(msg.to_string())
            })?;

        Ok(token_data.claims)
    }
}

pub fn create_jwt(
    id: i32
) -> Result<Json<serde_json::Value>, error::AppError> {

    // JWTトークンの生成
    let jwt_secret = get_secret()?;
    let claims = Claims {
        sub: id,
        exp: (Utc::now() + Duration::hours(24)).timestamp() as usize,
    };

    match encode(&Header::default(), &claims, &EncodingKey::from_secret(jwt_secret.as_ref())) {
        Ok(jwt) => {
            //info!("Generated JWT for user: {}", id);
            Ok(Json(serde_json::json!({ "jwt": jwt })))
        }
        Err(err) => {
            error!("Error generating JWT: {}", err);
            Err(error::AppError::InternalServerError("Failed to generate JWT".to_string()))
        }
    }
}

fn get_secret() -> Result<String, error::AppError> {
    env::var("JWT_SECRET")
        .map_err(|_| error::AppError::InternalServerError("JWT_SECRET not set".to_string()))
}
