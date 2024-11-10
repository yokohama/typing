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
    let titles = vec![
        "和尚のしっぱい",
        "天の羽衣",
        "カッパの雨ごい",
        "クジラと海のいかり",
        "ウグイス長者",
    ];
    let examples = vec![
        "むかしむかし、あるオテラに、オショウさんと２人のコゾウがいました。さて、ある冬のばんのこと。 オショウさんが「トウフを長方形に切ってクシにさし、ミソをぬって火にあぶったデンガクドウフ」を２０クシ、いろりに、グルリとならべてさし、 「寒いときは、これがいちばんじゃ。さあ、やけてきたぞ」 こうばしいかおりに、はなをヒクヒクさせました。 とうふにぬりつけたあまいみそが、こんがりとやけて、たまらなくいいにおいですそこへ、においをかぎつけたふたりのコゾウが、とんできました。オショウさんは、デンガクドウフをひとりでぜんぶ、たべるつもりでしたが、いまさらかくすわけにはいきません。 そこで、 「ちょうど、いいところにきた。おまえたちにもわけてやろう。だが、ただわけてやったのではつまらん。クシのかずをよみこんだ歌をつくりあって、そのかずだけ、たべることにしよう。".to_string(),
        "かきくけこ".to_string(),
        "さしすせそ".to_string(),
        "たちつてと".to_string(),
        "なにぬねの".to_string(),
    ];

    for i in 1..=5 {
        let new_lesson = models::lesson::Create {
            title: titles[i - 1].clone().to_string(),
            example: examples[i - 1].clone(),
        };
    
        let _ = models::lesson::create(pool, new_lesson).await;
    }
}
