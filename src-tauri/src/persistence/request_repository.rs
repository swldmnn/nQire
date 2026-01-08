use std::collections::HashMap;

use futures::TryStreamExt;
use http::{HeaderName, HeaderValue, Request};
use sqlx::{Sqlite, Transaction};

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
            if let Some(request_set_id) = request_meta_data.request_set_id {
                requests_by_request_set_id
                    .entry(request_set_id)
                    .or_default()
                    .push(request);
            }
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
        if let Some(requests) = requests_by_request_set_id.remove(&request_set.id.unwrap()) {
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
            if let Some(request_headers) =
                headers_by_request_id.remove(&request_meta_data.id.unwrap())
            {
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

pub async fn save_request(
    state: &tauri::State<'_, AppState>,
    request: Request<String>,
) -> Result<u64, String> {
    let db = &state.db;

    let mut tx = db
        .begin()
        .await
        .map_err(|e| format!("Failed to update request: {}", e))?;

    let rows_affected = upsert_request(&mut tx, &request)
        .await
        .map_err(|e| format!("Failed to update request: {}", e))?;

    save_request_headers(&mut tx, &request)
        .await
        .map_err(|e| format!("Failed to update request: {}", e))?;

    tx.commit()
        .await
        .map_err(|e| format!("Failed to update request: {}", e))?;

    Ok(rows_affected)
}

pub async fn delete_request(
    state: &tauri::State<'_, AppState>,
    request_id: u32,
) -> Result<u64, String> {
    let db = &state.db;

    let query_result = sqlx::query("DELETE FROM requests WHERE id = ?")
        .bind(request_id)
        .execute(db)
        .await
        .map_err(|e| format!("Failed to delete request: {}", e))?;

    Ok(query_result.rows_affected())
}

pub async fn save_request_set(
    state: &tauri::State<'_, AppState>,
    request_set: HttpRequestSet,
) -> Result<u64, String> {
    let db = &state.db;
    let mut tx = db
        .begin()
        .await
        .map_err(|e| format!("Failed update request set: {}", e))?;

    let rows_affected = upsert_request_set(&mut tx, &request_set)
        .await
        .map_err(|e| format!("Failed to update request set: {}", e))?;

    tx.commit()
        .await
        .map_err(|e| format!("Failed update request set: {}", e))?;

    Ok(rows_affected)
}

pub async fn delete_request_set(
    state: &tauri::State<'_, AppState>,
    request_set_id: u32,
) -> Result<u64, String> {
    let db = &state.db;

    let query_result = sqlx::query("DELETE FROM request_sets WHERE id = ?")
        .bind(request_set_id)
        .execute(db)
        .await
        .map_err(|e| format!("Failed to delete request set: {}", e))?;

    Ok(query_result.rows_affected())
}

async fn upsert_request(
    tx: &mut Transaction<'_, Sqlite>,
    request: &Request<String>,
) -> Result<u64, String> {
    let meta_data = request
        .extensions()
        .get::<RequestMetaData>()
        .ok_or("Cannot update headers: request has no metadata")?;

    let maybe_id = meta_data.id;
    let label = &meta_data.label;
    let maybe_request_set_id = meta_data.request_set_id;

    match maybe_id {
        Some(id) => {
            let query_result = sqlx::query(
                "UPDATE requests SET label = ?, method = ?, url = ?, body = ? WHERE id = ?",
            )
            .bind(label)
            .bind(request.method().to_string())
            .bind(request.uri().to_string())
            .bind(request.body().to_string())
            .bind(id)
            .execute(&mut **tx)
            .await
            .map_err(|e| format!("Failed to update request: {}", e))?;

            Ok(query_result.rows_affected())
        }
        None => {
            let request_set_id = maybe_request_set_id
                .ok_or("Cannot insert request: Request has no request set id")?;

            let query_result =
        sqlx::query("INSERT INTO requests (request_set_id, label, method, url, body) VALUES (?1, ?2, ?3, ?4, ?5) RETURNING id")
            .bind(request_set_id)
            .bind(label)
            .bind(request.method().to_string())
            .bind(request.uri().to_string())
            .bind(request.body().to_string())
            .execute(&mut **tx)
            .await
            .map_err(|e| format!("Failed to update request: {}", e))?;

            Ok(query_result.rows_affected())
        }
    }
}

async fn save_request_headers(
    tx: &mut Transaction<'_, Sqlite>,
    request: &Request<String>,
) -> Result<(), String> {
    let meta_data = request
        .extensions()
        .get::<RequestMetaData>()
        .ok_or("Cannot update headers: request has no metadata")?;

    // Delete existing headers
    sqlx::query("DELETE FROM request_headers WHERE request_id = ?")
        .bind(meta_data.id)
        .execute(&mut **tx)
        .await
        .map_err(|e| format!("Failed to delete old headers: {}", e))?;

    // Insert current headers
    for (name, value) in request.headers().iter() {
        sqlx::query("INSERT INTO request_headers (request_id, key, value) VALUES (?, ?, ?)")
            .bind(meta_data.id)
            .bind(name.as_str())
            .bind(
                value
                    .to_str()
                    .map_err(|e| format!("Invalid header value: {}", e))?,
            )
            .execute(&mut **tx)
            .await
            .map_err(|e| format!("Failed to insert header: {}", e))?;
    }

    Ok(())
}

async fn upsert_request_set(
    tx: &mut Transaction<'_, Sqlite>,
    request_set: &HttpRequestSet,
) -> Result<u64, String> {
    match request_set.id {
        Some(id) => {
            let query_result = sqlx::query("UPDATE request_sets SET label = ? WHERE id = ?")
                .bind(request_set.label.to_owned())
                .bind(id)
                .execute(&mut **tx)
                .await
                .map_err(|e| format!("Failed to update request set: {}", e))?;

            Ok(query_result.rows_affected())
        }
        None => {
            let query_result =
                sqlx::query("INSERT INTO request_sets (label) VALUES (?1) RETURNING id")
                    .bind(request_set.label.to_owned())
                    .execute(&mut **tx)
                    .await
                    .map_err(|e| format!("Failed to create request set: {}", e))?;

            Ok(query_result.rows_affected())
        }
    }
}
