use axum::{
    extract::State,
    response::Json,
};
use serde::Serialize;
use sqlx::PgPool;

use crate::middleware::error;

pub async fn show(State(_pool): State<PgPool>) -> Result<Json<impl Serialize>, error::AppError> {
    Ok(Json("hello world"))
}
