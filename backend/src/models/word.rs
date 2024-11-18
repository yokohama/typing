use chrono::NaiveDateTime;

use serde::Serialize;
use sqlx::{
    query_as, 
    FromRow, 
    PgPool
};
use tracing::error;

use crate::middleware::error;
use crate::models;

#[derive(Debug, Serialize, FromRow)]
pub struct Entry {
    pub id: i32,
    pub shuting_id: i32,
    pub word: String,
    pub limit_sec: i32,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Create {
    pub shuting_id: i32,
    pub word: String,
    pub limit_sec: i32,
}

pub async fn create(
    pool: &PgPool, 
    params: Create
) -> Result<Entry, error::AppError> {

    let sql = r#"
        INSERT INTO words (
            shuting_id, 
            word,
            limit_sec,
            created_at
        )
        VALUES ($1, $2, $3, NOW())
        RETURNING 
            id, 
            shuting_id, 
            word, 
            limit_sec,
            created_at, 
            deleted_at
    "#;
            
    let result = query_as::<_,Entry>(sql)
        .bind(&params.shuting_id)
        .bind(&params.word)
        .bind(&params.limit_sec)
        .fetch_one(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    Ok(result)
}
