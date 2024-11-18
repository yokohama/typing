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
    let shuting = match models::shuting::create(
        pool, 
        models::shuting::Create {
            level: 1,
            description: "ひらがなにチャレンジ！".to_string(),
        },
    ).await {
        Ok(entry) => entry,
        Err(_e) => { return; }
    };
    
    let words = vec![
        "あいうえお",
        "かきくけこ",
        "さしすせそ",
        "たちつてと",
        "なにぬねの",
        "はひふへほ",
        "まみむめも",
        "やゆよ",
        "らりるれろ",
        "わをん",
    ];

    for i in 0..=words.len()-1 {
       let _ = models::word::create(
           pool,models::word::Create {
               shuting_id: shuting.id,
               word: words[i].to_string(),
               limit_sec: 10,
           }).await;
    }

    let shuting = match models::shuting::create(
        pool, 
        models::shuting::Create {
            level: 2,
            description: "英語にチャレンジ！".to_string(),
        },
    ).await {
        Ok(entry) => entry,
        Err(_e) => { return; }
    };

    let words = vec![
        "morning",
        "evening",
        "night",
    ];

    for i in 0..=words.len()-1 {
       let _ = models::word::create(
           pool,models::word::Create {
               shuting_id: shuting.id,
               word: words[i].to_string(),
               limit_sec: 10,
           }).await;
    }
}
