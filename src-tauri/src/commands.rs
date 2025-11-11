use http::{HeaderName, HeaderValue, Request};
use serde::{Deserialize, Serialize};

use crate::{persistence::RequestMetaData, AppState};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct HttpRequestSetTransfer {
    pub name: String,
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

#[tauri::command]
pub fn send_http_request(request: HttpRequestTransfer) -> HttpResponseTransfer {
    let mut req_builder = Request::builder()
        .method(request.method.as_str())
        .uri(request.url);

    {
        let headers_mut = req_builder.headers_mut().unwrap();
        for header in request.headers {
            let name = HeaderName::from_bytes(header.key.as_bytes()).expect("Invalid header name");
            let value = HeaderValue::from_str(&header.value).expect("Invalid header value");

            headers_mut.insert(name, value);
        }
    }

    let req = req_builder.body(request.body).unwrap();

    match super::http_handler::send_http_request(req) {
        Ok(r) => {
            return HttpResponseTransfer {
                status: r.status().as_u16(),
                body: r.body().to_owned(),
            }
        }
        Err(e) => return HttpResponseTransfer { status: 0, body: e },
    };
}

#[tauri::command]
pub async fn find_all_request_sets(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<HttpRequestSetTransfer>, String> {
    let requests = super::persistence::find_all_requests(state)
        .await
        .map_err(|e| e)?;

    let request_transfers = requests
        .iter()
        .map(|request| map_request_to_request_transfer(request))
        .collect::<Vec<HttpRequestTransfer>>();

    let request_sets = vec![HttpRequestSetTransfer {
        name: "all requests".to_owned(),
        requests: request_transfers,
    }];

    Ok(request_sets)
}

fn map_request_to_request_transfer(request: &Request<String>) -> HttpRequestTransfer {
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

fn build_sample_requests() -> Vec<HttpRequestSetTransfer> {
    let sample_requests = vec![
        HttpRequestTransfer {
            typename: "HttpRequest".to_owned(),
            id: 1,
            label: "JsonPlaceholder".to_owned(),
            method: "POST".to_owned(),
            url: "https://jsonplaceholder.typicode.com/posts".to_owned(),
            body: "{\"foo\":\"bar\"}".to_owned(),
            headers: vec![
                HttpHeaderTransfer {
                    key: "Content-Type".to_owned(),
                    value: "application/json".to_owned(),
                },
                HttpHeaderTransfer {
                    key: "Accept".to_owned(),
                    value: "*/*".to_owned(),
                },
            ],
        },
        HttpRequestTransfer {
            typename: "HttpRequest".to_owned(),
            id: 2,
            label: "IP API".to_owned(),
            method: "GET".to_owned(),
            url: "https://ipapi.co/json".to_owned(),
            body: "".to_owned(),
            headers: vec![HttpHeaderTransfer {
                key: "Accept".to_owned(),
                value: "*/*".to_owned(),
            }],
        },
        HttpRequestTransfer {
            typename: "HttpRequest".to_owned(),
            id: 3,
            label: "Countries".to_owned(),
            method: "GET".to_owned(),
            url: "https://restcountries.com/v3.1/all?fields=name,flags".to_owned(),
            body: "".to_owned(),
            headers: vec![HttpHeaderTransfer {
                key: "Accept".to_owned(),
                value: "*/*".to_owned(),
            }],
        },
        HttpRequestTransfer {
            typename: "HttpRequest".to_owned(),
            id: 4,
            label: "ChuckNorrisJoke".to_owned(),
            method: "GET".to_owned(),
            url: "https://api.chucknorris.io/jokes/random".to_owned(),
            body: "".to_owned(),
            headers: vec![HttpHeaderTransfer {
                key: "Accept".to_owned(),
                value: "*/*".to_owned(),
            }],
        },
    ];

    let sample_requests_2 = vec![
        HttpRequestTransfer{
            typename: "HttpRequest".to_owned(),
            id: 5,
            label: "PokeAPI".to_owned(),
            method: "GET".to_owned(),
            url: "https://pokeapi.co/api/v2/pokemon/ditto".to_owned(),
            body: "".to_owned(),
            headers: vec![
                HttpHeaderTransfer {
                    key: "Accept".to_owned(),
                    value: "*/*".to_owned(),
                }
            ],
        },
        HttpRequestTransfer{
            typename: "HttpRequest".to_owned(),
            id: 6,
            label: "RestAPI".to_owned(),
            method: "POST".to_owned(),
            url: "https://api.restful-api.dev/objects".to_owned(),
            body: "{\"name\": \"Apple MacBook Pro 16\",\"data\": {\"year\": 2019,\"price\": 1849.99,\"CPU model\": \"Intel Core i9\",\"Hard disk size\": \"1 TB\"}}".to_owned(),
            headers: vec![
                HttpHeaderTransfer{
                    key: "Content-Type".to_owned(),
                    value: "application/json".to_owned(),
                },
                HttpHeaderTransfer {
                    key: "Accept".to_owned(),
                    value: "*/*".to_owned(),
                }
            ],
        }
    ];

    let request_sets = vec![
        HttpRequestSetTransfer {
            name: "Sample requests".to_owned(),
            requests: sample_requests,
        },
        HttpRequestSetTransfer {
            name: "Sample requests 2".to_owned(),
            requests: sample_requests_2,
        },
    ];

    request_sets
}
