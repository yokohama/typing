use chrono::NaiveDateTime;

use serde::Serialize;
use sqlx::{
    PgPool, 
    query_as, 
    FromRow
};

use tracing::{debug, error};

use crate::middleware::error;
use crate::requests::params::user::UpdateProfile;

#[derive(Debug, Serialize, FromRow)]
pub struct Entry {
    pub id: i32,
    pub email: String,
    pub name: Option<String>,
    pub point: i32,
    pub total_point: i32,
    pub created_at: NaiveDateTime,
    pub deleted_at: Option<NaiveDateTime>,
}

#[derive(Debug, FromRow)]
pub struct Create {
    pub email: String,
    pub name: String,
}

pub async fn find_by_email(
    pool: &PgPool, 
    email: String
) -> Result<Option<Entry>, error::AppError> {

    let sql = r#"
        SELECT 
          id, 
          email, 
          name, 
          point, 
          total_point,
          created_at, 
          deleted_at 
        FROM 
          users
        WHERE
          email = $1
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
        SELECT 
          id, 
          email, 
          name, 
          point, 
          total_point, 
          created_at, 
          deleted_at 
        FROM
          users
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
    let exist_user = find_by_email(&pool, params.email.clone()).await?;

    match exist_user {
        Some(exist_user) => Ok(exist_user),
        None => {
            let sql = r#"
            INSERT INTO users (
                email, 
                name,
                created_at
            )
            VALUES ($1, $2, NOW())
            RETURNING 
              id, 
              email, 
              name, 
              point, 
              total_point, 
              created_at, 
              deleted_at
            "#;
            
            let created_user = query_as::<_, Entry>(sql)
                .bind(&params.email)
                .bind(&params.name)
                .fetch_one(pool)
                .await
                .map_err(|e| {
                    error!("{:#?}", e);
                    error::AppError::DatabaseError(e.to_string())
                })?;

            Ok(created_user)
        },
    }
}

pub async fn save(
    pool: &PgPool,
    id: i32,
    params: UpdateProfile,
) -> Result<Entry, error::AppError> {
    let mut sql = String::from("UPDATE users SET ");
    let mut updates = vec![];
    let mut index = 1;

    if let Some(_name) = &params.name {
        updates.push(format!("name = ${}", index));
        index += 1;
    }

    if let Some(_point) = params.point {
        updates.push(format!("point = ${}", index));
        index += 1;
    }

    if let Some(_total_point) = params.total_point {
        updates.push(format!("total_point = ${}", index));
        index += 1;
    }

    if updates.is_empty() {
        return match find(pool, id).await? {
            Some(entry) => Ok(entry),
            None => Err(error::AppError::NotFound(format!("User with id {} not found", id))),
        };
    }

    sql.push_str(&updates.join(", "));
    sql.push_str(&format!(
        " WHERE 
            id = ${} 
          RETURNING 
            id, 
            email, 
            name, 
            point, 
            total_point, 
            created_at, 
            deleted_at
        ",
        index
    ));

    let mut query = sqlx::query_as::<_, Entry>(&sql);

    if let Some(name) = &params.name {
        query = query.bind(name);
    }
    if let Some(point) = params.point {
        query = query.bind(point);
    }
    if let Some(total_point) = params.total_point {
        query = query.bind(total_point);
    }
    query = query.bind(id);

    query.fetch_one(pool).await.map_err(|e| {
        error!("{:#?}", e);
        error::AppError::DatabaseError(e.to_string())
    })
}
