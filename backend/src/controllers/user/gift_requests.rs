use axum::{
    extract::State,
    response::Json,
};
use serde::Serialize;
use sqlx::PgPool;
use serde_json::{json, Value};

use crate::middleware::error;
use crate::middleware::auth;
use crate::models;
use crate::requests::params;
use crate::requests::validations::JsonValidatedForm;

pub async fn index(
    State(pool): State<PgPool>,
    claims: auth::Claims,
) -> Result<Json<impl Serialize>, error::AppError> {
    let result = find_all_by_user_id(pool, claims.sub).await?;
    Ok(Json(result))
}

pub async fn create(
    State(pool): State<PgPool>,
    claims: auth::Claims,
    payload: JsonValidatedForm<params::gift_request::Create>
) -> Result<Json<impl Serialize>, error::AppError> {

    if let Some(user) = models::user::find(&pool, claims.sub).await? {

        let validated_payload: params::gift_request::Create = payload.0;

        // 自分で持っているポイントよりも多い場合はバリデーションエラー。
        if validated_payload.point > user.point {
            return Err(error::AppError::ValidationError("ポイントが足りません。".to_string()));
        }

        let _result = models::gift_request::create(
            &pool, 
            models::gift_request::Create {
                parent_user_id: validated_payload.parent_user_id,
                child_user_id: validated_payload.child_user_id,
                point: validated_payload.point,
            }
        ).await?;

        let updated = models::user::save(
            &pool, 
            claims.sub,
            params::user::UpdateProfile {
              name: None,
              point: Some(user.point - validated_payload.point),
              total_point: None,
            }
        ).await?;

        Ok(Json(updated))
    } else {
        Err(error::AppError::NotFound("User not found.".to_string()))
    }
}

pub async fn update(
    State(pool): State<PgPool>,
    claims: auth::Claims,
    Json(payload): Json<models::gift_request::Update>
) -> Result<Json<impl Serialize>, error::AppError> {
    let child_user_id = payload.child_user_id;

    if let Some(user) = models::user::find(&pool, child_user_id).await? {
        let remaind_point = user.point - payload.point;

        // 残ポイントが０以下になるようならバリデーションエラー。
        if remaind_point < 0 {
            return Err(error::AppError::ValidationError("なぜか0ポイント以下なのでエラー".to_string()));
        }

        models::gift_request::save(&pool, payload).await?;

        let child_profile = params::user::UpdateProfile {
            name: None,
            point: Some(remaind_point),
            total_point: None,
        };
        let validated_payload: params::user::UpdateProfile = child_profile;
        models::user::save(&pool, child_user_id, validated_payload).await?;

        let pairs = find_all_by_user_id(pool, claims.sub).await?;

        Ok(Json(pairs))
    } else {
        Err(error::AppError::NotFound("User not found.".to_string()))
    }
}

async fn find_all_by_user_id(
    pool: PgPool,
    current_user_id: i32,
) -> Result<Value, error::AppError> {
    let my_children = models::gift_request::find_all_by_user_id(
        &pool, 
        models::gift_request::IdPair { 
            parent_user_id: Some(current_user_id), 
            child_user_id:  None,
        }
    ).await?;

    let my_parents = models::gift_request::find_all_by_user_id(
        &pool, 
        models::gift_request::IdPair { 
            parent_user_id: None,
            child_user_id: Some(current_user_id),
        }
    ).await?;

    Ok(json!({
        "myParents": my_parents,
        "myChildren": my_children,
    }))
}
