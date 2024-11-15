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
    pub user_id: i32,
    pub level: i32,
    pub correct: i32,
    pub incorrect: i32,
    pub score: i32,
    pub time: i32,
    pub perfect_count: i32,
    pub time_bonus: i32,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Create {
    pub user_id: i32,
    pub level: i32,
    pub correct: i32,
    pub incorrect: i32,
    pub time: i32,
    pub perfect_count: i32,
}

pub async fn create(
    pool: &PgPool, 
    params: Create
) -> Result<Entry, error::AppError> {

    let query =  crate::requests::params::shuting::Query {
        level: Some(1),
    };

    let shutings = models::shuting::where_all(pool, Some(query)).await?;
    let word_count = shutings.len() as i32;

    let total_limit_sec: i32 = shutings.iter().map(|s| s.limit_sec).sum();

   let score = calc_score(
        word_count, 
        params.correct, 
        params.incorrect, 
        params.perfect_count, 
        params.time, 
        total_limit_sec,
    );

    let sql = r#"
        INSERT INTO results (
            user_id, 
            level,
            correct,
            incorrect,
            score,
            time,
            perfect_count,
            time_bonus,
            created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING 
            id, 
            user_id, 
            level, 
            correct, 
            incorrect, 
            score, 
            time, 
            perfect_count, 
            time_bonus, 
            created_at, 
            deleted_at
    "#;
            
    let result = query_as::<_,Entry>(sql)
        .bind(&params.user_id)
        .bind(&params.level)
        .bind(&params.correct)
        .bind(&params.incorrect)
        .bind(score.0)
        .bind(&params.time)
        .bind(&params.perfect_count)
        .bind(score.1)
        .fetch_one(pool)
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
    user_id: i32,
) -> Result<Entry, error::AppError> {

    let sql = r#"
        SELECT 
          id, 
          user_id,
          level, 
          correct,
          incorrect,
          score, 
          time, 
          perfect_count,
          time_bonus,
          created_at, 
          deleted_at
        FROM 
          results
        WHERE
          id = $1 AND user_id = $2
    "#;

    let result = query_as::<_, Entry>(sql)
        .bind(id)
        .bind(user_id)
        .fetch_one(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    return Ok(result)
}

pub async fn where_all(
    pool: &PgPool, 
    query: Option<crate::requests::params::result::Query>,
) -> Result<Vec<Entry>, error::AppError> {

    let mut sql = r#"
        SELECT 
          id, 
          user_id,
          level, 
          correct,
          incorrect,
          score, 
          time, 
          perfect_count,
          time_bonus,
          created_at, 
          deleted_at
        FROM 
          results
    "#.to_string();

    let mut conditions = vec![];
    let mut binds = vec![];

    if let Some(user_id) = query.as_ref().and_then(|q| q.user_id) {
        conditions.push("user_id = $1");
        binds.push(user_id as i64);
    }

    if let Some(level) = query.as_ref().and_then(|q| q.level) {
        conditions.push("level = $2");
        binds.push(level as i64);
    }

    if !conditions.is_empty() {
        sql.push_str(" WHERE ");
        sql.push_str(&conditions.join(" AND "));
    }

    let mut query_builder = query_as::<_, Entry>(&sql);

    for bind in binds {
        query_builder = query_builder.bind(bind);
    }

    match query_builder.fetch_all(pool).await {
        Ok(results) => {
            Ok(results)
        },
        Err(e) => {
            error!("{:#?}", e);
            Err(error::AppError::DatabaseError(e.to_string()))
        }
    }
}

fn calc_score(
    word_count: i32,
    correct: i32,
    incorrect: i32,
    perfect: i32,
    current_time: i32,
    total_limit_sec: i32,
) -> (i32, i32) {
    let accuracy = if word_count > 0 {
        correct as f64 / word_count as f64
    } else {
        0.0
    };
    let penalty = if correct + incorrect > 0 {
        incorrect as f64 / (correct + incorrect) as f64
    } else {
        0.0
    };
    let perfect_bonus = if correct > 0 {
        perfect as f64 / correct as f64
    } else {
        0.0
    };

    let base_score = (accuracy * 100.0 - penalty * 50.0 + perfect_bonus * 20.0).max(0.0);
    let score = base_score.min(100.0).round() as i32;

    let time_bonus = if total_limit_sec > 0 {
        (1.0 - (current_time as f64 / total_limit_sec as f64).min(1.0)) * 20.0
    } else {
        0.0
    };
    let time_bonus = time_bonus.round() as i32;

    (score, time_bonus)
}
