use tracing::info;
use tower_http::trace::TraceLayer;
use tower_http::cors::{CorsLayer, Any};

mod routes;
mod middleware;
mod controllers;
mod models;
mod services;
mod requests;
mod utils;

#[tokio::main]
async fn main() {
    middleware::log::app_log_tracing();

    info!("#### start application ####");
    middleware::env::check_env();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let db_pool = middleware::db::get_db_pool().await;
    let router = routes::get_routing(db_pool);
    let app = router
        .layer(TraceLayer::new_for_http())
        .layer(cors);

    axum::serve(
        tokio::net::TcpListener::bind("0.0.0.0:3000").await.unwrap(),
        app
    ).await.unwrap();
}
