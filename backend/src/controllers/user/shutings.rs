use axum::{
    extract::{State, Path},
    response::Json,
};
use serde::Serialize;
use sqlx::PgPool;

use crate::middleware::error;
use crate::middleware::auth;
use crate::models::shuting;

pub async fn index(
    State(pool): State<PgPool>,
    _claims: auth::Claims,
) -> Result<Json<impl Serialize>, error::AppError> {

    let result = shuting::all(
        &pool, 
    ).await?;

    Ok(Json(result))
}

pub async fn show(
    State(pool): State<PgPool>,
    Path(id): Path<i32>,
    _claims: auth::Claims,
) -> Result<Json<impl Serialize>, error::AppError> {

    let result = shuting::find(
        &pool, 
        id,
    ).await?;

    Ok(Json(result))
}
