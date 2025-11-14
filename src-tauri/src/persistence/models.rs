use http::Request;
use sqlx::FromRow;

use crate::domain::{
    Environment, EnvironmentValue, HttpRequestSet, RequestHeader, RequestMetaData,
};

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
    pub id: u32,
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
    pub id: u32,
    pub environment_id: u32,
    pub key: String,
    pub value: String,
}

impl From<RequestSetRecord> for HttpRequestSet {
    fn from(request_set_record: RequestSetRecord) -> Self {
        HttpRequestSet {
            id: request_set_record.id,
            label: request_set_record.label,
            requests: vec![],
        }
    }
}

impl From<RequestRecord> for Request<String> {
    fn from(request_record: RequestRecord) -> Self {
        let request = Request::builder()
            .method(request_record.method.as_str())
            .uri(request_record.url.to_owned())
            .extension(RequestMetaData {
                id: request_record.id,
                request_set_id: request_record.request_set_id,
                label: request_record.label.to_owned(),
            })
            .body(request_record.body.to_owned())
            .unwrap();

        request
    }
}

impl From<RequestHeaderRecord> for RequestHeader {
    fn from(record: RequestHeaderRecord) -> RequestHeader {
        RequestHeader {
            request_id: record.request_id,
            key: record.key,
            value: record.value,
        }
    }
}

impl From<EnvironmentValueRecord> for EnvironmentValue {
    fn from(record: EnvironmentValueRecord) -> EnvironmentValue {
        EnvironmentValue {
            id: record.id,
            environment_id: record.environment_id,
            key: record.key,
            value: record.value,
        }
    }
}

impl From<EnvironmentRecord> for Environment {
    fn from(record: EnvironmentRecord) -> Environment {
        Environment {
            id: record.id,
            label: record.label,
            values: vec![],
        }
    }
}
