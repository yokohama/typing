use axum::{
    Router,
    routing::{get, post},
};

use sqlx::postgres::PgPool;

use crate::middleware::error;
use crate::controllers::welcome;
use crate::controllers::user;

pub fn get_routing(pool: PgPool) -> Router {
    Router::new()
        .route("/", get(welcome::show))
        .route("/api/auth/google", post(user::session::google))
        .route("/user/profile", get(user::profile::show))
        .route("/user/profile", post(user::profile::update))
        .with_state(pool)
        .fallback(error::not_found)
}
