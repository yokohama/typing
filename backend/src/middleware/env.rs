/*
 * 絶対に値が必要なキー
 * これがないとpanicにしてappの起動を止める
 */
use std::env;
use tracing::debug;

use serde_json::{json, Value};

pub fn check_env() {
    let env_keys = vec![
        "RUST_BACKTRACE",
        "DATABASE_URL",
        "JWT_SECRET",
        "ALLOWED_ORIGINS",
        "GIFT_REQUEST_COIN_STEP",
    ];

    for key in env_keys {
        match env::var(key) {
            Ok(value) if !value.is_empty() => {
                debug!("Loaded env: {} = {}", key, value);
            },
            Ok(_) => {
                panic!("env {} is required but empty", key);
            },
            Err(_) => {
                panic!("env {} is required but missing", key);
            }
        }
    }
}

/*
 * This config is providind for front service.
 */
pub async fn config() -> Value {
    let gift_request_coin_step = env::var("GIFT_REQUEST_COIN_STEP")
        .unwrap_or_else(|_| "未設定".to_string());

    json!([
        {"GIFT_REQUEST_COIN_STEP": gift_request_coin_step},
    ])
}
