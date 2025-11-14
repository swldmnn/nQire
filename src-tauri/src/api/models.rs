use http::Request;
use serde::{Deserialize, Serialize};

use crate::domain::{Environment, EnvironmentValue, HttpRequestSet, RequestMetaData};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpRequestSetTransfer {
    pub typename: String,
    pub id: u32,
    pub label: String,
    pub requests: Vec<HttpRequestTransfer>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpRequestTransfer {
    pub typename: String,
    pub id: u32,
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
    pub id: u32,
    pub label: String,
    pub values: Vec<EnvironmentValueTransfer>,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct EnvironmentValueTransfer {
    pub key: String,
    pub value: String,
}

impl TryFrom<Request<String>> for HttpRequestTransfer {
    type Error = String;

    fn try_from(request: Request<String>) -> Result<Self, Self::Error> {
        if let Some(meta_data) = request.extensions().get::<RequestMetaData>() {
            let id = meta_data.id;
            let label = &meta_data.label;

            let mut headers = vec![];
            let header_map = request.headers();
            for (key, value) in header_map {
                headers.push(HttpHeaderTransfer {
                    key: key.as_str().to_owned(),
                    value: value.to_str().expect("testing header value").to_owned(),
                });
            }

            let request_transfer = HttpRequestTransfer {
                typename: "HttpRequest".to_owned(),
                id: id,
                label: label.to_owned(),
                method: request.method().to_string(),
                url: request.uri().to_string(),
                body: request.body().to_owned(),
                headers: headers,
            };

            Ok(request_transfer)
        } else {
            Err("Cannot convert to HttpRequestTransfer: Request has no metadata".to_owned())
        }
    }
}

impl TryFrom<HttpRequestSet> for HttpRequestSetTransfer {
    type Error = String;

    fn try_from(request_set: HttpRequestSet) -> Result<Self, Self::Error> {
        Ok(HttpRequestSetTransfer {
            typename: "HttpRequestSet".to_owned(),
            id: request_set.id,
            label: request_set.label.to_owned(),
            requests: request_set
                .requests
                .into_iter()
                .map(HttpRequestTransfer::try_from)
                .collect::<Result<Vec<_>, _>>()?,
        })
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
