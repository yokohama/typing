use axum::{
    Router,
    routing::{get, post},
};
use sqlx::postgres::PgPool;

use crate::controllers::user;

pub fn get_routing(pool: PgPool) -> Router<PgPool> {
    Router::new()
        .route("/profile", get(user::profile::show))
        .route("/profile", post(user::profile::update))
        .route("/shutings", get(user::shutings::index))
        .route("/shutings/:id", get(user::shutings::show))
        .route("/shutings/:shuting_id/results", get(user::results::index))
        .route("/shutings/:shuting_id/results", post(user::results::create))
        .route("/results", get(user::results::index))
        .route("/results/:id", get(user::results::show))
        .route("/pairs", get(user::pair::index))
        .route("/pairs", post(user::pair::create))
        .route("/gift_requests", get(user::gift_requests::index))
        .route("/gift_requests", post(user::gift_requests::create))
        .with_state(pool)
}
