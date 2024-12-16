mod user;

use axum::{
    Router,
    routing::{get, post},
};

use sqlx::postgres::PgPool;

use crate::middleware::error;
use crate::controllers::welcome;
use crate::controllers::config;
use crate::controllers;

pub fn get_routing(pool: PgPool) -> Router {
    let root_routes = Router::new().route("/", get(welcome::show));

    let user_routes = user::get_routing(pool.clone());

    let api_v1_routes = Router::new()
        .route("/auth/google", post(controllers::user::session::google))
        .route("/config", get(config::index))
        .nest("/user", user_routes);

    root_routes
        .nest("/api/v1", api_v1_routes)
        .with_state(pool)
        .fallback(error::not_found)
}
