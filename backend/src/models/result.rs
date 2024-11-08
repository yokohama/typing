use chrono::NaiveDateTime;
use strsim::jaro;

use serde::Serialize;
use sqlx::{
    PgPool, 
    query_as, 
    FromRow
};
use tracing::error;

use crate::middleware::error;
use crate::models::lesson;

#[derive(Debug, Serialize, FromRow)]
pub struct Created {
    pub id: i32,
    pub user_id: i32,
    pub lesson_id: i32,
    pub score: f64,
    pub time: i32,
    pub answer: String,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct MinEntry {
    pub id: i32,
    pub lesson_id: i32,
    pub score: f64,
    pub time: i32,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
    pub lesson_title: String,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Entry {
    pub id: i32,
    pub user_id: i32,
    pub lesson_id: i32,
    pub score: f64,
    pub time: i32,
    pub answer: String,
    pub lesson_title: String,
    pub lesson_example: String,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Create {
    pub user_id: i32,
    pub lesson_id: i32,
    pub time: i32,
    pub answer: String,
}

pub async fn create(
    pool: &PgPool, 
    params: Create
) -> Result<Created, error::AppError> {

    let lesson = lesson::find(&pool, params.lesson_id.clone()).await?;

    let score = calc_score(
        lesson.example,
        params.answer.clone(), 
        params.time.clone()
    );

    let sql = r#"
        INSERT INTO results (
            user_id, 
            lesson_id,
            score,
            time,
            answer,
            created_at
        )
        VALUES ($1, $2, $3, $4, $5, NOW())
        RETURNING id, user_id, lesson_id, score, time, answer, created_at, deleted_at
    "#;
            
    let result = query_as::<_, Created>(sql)
        .bind(&params.user_id)
        .bind(&params.lesson_id)
        .bind(score)
        .bind(&params.time)
        .bind(&params.answer)
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
    user_id: i32,
    id: i32,
) -> Result<Entry, error::AppError> {

    let sql = r#"
        SELECT 
          results.id, 
          results.user_id, 
          results.lesson_id, 
          results.score, 
          results.time, 
          results.answer, 
          results.created_at, 
          results.deleted_at, 
          lessons.title AS lesson_title,
          lessons.example AS lesson_example
        FROM results
        LEFT JOIN lessons ON lessons.id = results.lesson_id
        WHERE results.user_id = $1 AND results.id = $2
    "#;

    let lesson = query_as::<_, Entry>(sql)
        .bind(user_id)
        .bind(id)
        .fetch_one(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    Ok(lesson)
}

pub async fn all_by_user_id(
    pool: &PgPool, 
    user_id: i32,
    lesson_id: Option<i32>,
) -> Result<Vec<MinEntry>, error::AppError> {

    let sql = if let Some(lesson_id) = lesson_id {
        r#"
            SELECT 
              results.id, 
              results.lesson_id, 
              results.score, 
              results.time, 
              results.created_at, 
              results.deleted_at,
              lessons.title AS lesson_title
            FROM 
              results
            LEFT JOIN 
              lessons 
            ON 
              lessons.id = results.lesson_id
            WHERE 
              user_id = $1 AND results.lesson_id = $2
        "#
    } else {
        r#"
            SELECT 
              results.id, 
              results.lesson_id, 
              results.score, 
              results.time, 
              results.created_at, 
              results.deleted_at,
              lessons.title AS lesson_title
            FROM 
              results
            LEFT JOIN 
              lessons 
            ON
              lessons.id = results.lesson_id
            WHERE 
              user_id = $1
        "#
    };

    let mut query = query_as::<_, MinEntry>(sql).bind(user_id);
    if let Some(lesson_id) = lesson_id {
        query = query.bind(lesson_id);
    }

    match query.fetch_all(pool).await {
        Ok(results) => {
            Ok(results)
        },
        Err(e) => {
            error!("{:#?}", e);
            Err(error::AppError::DatabaseError(e.to_string()))
        }
    }
}

/*
 * ユーザーが入力した回答を文字列の一致度でscoreを計算。
 * time(回答にかかった時間)も係数として入れる。
 */
fn calc_score(example: String, answer: String, time: i32) -> i32 {
    let similarity = jaro(&answer, &example);
    let similarity_score = (similarity * 100.0) as i32;
    let time_penalty = (time as f64 * 0.1).min(50.0) as i32;
    (similarity_score - time_penalty).max(0)
}
