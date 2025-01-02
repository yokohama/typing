use chrono::NaiveDateTime;

use serde::{Serialize, Deserialize};
use sqlx::{
    query_as, 
    FromRow, 
    PgPool
};
use tracing::{debug, error};

use crate::middleware::error;

#[derive(Debug, Serialize, FromRow)]
pub struct Entry {
    pub id: i32,
    pub parent_user_id: i32,
    pub child_user_id: i32,
    pub pair_user_name: String,
    pub point: i32,
    pub approved_at: Option<NaiveDateTime>,
    pub rejected_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Create {
    pub parent_user_id: i32,
    pub child_user_id: i32,
    pub point: i32,
}

#[derive(Debug, Serialize, FromRow)]
pub struct Created {
    pub id: i32,
    pub parent_user_id: i32,
    pub child_user_id: i32,
    pub point: i32,
    pub approved_at: Option<NaiveDateTime>,
    pub rejected_at: Option<NaiveDateTime>,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Update {
    pub id: i32,
    pub child_user_id: i32,
    pub point: i32,
    pub approved_at: Option<NaiveDateTime>,
    pub rejected_at: Option<NaiveDateTime>,
}

#[derive(Debug, Serialize, FromRow)]
pub struct IdPair {
    pub parent_user_id: Option<i32>,
    pub child_user_id: Option<i32>,
}

pub async fn create(
    pool: &PgPool, 
    params: Create
) -> Result<Created, error::AppError> {

    let sql = r#"
        INSERT INTO gift_requests (
            parent_user_id, 
            child_user_id,
            point,
            created_at
        )
        VALUES ($1, $2, $3, NOW())
        RETURNING 
            id, 
            parent_user_id, 
            child_user_id, 
            point, 
            approved_at, 
            rejected_at,
            created_at, 
            deleted_at
    "#;
            
    let result = query_as::<_, Created>(sql)
        .bind(&params.parent_user_id)
        .bind(&params.child_user_id)
        .bind(&params.point)
        .fetch_one(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    Ok(result)
}

pub async fn save(
    pool: &PgPool, 
    params: Update
) -> Result<Update, error::AppError> {

    let (column_name, value) = match (params.approved_at, params.rejected_at) {
        (Some(approved_at), _) => ("approved_at", approved_at),
        (_, Some(rejected_at)) => ("rejected_at", rejected_at),
        (None, None) => return Err(error::AppError::ValidationError("".to_string())),
    };

    let sql = format!(
        r#"
          UPDATE gift_requests SET {} = $1
          WHERE id = $2
          RETURNING 
              id, 
              point,
              child_user_id,
              approved_at, 
              rejected_at
        "#,
        column_name
    );

    let updated = query_as::<_, Update>(&sql)
        .bind(value)
        .bind(&params.id)
        .fetch_one(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    Ok(updated)
}

pub async fn find_all_by_user_id(
    pool: &PgPool, 
    id_pair: IdPair,
) -> Result<Vec<Entry>, error::AppError> {

    let (sql, bind_value) = if let Some(parent_user_id) = id_pair.parent_user_id {
        (
            r#"
                SELECT 
                  gift_requests.id, 
                  gift_requests.parent_user_id, 
                  gift_requests.child_user_id, 
                  users.name AS pair_user_name,
                  gift_requests.point, 
                  gift_requests.approved_at, 
                  gift_requests.rejected_at,
                  gift_requests.created_at, 
                  gift_requests.deleted_at
                FROM 
                  gift_requests
                LEFT JOIN
                  users
                ON
                  child_user_id = users.id
                WHERE
                  parent_user_id = $1
            "#,
            parent_user_id,
        )
    } else if let Some(child_user_id) = id_pair.child_user_id {
        (
            r#"
                SELECT 
                  gift_requests.id, 
                  gift_requests.parent_user_id, 
                  gift_requests.child_user_id, 
                  users.name AS pair_user_name,
                  gift_requests.point, 
                  gift_requests.approved_at, 
                  gift_requests.rejected_at,
                  gift_requests.created_at, 
                  gift_requests.deleted_at
                FROM 
                  gift_requests
                LEFT JOIN
                  users
                ON
                  parent_user_id = users.id
                WHERE
                  child_user_id = $1
            "#,
            child_user_id,
        )
    } else {
        return Err(error::AppError::NotFound("Record not found".to_string()));
    };

    let result = query_as::<_, Entry>(sql)
        .bind(bind_value)
        .fetch_all(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    Ok(result)
}
