use axum::response::Json;
use serde_json::Value;

use crate::middleware;

pub async fn index() -> Result<Json<Value>, middleware::error::AppError> {
    let config = middleware::env::config().await;

    Ok(Json(config))
}
