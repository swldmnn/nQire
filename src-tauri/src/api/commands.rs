use http::{HeaderName, HeaderValue, Request};

use crate::{
    api::{HttpRequestSetTransfer, HttpRequestTransfer, HttpResponseTransfer},
    domain::RequestMetaData,
    AppState,
};

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

    match crate::services::send_http_request(req) {
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
    let request_sets = crate::services::find_all_request_sets(state)
        .await
        .map_err(|e| e)?;

    let request_set_transfers = request_sets
        .into_iter()
        .map(HttpRequestSetTransfer::from)
        .collect();

    Ok(request_set_transfers)
}
