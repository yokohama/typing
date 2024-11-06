use chrono::NaiveDateTime;

use serde::Serialize;
use sqlx::{
    PgPool, 
    query_as, 
    FromRow
};

use tracing::error;

use crate::middleware::error;
use crate::requests::{
    params::user::UpdateProfile,
    validations::JsonValidatedForm,
};

#[derive(Debug, Serialize, FromRow)]
pub struct Entry {
    pub id: i32,
    pub email: String,
    pub name: Option<String>,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, FromRow)]
pub struct Create {
    pub email: String,
}

/*
#[derive(Debug, Deserialize)]
pub struct Update {
    pub name: Option<String>,
}
*/

pub async fn find_by_email(
    pool: &PgPool, 
    email: String
) -> Result<Option<Entry>, error::AppError> {

    let sql = r#"
        SELECT id, email, name, created_at, deleted_at FROM users
        WHERE email = $1
    "#;

    match query_as::<_, Entry>(sql)
        .bind(email)
        .fetch_optional(pool)
        .await {
            Ok(user) => Ok(user),
            Err(e) => {
                error!("{:#?}", e);
                Err(error::AppError::DatabaseError(e.to_string()))
            }
        }

}

pub async fn find(
    pool: &PgPool, 
    id: i32, 
) -> Result<Option<Entry>, error::AppError> {

    let sql = r#"
        SELECT id, email, name, created_at, deleted_at FROM users
        WHERE id = $1
    "#;

    match query_as::<_, Entry>(sql)
        .bind(id)
        .fetch_optional(pool)
        .await {
            Ok(user) => Ok(user),
            Err(e) => {
                error!("{:#?}", e);
                Err(error::AppError::DatabaseError(e.to_string()))
            }
        }

}

pub async fn create(
    pool: &PgPool, 
    params: Create
) -> Result<Entry, error::AppError> {
    match find_by_email(&pool, params.email.clone()).await? {
        Some(user) => {
            Ok(user)
        },
        None => {
            let sql = r#"
            INSERT INTO users (
                email, 
                created_at
            )
            VALUES ($1, NOW())
            RETURNING id, email, created_at, deleted_at
            "#;
            
            let user = query_as::<_, Entry>(sql)
                .bind(&params.email)
                .fetch_one(pool)
                .await
                .map_err(|e| {
                    error!("{:#?}", e);
                    error::AppError::DatabaseError(e.to_string())
                })?;

            Ok(user)
        },
    }
}

pub async fn save(
    pool: &PgPool, 
    id: i32,
    params: JsonValidatedForm<UpdateProfile>
) -> Result<Entry, error::AppError> {
    let sql = r#"
        UPDATE users SET 
        name = $1
        WHERE id = $2
        RETURNING id, email, name, created_at, deleted_at
    "#;
            
    let user = query_as::<_, Entry>(sql)
        .bind(&params.0.name)
        .bind(id)
        .fetch_one(pool)
        .await
        .map_err(|e| {
            error!("{:#?}", e);
            error::AppError::DatabaseError(e.to_string())
        })?;

    Ok(user)
}
