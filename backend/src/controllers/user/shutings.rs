use axum::{
    extract::{State, Query},
    response::Json,
};
use serde::Serialize;
use sqlx::PgPool;

use crate::middleware::error;
use crate::middleware::auth;
use crate::requests::params;
use crate::models::shuting;

pub async fn index(
    State(pool): State<PgPool>,
    _claims: auth::Claims,
    Query(params): Query<params::shuting::Query>,
) -> Result<Json<impl Serialize>, error::AppError> {

    let result = shuting::where_all(
        &pool, 
        Some(params),
    ).await?;

    Ok(Json(result))
}
