use http::Request;
use serde::{Deserialize, Serialize};

use crate::domain::{HttpRequestSet, RequestMetaData};

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

impl From<Request<String>> for HttpRequestTransfer {
    fn from(request: Request<String>) -> Self {
        let mut id = 0;
        let mut label = "no name";

        if let Some(meta_data) = request.extensions().get::<RequestMetaData>() {
            id = meta_data.id;
            label = &meta_data.label
        }

        let request_transfer = HttpRequestTransfer {
            typename: "HttpRequest".to_owned(),
            id: id,
            label: label.to_owned(),
            method: request.method().to_string(),
            url: request.uri().to_string(),
            body: request.body().to_owned(),
            headers: vec![],
        };

        request_transfer
    }
}

impl From<HttpRequestSet> for HttpRequestSetTransfer {
    fn from(request_set: HttpRequestSet) -> Self {
        HttpRequestSetTransfer { 
            typename: "HttpRequestSet".to_owned(), 
            id: request_set.id, 
            label: request_set.label.to_owned(), 
            requests: request_set.requests.into_iter().map(HttpRequestTransfer::from).collect(), 
        }
    }
}
