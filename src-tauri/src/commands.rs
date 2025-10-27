use serde::{Deserialize, Serialize};

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
    let resp = reqwest::blocking::get(request.url).expect("Testing response");

    return THttpResponse {
        status: resp.status().as_u16(),
        body: resp.text().expect("Testing text"),
    };
}