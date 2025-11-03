use http::{Request, Response};
use reqwest::blocking::Client;

pub fn send_http_request(request: Request<String>) -> Result<Response<String>, String> {
    match request.method().as_str() {
        "GET" => return send(request),
        "POST" => return send(request),
        _ => return Err("Unsupported http method".to_owned()),
    }
}

fn send(request: Request<String>) -> Result<Response<String>, String> {
    let (parts, body) = request.into_parts();
    let client = Client::new();

    let mut reqwest_builder = client.request(parts.method.clone(), parts.uri.to_string());

    for (name, value) in parts.headers.iter() {
        reqwest_builder = reqwest_builder.header(name, value);
    }

    if !body.is_empty() {
        reqwest_builder = reqwest_builder.body(body);
    }

    let response = match reqwest_builder.send() {
        Ok(r) => r,
        Err(e) => return Err(e.to_string()),
    };

    let status = response.status().as_u16();
    let body = response.text().unwrap_or_default();

    Ok(Response::builder().status(status).body(body).unwrap())
}