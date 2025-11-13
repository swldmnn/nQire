use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpRequestSetTransfer {
    pub typename: String,
    pub id: u16,
    pub label: String,
    pub requests: Vec<HttpRequestTransfer>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpRequestTransfer {
    pub typename: String,
    pub id: u16,
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