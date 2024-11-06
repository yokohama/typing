use axum::{
    Json,
    extract::State,
};
use sqlx::PgPool;
use serde::Deserialize;
use reqwest::Client;
use tracing::error; 

use crate::middleware::error;
use crate::middleware::auth;
use crate::models::user;

#[derive(Deserialize)]
pub struct GoogleTokenRequest {
    #[serde(rename = "googleToken")]
    google_token: String,
}

#[derive(Deserialize, Debug)]
struct GoogleUserInfo {
    email: String,
}

pub async fn google(
    State(pool): State<PgPool>,
    Json(payload): Json<GoogleTokenRequest>,
) -> Result<Json<serde_json::Value>, error::AppError> {
    //info!("Received request with Google token: {}", payload.google_token);

    let access_token = payload.google_token;

    // Googleのユーザー情報を取得
    let user_info = match Client::new()
        .get("https://www.googleapis.com/oauth2/v3/userinfo")
        .bearer_auth(&access_token)
        .send()
        .await
    {
        Ok(response) => {
            match response.json::<GoogleUserInfo>().await {
                Ok(user_info) => {
                    //info!("User info received: {:?}", user_info);
                    user_info
                }
                Err(err) => {
                    error!("Failed to parse user info from Google API: {}", err);
                    return Err(error::AppError::InternalServerError("Failed to parse user info".to_string()));
                }
            }
        }
        Err(err) => {
            error!("Error sending request to Google API: {}", err);
            return Err(error::AppError::InternalServerError("Error contacting Google API".to_string()));
        }
    };

    // ユーザーが存在していない場合は、新規登録。
    let new_user = user::Create { email: user_info.email.clone() };
    let user = user::create(&pool, new_user).await?;

    auth::create_jwt(user.id)
}
