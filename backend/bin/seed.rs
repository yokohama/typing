use sqlx::{PgPool, query};

use myapp::middleware;
use myapp::models;

#[tokio::main]
async fn main() {
    let db_pool = middleware::db::get_db_pool().await;
    reset_database(&db_pool).await;
    run_migrations(&db_pool).await;
    //run_seeds(&db_pool).await;
}

async fn reset_database(pool: &PgPool) {
    query("DROP SCHEMA public CASCADE")
        .execute(pool)
        .await
        .expect("Error dropping schema");

    query("CREATE SCHEMA public")
        .execute(pool)
        .await
        .expect("Error creating schema");
}

async fn run_migrations(pool: &PgPool) {
    sqlx::migrate!("./migrations")
        .run(pool)
        .await
        .expect("Error running migrations");
}

/*
async fn run_seeds(pool: &PgPool) {
    for i in 1..=5 {
        let title = format!("Lesson{}", i);
        let new_lesson = models::lesson::New {
            title,
        };
    
        let _ = models::lesson::create(pool, new_lesson).await;
    }
}
*/
