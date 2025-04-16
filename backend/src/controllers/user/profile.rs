use axum::{
    extract::{State, Query},
    response::Json,
};
use serde::Serialize;
use sqlx::PgPool;

use crate::middleware::error;
use crate::middleware::auth;
use crate::models::user;
use crate::requests::{
    params,
    validations::JsonValidatedForm,
};

pub async fn show(
    State(pool): State<PgPool>,
    claims: auth::Claims,
    Query(query): Query<params::user::Query>,
) -> Result<Json<impl Serialize>, error::AppError> {

    let user = if let Some(user_id) = query.user_id {
        user::find(&pool, user_id).await?
    } else {
        user::find(&pool, claims.sub).await?
    };

    //let user = user::find(&pool, claims.sub).await?;
    Ok(Json(user))
}

pub async fn update(
    State(pool): State<PgPool>,
    claims: auth::Claims,
    payload: JsonValidatedForm<params::user::UpdateProfile>
) -> Result<Json<impl Serialize>, error::AppError> {

    let validated_payload: params::user::UpdateProfile = payload.0;
    let user = user::save(&pool, claims.sub, validated_payload).await?;
    Ok(Json(user))
}
