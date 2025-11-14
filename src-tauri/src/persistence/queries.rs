use std::collections::HashMap;

use futures::TryStreamExt;
use http::{HeaderName, HeaderValue, Request};

use crate::{
    domain::{HttpRequestSet, RequestHeader, RequestMetaData},
    persistence::{RequestHeaderRecord, RequestRecord, RequestSetRecord},
    AppState,
};

pub async fn fetch_all_request_sets(
    state: &tauri::State<'_, AppState>,
) -> Result<Vec<HttpRequestSet>, String> {
    let db = &state.db;

    let all_requests = fetch_all_requests(state)
        .await
        .map_err(|e| format!("Failed to fetch request sets {}", e))?;

    let mut requests_by_request_set_id: HashMap<u32, Vec<Request<String>>> = HashMap::new();
    for request in all_requests {
        if let Some(request_meta_data) = request.extensions().get::<RequestMetaData>() {
            requests_by_request_set_id
                .entry(request_meta_data.request_set_id)
                .or_default()
                .push(request);
        }
    }

    let request_set_records: Vec<RequestSetRecord> =
        sqlx::query_as::<_, RequestSetRecord>("SELECT * FROM request_sets")
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to fetch request sets {}", e))?;

    let mut request_sets = request_set_records
        .into_iter()
        .map(HttpRequestSet::from)
        .collect::<Vec<HttpRequestSet>>();

    for request_set in &mut request_sets {
        if let Some(requests) = requests_by_request_set_id.remove(&request_set.id) {
            request_set.requests = requests;
        }
    }

    Ok(request_sets)
}

pub async fn fetch_all_requests(
    state: &tauri::State<'_, AppState>,
) -> Result<Vec<Request<String>>, String> {
    let db = &state.db;

    let all_request_headers = fetch_all_request_headers(state)
        .await
        .map_err(|e| format!("Failed to fetch requests {}", e))?;

    let mut headers_by_request_id: HashMap<u32, Vec<RequestHeader>> = HashMap::new();
    for header in all_request_headers {
        headers_by_request_id
            .entry(header.request_id)
            .or_default()
            .push(header);
    }

    let all_request_records: Vec<RequestRecord> =
        sqlx::query_as::<_, RequestRecord>("SELECT * FROM requests")
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to fetch requests {}", e))?;

    let mut requests: Vec<Request<String>> = all_request_records
        .into_iter()
        .map(Request::<String>::from)
        .collect();

    for request in &mut requests {
        if let Some(request_meta_data) = request.extensions().get::<RequestMetaData>() {
            if let Some(request_headers) = headers_by_request_id.remove(&request_meta_data.id) {
                let header_map = request.headers_mut();
                for request_header in request_headers {
                    let name = HeaderName::from_bytes(request_header.key.as_bytes())
                        .map_err(|e| format!("Failed to fetch requests {}", e))?;
                    let value = HeaderValue::from_str(&request_header.value)
                        .map_err(|e| format!("Failed to fetch requests {}", e))?;

                    header_map.insert(name, value);
                }
            }
        }
    }

    Ok(requests)
}

pub async fn fetch_all_request_headers(
    state: &tauri::State<'_, AppState>,
) -> Result<Vec<RequestHeader>, String> {
    let db = &state.db;

    let request_header_records: Vec<RequestHeaderRecord> =
        sqlx::query_as::<_, RequestHeaderRecord>("SELECT * FROM request_headers")
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to fetch request headers {}", e))?;

    Ok(request_header_records
        .into_iter()
        .map(RequestHeader::from)
        .collect())
}