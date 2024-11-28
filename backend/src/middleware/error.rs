use axum::extract::rejection::JsonRejection;
use reqwest;

use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::Json;
use serde::Serialize;

use axum::{
    http::request::Parts,
    extract::OriginalUri,
};

use serde_json::json;
use tracing::{info, error};

use thiserror::Error;
use validator::ValidationErrors;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("Resource not found: {0}")]
    NotFound(String),

    #[error("Missing credentials: {0}")]
    MissingCredentials(String),

    #[error("Database error: {0}")]
    DatabaseError(String),

    #[error("Internal server error: {0}")]
    InternalServerError(String),

    #[error("Validation error: {0}")]
    ValidationError(String),

    #[error("Form input error: {0}")]
    FormInputError(String),

    #[error("Dupulicate record error: {0}")]
    DuplicateRecordError(String),
}

#[derive(Serialize)]
struct ErrorResponse {
    error_type: String,
    message: String,
    details: Option<serde_json::Value>,
}

impl From<reqwest::Error> for AppError {
    fn from(error: reqwest::Error) -> Self {
        match error {
            _ => {
                error!("{:#?}", error);
                AppError::InternalServerError(error.to_string())
            }
        }
    }
}

impl From<sqlx::Error> for AppError {
    fn from(error: sqlx::Error) -> Self {
        error!("{:#?}", error);
        AppError::DatabaseError(error.to_string())
    }
}

impl From<ValidationErrors> for AppError {
    fn from(error: ValidationErrors) -> Self {
        let details = error
            .field_errors()
            .iter()
            .map(|(field, errors)| {
                let messages: Vec<String> = errors
                    .iter()
                    .map(|e| format!("{}: {:?}", e.code, e.params))
                    .collect();
                (field.to_string(), messages)
            })
            .collect::<serde_json::Value>();

        AppError::ValidationError(serde_json::to_string(&details).unwrap())
    }
}

impl From<JsonRejection> for AppError {
    fn from(error: JsonRejection) -> Self {
        error!("{:#?}", error);
        AppError::FormInputError(format!("Json error: {:?}", error))
    }
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_type, message, details) = match self {
            AppError::NotFound(msg) => (
                StatusCode::NOT_FOUND, 
                "NotFound", 
                msg, 
                None),
            AppError::MissingCredentials(msg) => (
                StatusCode::UNAUTHORIZED, 
                "MissingCredentials",
                msg, 
                None),
            AppError::DatabaseError(msg) => (
                StatusCode::INTERNAL_SERVER_ERROR, 
                "DatabaseError",
                msg, 
                None),
            AppError::InternalServerError(msg) => (
                StatusCode::INTERNAL_SERVER_ERROR, 
                "InternalServerError",
                msg, 
                None),
            AppError::ValidationError(msg) => {
                let cloned_msg = msg.clone();
                (
                    StatusCode::BAD_REQUEST, 
                    "ValidationError",
                    msg, 
                    Some(json!(cloned_msg))
                )
            },
            AppError::FormInputError(msg) => (
                StatusCode::BAD_REQUEST, 
                "FormInputError",
                msg, 
                None),
            AppError::DuplicateRecordError(msg) => (
                StatusCode::CONFLICT, 
                "DuplicateRecordError",
                msg, 
                None),
        };

        let body = Json(ErrorResponse {
            error_type: error_type.to_string(),
            message,
            details,
        });

        (status, body).into_response()
    }
}

pub async fn not_found(OriginalUri(uri): OriginalUri, parts: Parts) -> impl IntoResponse {
    info!("{} : [{}] - {}", 
        StatusCode::NOT_FOUND,
        parts.method,
        uri
    );
    AppError::NotFound(format!("{} is not found.", uri))
}
