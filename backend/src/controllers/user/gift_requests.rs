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
use crate::requests::validations::JsonValidatedForm;

pub async fn index(
    State(pool): State<PgPool>,
    claims: auth::Claims,
) -> Result<Json<impl Serialize>, error::AppError> {

    let my_children = gift_request::find_all_by_user_id(
        &pool, 
        gift_request::IdPair { 
            parent_user_id: Some(claims.sub), 
            child_user_id:  None,
        }
    ).await?;

    let my_parents = gift_request::find_all_by_user_id(
        &pool, 
        gift_request::IdPair { 
            parent_user_id: None,
            child_user_id: Some(claims.sub),
        }
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
    payload: JsonValidatedForm<params::gift_request::Create>
) -> Result<Json<impl Serialize>, error::AppError> {

    if let Some(user) = models::user::find(&pool, claims.sub).await? {

        let validated_payload: params::gift_request::Create = payload.0;

        // Validate request point within owned point.
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

        return Ok(Json(updated));
    } else {
        Err(error::AppError::NotFound("User not found.".to_string()))
    }
}
