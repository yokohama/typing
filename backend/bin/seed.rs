use sqlx::{PgPool, query};

use myapp::middleware;
use myapp::models;

#[tokio::main]
async fn main() {
    let db_pool = middleware::db::get_db_pool().await;
    reset_database(&db_pool).await;
    run_migrations(&db_pool).await;
    run_seeds(&db_pool).await;
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

async fn run_seeds(pool: &PgPool) {
    let words = vec![
        "あいうえお",
        "かきくけこ",
        "さしすせそ",
        "たちつてと",
        "なにぬねの",
    ];

    for i in 0..=4 {
        let new_shuting = models::shuting::Create {
            level: 1,
            limit_sec: 5,
            word: words[i].to_string()
        };
    
        let _ = models::shuting::create(pool, new_shuting).await;
    }
}
