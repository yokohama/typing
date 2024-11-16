use axum::{
    extract::State,
    response::Json,
};
use serde::Serialize;
use sqlx::PgPool;

use crate::middleware::error;
use crate::middleware::auth;
use crate::models::user;
use crate::requests::{
    params::user::UpdateProfile,
    validations::JsonValidatedForm,
};

pub async fn show(
    State(pool): State<PgPool>,
    claims: auth::Claims,
) -> Result<Json<impl Serialize>, error::AppError> {

    let user = user::find(&pool, claims.sub).await?;
    Ok(Json(user))
}

pub async fn update(
    State(pool): State<PgPool>,
    claims: auth::Claims,
    payload: JsonValidatedForm<UpdateProfile>,
) -> Result<Json<impl Serialize>, error::AppError> {

    let validated_payload: UpdateProfile = payload.0;
    let user = user::save(&pool, claims.sub, validated_payload).await?;

    Ok(Json(user))
}
