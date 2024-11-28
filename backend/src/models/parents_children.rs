use chrono::NaiveDateTime;

use serde::Serialize;
use sqlx::{
    PgPool, 
    query_as, 
    FromRow
};

use tracing::error;

use crate::middleware::error;

#[derive(Debug, Serialize, FromRow)]
pub struct Entry {
    pub parent_user_id: i32,
    pub child_user_id: i32,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, FromRow)]
pub struct Create {
    pub parent_user_id: i32,
    pub child_user_id: i32,
}

pub async fn find_pair(
    pool: &PgPool, 
    a_user_id: i32,
    b_user_id: i32,
) -> Result<Option<Entry>, error::AppError> {

    let sql = r#"
        SELECT 
          parent_user_id, 
          child_user_id, 
          created_at, 
          deleted_at 
        FROM 
          parents_children
        WHERE
          (parent_user_id = $1 AND child_user_id = $2)
          OR
          (parent_user_id = $2 AND child_user_id = $1)
    "#;

    let result = query_as::<_, Entry>(sql)
        .bind(a_user_id)
        .bind(b_user_id)
        .fetch_optional(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    Ok(result)
}

pub async fn create(
    pool: &PgPool, 
    params: Create
) -> Result<Entry, error::AppError> {
    let exist = find_pair(
        &pool, 
        params.parent_user_id,
        params.child_user_id,
    ).await?;

    match exist {
        Some(pair) => {
            return Err(error::AppError::DuplicateRecordError(
                format!(
                    "pair('{}' and '{}') already exist",
                    pair.child_user_id,
                    pair.parent_user_id,
                )
            ));
        },
        None => {
            let sql = r#"
            INSERT INTO parents_children (
                parent_user_id, 
                child_user_id,
                created_at
            )
            VALUES ($1, $2, NOW())
            RETURNING 
              parent_user_id,
              child_user_id,
              created_at, 
              deleted_at
            "#;
            
            let pair = query_as::<_, Entry>(sql)
                .bind(&params.parent_user_id)
                .bind(&params.child_user_id)
                .fetch_one(pool)
                .await
                .map_err(|e| {
                    error!("{:#?}", e);
                    error::AppError::DatabaseError(e.to_string())
                })?;

            Ok(pair)
        },
    }
}