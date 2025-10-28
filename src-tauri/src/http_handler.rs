use http::{Request, Response};

pub fn send_http_request(request: Request<String>) -> Result<Response<String>, String> {
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