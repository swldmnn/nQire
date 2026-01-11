use serde::{Deserialize, Serialize};

use crate::domain::{Environment, EnvironmentValue, HttpHeader, HttpRequest, HttpRequestSet};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpRequestSetTransfer {
    pub typename: String,
    pub id: Option<u32>,
    pub label: String,
    pub requests: Vec<HttpRequestTransfer>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpRequestTransfer {
    pub typename: String,
    pub id: Option<u32>,
    pub label: String,
    pub method: String,
    pub url: String,
    pub headers: Vec<HttpHeaderTransfer>,
    pub body: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpResponseTransfer {
    pub status: u16,
    pub body: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpHeaderTransfer {
    pub key: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnvironmentTransfer {
    pub typename: String,
    pub id: Option<u32>,
    pub label: String,
    pub values: Vec<EnvironmentValueTransfer>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnvironmentValueTransfer {
    pub key: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ErrorTransfer {
    pub typename: String,
    pub error_message: String,
}

impl From<HttpRequestTransfer> for HttpRequest {
    fn from(request_transfer: HttpRequestTransfer) -> HttpRequest {
        HttpRequest {
            id: request_transfer.id,
            label: request_transfer.label,
            method: request_transfer.method,
            url: request_transfer.url,
            body: request_transfer.body,
            headers: request_transfer
                .headers
                .into_iter()
                .map(HttpHeader::from)
                .collect(),
        }
    }
}

impl From<HttpHeaderTransfer> for HttpHeader {
    fn from(header_transfer: HttpHeaderTransfer) -> HttpHeader {
        HttpHeader {
            key: header_transfer.key,
            value: header_transfer.value,
        }
    }
}

impl From<HttpHeader> for HttpHeaderTransfer {
    fn from(header: HttpHeader) -> HttpHeaderTransfer {
        HttpHeaderTransfer {
            key: header.key.to_owned(),
            value: header.value.to_owned(),
        }
    }
}

impl From<HttpRequest> for HttpRequestTransfer {
    fn from(request: HttpRequest) -> HttpRequestTransfer {
        HttpRequestTransfer {
            typename: "HttpRequest".to_owned(),
            id: request.id,
            label: request.label.to_owned(),
            method: request.method.to_owned(),
            url: request.url.to_owned(),
            body: request.body.to_owned(),
            headers: request
                .headers
                .into_iter()
                .map(HttpHeaderTransfer::from)
                .collect(),
        }
    }
}

impl From<HttpRequestSet> for HttpRequestSetTransfer {
    fn from(request_set: HttpRequestSet) -> HttpRequestSetTransfer {
        HttpRequestSetTransfer {
            typename: "HttpRequestSet".to_owned(),
            id: request_set.id,
            label: request_set.label.to_owned(),
            requests: request_set
                .requests
                .into_iter()
                .map(HttpRequestTransfer::from)
                .collect(),
        }
    }
}

impl From<HttpRequestSetTransfer> for HttpRequestSet {
    fn from(request_set_transfer: HttpRequestSetTransfer) -> HttpRequestSet {
        HttpRequestSet {
            id: request_set_transfer.id,
            label: request_set_transfer.label.to_owned(),
            requests: request_set_transfer
                .requests
                .into_iter()
                .map(HttpRequest::from)
                .collect(),
        }
    }
}

impl From<Environment> for EnvironmentTransfer {
    fn from(environment: Environment) -> EnvironmentTransfer {
        EnvironmentTransfer {
            typename: "Environment".to_owned(),
            id: environment.id,
            label: environment.label,
            values: environment
                .values
                .into_iter()
                .map(EnvironmentValueTransfer::from)
                .collect(),
        }
    }
}

impl From<EnvironmentValue> for EnvironmentValueTransfer {
    fn from(environment_value: EnvironmentValue) -> EnvironmentValueTransfer {
        EnvironmentValueTransfer {
            key: environment_value.key,
            value: environment_value.value,
        }
    }
}

impl From<EnvironmentTransfer> for Environment {
    fn from(environment_transfer: EnvironmentTransfer) -> Environment {
        Environment {
            id: environment_transfer.id,
            label: environment_transfer.label,
            values: environment_transfer
                .values
                .into_iter()
                .map(EnvironmentValue::from)
                .collect(),
        }
    }
}

impl From<EnvironmentValueTransfer> for EnvironmentValue {
    fn from(environment_value_transfer: EnvironmentValueTransfer) -> EnvironmentValue {
        EnvironmentValue {
            key: environment_value_transfer.key,
            value: environment_value_transfer.value,
        }
    }
}
