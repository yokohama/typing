use axum::{
    extract::{State, Path, Query},
    response::Json,
};
use serde::Serialize;
use serde_json::json;
use sqlx::PgPool;

use tracing::error;

use crate::middleware::error;
use crate::middleware::auth;
use crate::models;
use crate::requests::params;

pub async fn index(
    State(pool): State<PgPool>,
    claims: auth::Claims,
    level: Option<Path<i32>>,
    Query(mut query): Query<params::result::Query>,
) -> Result<Json<impl Serialize>, error::AppError> {

    query.user_id = Some(claims.sub);

    if let Some(level) = level {
        query.level = Some(level.0)
    }

    let result = models::result::where_all(
        &pool, 
        Some(query),
    ).await?;

    Ok(Json(result))
}

pub async fn create(
    State(pool): State<PgPool>,
    claims: auth::Claims,
    Path(level): Path<i32>,
    Json(payload): Json<params::result::Create>,
) -> Result<Json<impl Serialize>, error::AppError> {

    let result = models::result::create(
        &pool, 
        models::result::Create {
            user_id: claims.sub,
            level: level,
            correct_count: payload.correct_count,
            incorrect_count: payload.incorrect_count,
            time: payload.time,
            perfect_count: payload.perfect_count,
        },
    ).await?;

    let point = update_point(
        &pool, 
        claims.sub, 
        result.score,
        result.time_bonus,
    ).await?;

    let mut result = serde_json::to_value(&result)
        .map_err(|err| {
            error!("Failed to serialize result: {}", err);
            error::AppError::InternalServerError("Failed to serialize result".to_string())
        })?;

    if let serde_json::Value::Object(ref mut map) = result {
        map.insert("point".to_string(), json!(point));
    }

    Ok(Json(result))
}

pub async fn show(
    State(pool): State<PgPool>,
    claims: auth::Claims,
    Path(id): Path<i32>,
) -> Result<Json<impl Serialize>, error::AppError> {

    let result = models::result::find(
        &pool, 
        id,
        claims.sub
    ).await?;
    Ok(Json(result))
}

async fn update_point(
    pool: &PgPool,
    user_id: i32,
    score: i32,
    time_bonus: i32,
) -> Result<i32, error::AppError> {
    let user = models::user::find(
          &pool, 
          user_id,
        ).await?
        .ok_or_else(|| {
            error::AppError::NotFound(format!(
                "User with id {} not found", 
                user_id,
            ))
        })?;

    let update = params::user::UpdateProfile {
        point: Some(user.point + score + time_bonus),
        ..Default::default()
    };

    let update_user = models::user::save(&pool, user_id, update).await?;

    Ok(update_user.point)
}
