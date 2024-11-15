use serde::Deserialize;

#[derive(Deserialize)]
pub struct Query {
    pub level: Option<i32>,
}
