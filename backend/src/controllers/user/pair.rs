use axum::{
    extract::State,
    response::Json,
};
use serde::Serialize;
use sqlx::PgPool;

use crate::middleware::error;
use crate::middleware::auth;
use crate::models;
use crate::requests::params;

pub async fn create(
    State(pool): State<PgPool>,
    claims: auth::Claims,
    Json(payload): Json<params::pair::Create>
) -> Result<Json<impl Serialize>, error::AppError> {

    let result = models::parents_children::create(
        &pool, 
        models::parents_children::Create {
            parent_user_id: payload.parent_user_id,
            child_user_id: payload.child_user_id,
        }
    ).await?;

    Ok(Json(result))
}
