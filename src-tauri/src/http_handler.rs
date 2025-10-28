use http::{Request, Response};

pub fn send_http_request(request: Request<String>) -> Result<Response<String>, String> {
    match request.method().as_str() {
        "GET" => return get(request),
        "POST" => return post(request),
        _ => return Err("Unsupported http method".to_owned())
    }
}

fn get(request: Request<String>) -> Result<Response<String>, String> {
    let response = match reqwest::blocking::get(request.uri().to_string()) {
        Ok(r) => r,
        Err(e) => return Err(e.to_string()),
    };

    let status = response.status().as_u16();
    let body = response.text().unwrap_or_default();

    Ok(Response::builder()
    .status(status)
    .body(body)
    .unwrap())
}

fn post(request: Request<String>) -> Result<Response<String>, String> {
    let client = reqwest::blocking::Client::new();
    let response = match client
        .post(request.uri().to_string())
        .body(request.body().to_string())
        .send() {
            Ok(r) => r,
            Err(e) => return Err(e.to_string()),
        };


    let status = response.status().as_u16();
    let body = response.text().unwrap_or_default();

    Ok(Response::builder()
    .status(status)
    .body(body)
    .unwrap())
}