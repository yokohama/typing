use chrono::NaiveDateTime;

use serde::Serialize;
use sqlx::{
    PgPool, 
    query_as, 
    FromRow
};
use tracing::error;

use crate::middleware::error;
use crate::requests::params;

#[derive(Debug, Serialize, FromRow)]
pub struct Entry {
    pub id: i32,
    pub level: i32,
    pub limit_sec: i32,
    pub word: String,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Create {
    pub level: i32,
    pub limit_sec: i32,
    pub word: String,
}

pub async fn create(
    pool: &PgPool, 
    params: Create
) -> Result<Entry, error::AppError> {
    let sql = r#"
        INSERT INTO shutings (
            level, 
            limit_sec,
            word,
            created_at
        )
        VALUES ($1, $2, $3, NOW())
        RETURNING id, level, limit_sec, word, created_at, deleted_at
    "#;
            
    let shuting = query_as::<_, Entry>(sql)
        .bind(&params.level)
        .bind(&params.limit_sec)
        .bind(&params.word)
        .fetch_one(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    Ok(shuting)
}

pub async fn where_all(
    pool: &PgPool, 
    query: Option<params::shuting::Query>, 
) -> Result<Vec<Entry>, error::AppError> {

    let sql = if let Some(params::shuting::Query { level: Some(_) }) = query {
        r#"
            SELECT 
                id, 
                level,
                limit_sec,
                word,
                created_at, 
                deleted_at
            FROM 
                shutings
            WHERE 
                level = $1
        "#
    } else {
        r#"
            SELECT 
                id, 
                level,
                limit_sec,
                word,
                created_at, 
                deleted_at
            FROM 
                shutings
        "#
    };

    let mut sql_query = query_as::<_, Entry>(sql);
    if let Some(params::shuting::Query { level: Some(level) }) = query {
        sql_query = sql_query.bind(level);
    }

    match sql_query.fetch_all(pool).await {
        Ok(shutings) => Ok(shutings),
        Err(e) => {
            error!("{:#?}", e);
            Err(error::AppError::DatabaseError(e.to_string()))
        }
    }
}
