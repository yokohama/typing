use axum::{
    extract::State,
    response::Json,
};
use serde::Serialize;
use sqlx::PgPool;
use serde_json::json;

use crate::middleware::error;
use crate::middleware::auth;
use crate::models;
use crate::models::gift_request;
use crate::requests::params;

use tracing::debug;

pub async fn index(
    State(pool): State<PgPool>,
    claims: auth::Claims,
) -> Result<Json<impl Serialize>, error::AppError> {

    let my_children = gift_request::find_all_by_user_id(
        &pool, 
        Some(claims.sub),
        None,
    ).await?;

    let my_parents = gift_request::find_all_by_user_id(
        &pool, 
        None,
        Some(claims.sub),
    ).await?;

    let result = json!({
        "myParents": my_parents,
        "myChildren": my_children,
    });

    Ok(Json(result))
}

pub async fn create(
    State(pool): State<PgPool>,
    claims: auth::Claims,
    Json(payload): Json<params::gift_request::Create>
) -> Result<Json<impl Serialize>, error::AppError> {

    let result = models::gift_request::create(
        &pool, 
        models::gift_request::Create {
            parent_user_id: payload.parent_user_id,
            child_user_id: payload.child_user_id,
            point: payload.point,
        }
    ).await?;

    Ok(Json(result))
}
