use axum::{
    extract::{State, Path},
    response::Json,
};
use serde::Serialize;
use sqlx::PgPool;

use crate::middleware::error;
use crate::middleware::auth;
use crate::models::lesson;

pub async fn index(
    State(pool): State<PgPool>,
    _claims: auth::Claims,
) -> Result<Json<impl Serialize>, error::AppError> {

    let lessons = lesson::all(&pool).await?;
    Ok(Json(lessons))
}

pub async fn show(
    State(pool): State<PgPool>,
    _claims: auth::Claims,
    Path(id): Path<i32>,
) -> Result<Json<impl Serialize>, error::AppError> {

    let lesson = lesson::find(&pool, id).await?;
    Ok(Json(lesson))
}
