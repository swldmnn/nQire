use serde::{Deserialize, Serialize};
use http::{Request};

#[derive(Debug, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct THttpRequest {
    pub method: String,
    pub url: String,
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
    let req = Request::builder()
    .method(request.method.as_str())
    .uri(request.url)
    .body(request.body)
    .unwrap();
    
    match super::http_handler::send_http_request(req) {
        Ok(r) => return THttpResponse { status: r.status().as_u16(), body: r.body().to_owned() },
        Err(e) => return THttpResponse { status: 0, body: e },
    };
}