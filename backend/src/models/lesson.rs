use chrono::NaiveDateTime;

use serde::Serialize;
use sqlx::{
    PgPool, 
    query_as, 
    FromRow
};
use tracing::{debug, error};

use crate::middleware::error;

#[derive(Debug, Serialize, FromRow)]
pub struct MinEntry {
    pub id: i32,
    pub title: String,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Entry {
    pub id: i32,
    pub title: String,
    pub example: String,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Create {
    pub title: String,
    pub example: String,
}

pub async fn create(
    pool: &PgPool, 
    params: Create
) -> Result<Entry, error::AppError> {
    let sql = r#"
        INSERT INTO lessons (
            title, 
            example,
            created_at
        )
        VALUES ($1, $2, NOW())
        RETURNING id, title, example, created_at, deleted_at
    "#;
            
    let lesson = query_as::<_, Entry>(sql)
        .bind(&params.title)
        .bind(&params.example)
        .fetch_one(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    Ok(lesson)
}

pub async fn all(
    pool: &PgPool, 
) -> Result<Vec<MinEntry>, error::AppError> {

    let sql = r#"
        SELECT id, title, created_at, deleted_at FROM lessons
    "#;

    match query_as::<_, MinEntry>(sql)
        .fetch_all(pool)
        .await {
            Ok(lessons) => {
                debug!("{:?}", lessons);
                Ok(lessons)
            },
            Err(e) => {
                error!("{:#?}", e);
                Err(error::AppError::DatabaseError(e.to_string()))
            }
        }

}

pub async fn find(
    pool: &PgPool, 
    id: i32,
) -> Result<Entry, error::AppError> {

    let sql = r#"
        SELECT id, title, example, created_at, deleted_at FROM lessons
        WHERE id = $1
    "#;

    let lesson = query_as::<_, Entry>(sql)
        .bind(id)
        .fetch_one(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    Ok(lesson)
}
