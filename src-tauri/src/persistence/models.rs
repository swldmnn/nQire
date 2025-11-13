use sqlx::FromRow;

#[derive(Debug, FromRow)]
pub struct RequestSetRecord {
    pub id: u16,
    pub label: String,
}

#[derive(Debug, FromRow)]
pub struct RequestRecord {
    pub id: u16,
    pub request_set_id: u16,
    pub label: String,
    pub method: String,
    pub url: String,
    pub body: String,
}

#[derive(Debug, FromRow)]
pub struct RequestHeaderRecord {
    pub id: u16,
    pub request_id: u16,
    pub key: String,
    pub value: String,
}