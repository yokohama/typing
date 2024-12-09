use axum::{
    Router,
    routing::{get, post},
};

use sqlx::postgres::PgPool;

use crate::middleware::error;
use crate::controllers::welcome;
use crate::controllers::config;
use crate::controllers::user;

pub fn get_routing(pool: PgPool) -> Router {
    Router::new()
        .route("/", get(welcome::show))
        .route("/api/auth/google", post(user::session::google))
        .route("/user/profile", get(user::profile::show))
        .route("/user/profile", post(user::profile::update))
        .route("/user/shutings", get(user::shutings::index))
        .route("/user/shutings/:id", get(user::shutings::show))
        .route("/user/shutings/:shuting_id/results", get(user::results::index))
        .route("/user/shutings/:shuting_id/results", post(user::results::create))
        .route("/user/results", get(user::results::index))
        .route("/user/results/:id", get(user::results::show))

        .route("/user/pairs", get(user::pair::index))
        .route("/user/pairs", post(user::pair::create))
        .route("/user/gift_requests", get(user::gift_requests::index))
        .route("/user/gift_requests", post(user::gift_requests::create))

        .route("/config", get(config::index))

        .with_state(pool)
        .fallback(error::not_found)
}
