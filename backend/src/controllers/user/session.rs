use axum::{
    Json,
    extract::State,
};
use sqlx::PgPool;
use serde::Deserialize;
use reqwest::Client;
use tracing::{ debug, error }; 

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
    name: String,
}

pub async fn google(
    State(pool): State<PgPool>,
    Json(payload): Json<GoogleTokenRequest>,
) -> Result<Json<serde_json::Value>, error::AppError> {

    let access_token = payload.google_token;

    let response = match Client::new()
        .get("https://www.googleapis.com/oauth2/v3/userinfo")
        .bearer_auth(&access_token)
        .send()
        .await
    {
        Ok(resp) => resp,
        Err(err) => {
            error!("Error sending request to Google API: {}", err);
            return Err(error::AppError::InternalServerError(
                "Error contacting Goole API".to_string()
            ));
        }
    };

    let status = response.status();
    let body_text = response.text().await.unwrap_or_else(|_| "Failed to read body".to_string());
    debug!("Google API response status: {}", status);
    debug!("Google API response body: {}", body_text);

    if !status.is_success() {
        error!(
            "Google API returned an error. Status: {}, Body: {}",
            status, body_text
        );
        return Err(error::AppError::InternalServerError(format!(
            "Google API error: {}",
            status
        )));
    }

    let user_info: GoogleUserInfo = match serde_json::from_str(&body_text) {
        Ok(info) => info,
        Err(err) => {
            error!(
                "Failed to parse user info from Google API response. Body: {}, Error: {}",
                body_text, err
            );
            // errorをfrontに返した際にフロント側でログアウトの実装をする。
            return Err(error::AppError::InternalServerError(
                "Failed to parse user info".to_string(),
            ));
        }
    };

    let user = user::create(&pool, user::Create{
        email: user_info.email.clone(),
        name: user_info.name.clone(),
    }).await?;

    auth::create_jwt(user.id)
}
