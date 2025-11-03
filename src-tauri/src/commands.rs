use serde::{Deserialize, Serialize};
use http::{Request, HeaderName, HeaderValue};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct THttpHeader {
    pub key: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct THttpRequest {
    pub method: String,
    pub url: String,
    pub headers: Vec<THttpHeader>,
    pub body: String,
}

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct THttpResponse {
    pub status: u16,
    pub body: String,
}

#[tauri::command]
pub fn send_http_request(request: THttpRequest) -> THttpResponse {
    let mut req_builder = Request::builder()
    .method(request.method.as_str())
    .uri(request.url);
   
    {
        let headers_mut = req_builder.headers_mut().unwrap();
        for header in request.headers {
            let name = HeaderName::from_bytes(header.key.as_bytes())
                .expect("Invalid header name");
            let value = HeaderValue::from_str(&header.value)
                .expect("Invalid header value");

            headers_mut.insert(name, value);
        }
    }
   
    let req = req_builder
    .body(request.body)
    .unwrap();
    
    match super::http_handler::send_http_request(req) {
        Ok(r) => return THttpResponse { status: r.status().as_u16(), body: r.body().to_owned() },
        Err(e) => return THttpResponse { status: 0, body: e },
    };
}