use http::{Method, Response};
use reqwest::blocking::Client;

use crate::domain::HttpRequest;

pub fn send_http_request(request: HttpRequest) -> Result<Response<String>, String> {
    match request.method.as_str() {
        "GET" => return send(request),
        "POST" => return send(request),
        "PATCH" => return send(request),
        "PUT" => return send(request),
        "DELETE" => return send(request),
        _ => return Err("Unsupported http method".to_owned()),
    }
}

fn send(request: HttpRequest) -> Result<Response<String>, String> {
    let client = Client::new();

    let method = Method::from_bytes(request.method.as_bytes())
        .map_err(|e| format!("Invalid HTTP method '{}': {}", request.method, e))?;

    let mut reqwest_builder = client.request(method, &request.url);

    for header in &request.headers {
        reqwest_builder = reqwest_builder.header(&header.key, &header.value);
    }

    if !request.body.is_empty() {
        reqwest_builder = reqwest_builder.body(request.body);
    }

    let response = match reqwest_builder.send() {
        Ok(r) => r,
        Err(e) => return Err(e.to_string()),
    };

    let status = response.status().as_u16();
    let body = response.text().unwrap_or_default();

    Ok(Response::builder().status(status).body(body).unwrap())
}
