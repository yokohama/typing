use std::env;

use axum_extra::headers::Allow;
use tower_http::cors::{
    CorsLayer, 
    AllowOrigin,
    Any,
};
use tracing::debug;

pub fn init() -> CorsLayer {
    let origins = env::var("ALLOWED_ORIGINS")
        .unwrap_or_default()
        .split(',')
        .map(|origin| origin.trim().to_string())
        .collect::<Vec<_>>();

    debug!("Allowed origins: {:#?}", origins);

    let allow_origins = if origins.is_empty() {
        AllowOrigin::any()
    } else {
        AllowOrigin::list(
            origins
                .iter()
                .map(|origin| origin.parse().unwrap())
        )
    };

    CorsLayer::new()
        .allow_origin(allow_origins)
        .allow_methods(Any)
        .allow_headers(Any)
}
