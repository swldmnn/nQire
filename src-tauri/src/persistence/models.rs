use http::Request;
use sqlx::FromRow;

use crate::domain::RequestMetaData;

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

impl From<RequestRecord> for Request<String> {
    fn from(request_record: RequestRecord) -> Self {
        let mapped = Request::builder()
            .method(request_record.method.as_str())
            .uri(request_record.url.to_owned())
            .extension(RequestMetaData {
                id: request_record.id,
                label: request_record.label.to_owned(),
            })
            .body(request_record.body.to_owned())
            .unwrap();

        mapped
    }
}
