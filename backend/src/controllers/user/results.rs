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
    shuting_id: Option<Path<i32>>,
    Query(mut query): Query<params::result::Query>,
) -> Result<Json<impl Serialize>, error::AppError> {

    query.user_id = Some(claims.sub);

    if let Some(shuting_id) = shuting_id {
        query.shuting_id = Some(shuting_id.0)
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
    Path(shuting_id): Path<i32>,
    Json(payload): Json<params::result::Create>,
) -> Result<Json<impl Serialize>, error::AppError> {

    let result = models::result::create(
        &pool, 
        models::result::Create {
            user_id: claims.sub,
            shuting_id,
            correct_count: payload.correct_count,
            incorrect_count: payload.incorrect_count,
            completion_time: payload.completion_time,
            perfect_within_correct_count: payload.perfect_within_correct_count,
        },
    ).await?;

    let (owned_coin, total_gain_coin) = update_coin(
        &pool, 
        claims.sub, 
        result.gain_coin,
    ).await?;

    let mut result = serde_json::to_value(&result)
        .map_err(|err| {
            error!("Failed to serialize result: {}", err);
            error::AppError::InternalServerError("Failed to serialize result".to_string())
        })?;

    if let serde_json::Value::Object(ref mut map) = result {
        map.insert("owned_coin".to_string(), json!(owned_coin));
        map.insert("total_gain_coin".to_string(), json!(total_gain_coin));
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

async fn update_coin(
    pool: &PgPool,
    user_id: i32,
    coin: i32,
) -> Result<(i32, i32), error::AppError> {

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
        coin: Some(user.coin + coin),
        total_gain_coin: Some(user.total_gain_coin + coin),
        ..Default::default()
    };

    let update_user = models::user::save(
        &pool, 
        user_id, 
        update
    ).await?;

    Ok((update_user.coin, update_user.total_gain_coin))
}
