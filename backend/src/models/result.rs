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
use crate::utils::score;
use crate::requests;

#[derive(Debug, Serialize, FromRow)]
pub struct Entry {
    pub id: i32,
    pub user_id: i32,
    pub shuting_id: i32,
    pub correct_count: i32,
    pub incorrect_count: i32,
    pub perfect_within_correct_count: i32,
    pub completion_time: i32,
    pub score: i32,
    pub gain_coin: i32,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Create {
    pub user_id: i32,
    pub shuting_id: i32,
    pub correct_count: i32,
    pub incorrect_count: i32,
    pub perfect_within_correct_count: i32,
    pub completion_time: i32,
}

pub async fn create(
    pool: &PgPool, 
    params: Create
) -> Result<Entry, error::AppError> {

    // shutings情報の取得
    let (word_count, total_limit_sec) = get_shuting_info(&pool, params.shuting_id).await?;

    // results情報の取得
    let query = requests::params::result::Query {
        user_id: Some(params.user_id),
        shuting_id: Some(params.shuting_id),
    };
    let shuting_total_score: i32 = where_all(&pool, Some(query))
        .await?
        .iter()
        .map(|r| r.score)
        .sum();

    let (score, coin) = score::get_score_and_coin(
        word_count, 
        params.correct_count, 
        params.perfect_within_correct_count, 
        params.completion_time, 
        total_limit_sec,
        shuting_total_score,
    );

    let sql = r#"
        INSERT INTO results (
            user_id, 
            shuting_id,
            correct_count,
            incorrect_count,
            perfect_within_correct_count,
            completion_time,
            score,
            gain_coin,
            created_at
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
        RETURNING 
            id, 
            user_id, 
            shuting_id, 
            correct_count, 
            incorrect_count, 
            perfect_within_correct_count, 
            completion_time, 
            score,
            gain_coin,
            created_at, 
            deleted_at
    "#;
            
    let result = query_as::<_,Entry>(sql)
        .bind(&params.user_id)
        .bind(&params.shuting_id)
        .bind(&params.correct_count)
        .bind(&params.incorrect_count)
        .bind(&params.perfect_within_correct_count)
        .bind(&params.completion_time)
        .bind(score)
        .bind(coin)
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
          shuting_id, 
          correct_count,
          incorrect_count,
          perfect_within_correct_count,
          completion_time, 
          score,
          gain_coin,
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
          shuting_id, 
          correct_count,
          incorrect_count,
          perfect_within_correct_count,
          completion_time, 
          score,
          gain_coin,
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

    if let Some(shuting_id) = query.as_ref().and_then(|q| q.shuting_id) {
        conditions.push("shuting_id = $2");
        binds.push(shuting_id as i64);
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

async fn get_shuting_info(pool: &PgPool, shuting_id: i32) -> Result<(i32, i32), error::AppError> {
    let shuting = models::shuting::find(&pool, shuting_id).await?;

    let word_count: i32 = shuting.words
        .as_ref()
        .map(|words| words.len() as i32)
        .unwrap_or(0);

    let total_limit_sec: i32 = shuting.words
        .as_ref()
        .map(|words| {
            words.iter()
                .map(|word| word.limit_sec)
                .sum::<i32>()
        })
        .unwrap_or(0);

    Ok((word_count, total_limit_sec))
}
