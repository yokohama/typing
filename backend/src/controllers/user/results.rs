use std::result;

use axum::{
    extract::{State, Path, Query},
    response::Json,
};
use serde::Serialize;
use sqlx::PgPool;
use tracing::debug;

use crate::middleware::error;
use crate::middleware::auth;
use crate::models;
use crate::requests::params;

pub async fn index(
    State(pool): State<PgPool>,
    claims: auth::Claims,
    Query(params): Query<params::result::LessonQuery>,
) -> Result<Json<impl Serialize>, error::AppError> {

    let result = models::result::all_by_user_id(
        &pool, 
        claims.sub,
        params.lesson_id,
    ).await?;

    Ok(Json(result))
}

pub async fn create(
    State(pool): State<PgPool>,
    claims: auth::Claims,
    Path(lesson_id): Path<i32>,
    Json(payload): Json<params::result::Create>,
) -> Result<Json<impl Serialize>, error::AppError> {

    let result = models::result::create(
        &pool, 
        models::result::Create {
            user_id: claims.sub,
            lesson_id: lesson_id,
            time: payload.time,
            answer: payload.answer,
        },
    ).await?;

    Ok(Json(result))
}

pub async fn show(
    State(pool): State<PgPool>,
    claims: auth::Claims,
    Path(id): Path<i32>,
) -> Result<Json<impl Serialize>, error::AppError> {

    let result = models::result::find(
        &pool, 
        claims.sub, 
        id
    ).await?;
    Ok(Json(result))
}
