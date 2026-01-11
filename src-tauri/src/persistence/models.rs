use sqlx::FromRow;

use crate::domain::{Environment, EnvironmentValue, HttpHeader, HttpRequest, HttpRequestSet};

#[derive(Debug, FromRow)]
pub struct RequestSetRecord {
    pub id: u32,
    pub label: String,
}

#[derive(Debug, FromRow)]
pub struct RequestRecord {
    pub id: u32,
    pub request_set_id: u32,
    pub label: String,
    pub method: String,
    pub url: String,
    pub body: String,
}

#[derive(Debug, FromRow)]
pub struct RequestHeaderRecord {
    pub request_id: u32,
    pub key: String,
    pub value: String,
}

#[derive(Debug, FromRow)]
pub struct EnvironmentRecord {
    pub id: u32,
    pub label: String,
}

#[derive(Debug, FromRow)]
pub struct EnvironmentValueRecord {
    pub environment_id: u32,
    pub key: String,
    pub value: String,
}

impl From<RequestSetRecord> for HttpRequestSet {
    fn from(request_set_record: RequestSetRecord) -> Self {
        HttpRequestSet {
            id: Some(request_set_record.id),
            label: request_set_record.label,
            requests: vec![],
        }
    }
}

impl From<RequestRecord> for HttpRequest {
    fn from(request_record: RequestRecord) -> Self {
        HttpRequest {
            id: Some(request_record.id),
            label: request_record.label.to_owned(),
            method: request_record.method.to_owned(),
            url: request_record.url.to_owned(),
            headers: vec![],
            body: request_record.body.to_owned(),
        }
    }
}

impl From<RequestHeaderRecord> for HttpHeader {
    fn from(header_record: RequestHeaderRecord) -> Self {
        HttpHeader {
            key: header_record.key.to_owned(),
            value: header_record.value.to_owned(),
        }
    }
}

impl From<EnvironmentValueRecord> for EnvironmentValue {
    fn from(record: EnvironmentValueRecord) -> EnvironmentValue {
        EnvironmentValue {
            key: record.key,
            value: record.value,
        }
    }
}

impl From<EnvironmentRecord> for Environment {
    fn from(record: EnvironmentRecord) -> Environment {
        Environment {
            id: Some(record.id),
            label: record.label,
            values: vec![],
        }
    }
}
