use std::error::Error;

use chrono::NaiveDateTime;

use serde::Serialize;
use sqlx::{
    PgPool, 
    query_as, 
    FromRow
};
use tracing::error;

use crate::controllers::user::shutings;
use crate::models;
use crate::middleware::error;
use crate::requests::params;

#[derive(Debug, Serialize, FromRow)]
pub struct MinEntry {
    pub id: i32,
    pub level: i32,
    pub description: String,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Entry {
    pub id: i32,
    pub level: i32,
    pub description: String,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
    pub words: Option<Vec<models::word::Entry>>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Create {
    pub level: i32,
    pub description: String,
}

pub async fn create(
    pool: &PgPool, 
    params: Create
) -> Result<MinEntry, error::AppError> {
    let sql = r#"
        INSERT INTO shutings (
            level, 
            description,
            created_at
        )
        VALUES ($1, $2, NOW())
        RETURNING id, level, description, created_at, deleted_at
    "#;
            
    let result = query_as::<_, MinEntry>(sql)
        .bind(&params.level)
        .bind(&params.description)
        .fetch_one(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    Ok(result)
}

pub async fn all(
    pool: &PgPool, 
) -> Result<Vec<MinEntry>, error::AppError> {

    let sql = r#"
          SELECT 
            id, 
            level,
            description,
            created_at, 
            deleted_at
          FROM 
            shutings
      "#;

    let result = query_as::<_, MinEntry>(sql)
        .fetch_all(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    Ok(result)
}

pub async fn find(
    pool: &PgPool, 
    id: i32,
) -> Result<Entry, error::AppError> {

    let sql = r#"
        SELECT 
          id, 
          level, 
          description,
          created_at, 
          deleted_at
        FROM 
          shutings
        WHERE
          id = $1
    "#;

    let shuting_result = query_as::<_, MinEntry>(sql)
        .bind(id)
        .fetch_one(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    let sql = r#"
        SELECT 
          id, 
          shuting_id, 
          word,
          limit_sec,
          created_at, 
          deleted_at
        FROM 
          words
        WHERE
          shuting_id = $1
    "#;

    let word_results = query_as::<_, models::word::Entry>(sql)
        .bind(shuting_result.id)
        .fetch_all(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    let result = Entry {
        id: shuting_result.id,
        level: shuting_result.level,
        description: shuting_result.description,
        created_at: shuting_result.created_at,
        deleted_at: shuting_result.deleted_at,
        words: Some(word_results),
    };

    return Ok(result)
}
