use std::collections::HashMap;

use futures::TryStreamExt;
use sqlx::{Row, Sqlite, Transaction};

use crate::{
    domain::{HttpHeader, HttpRequest, HttpRequestSet},
    persistence::{RequestHeaderRecord, RequestRecord, RequestSetRecord},
    AppState,
};

pub async fn fetch_request_sets(
    state: &tauri::State<'_, AppState>,
    request_set_ids: Vec<u32>,
) -> Result<Vec<HttpRequestSet>, String> {
    let mut requests_by_request_set_id =
        fetch_requests_for_request_sets(state, &request_set_ids).await?;

    let request_set_records = fetch_request_set_records(state, &request_set_ids).await?;

    let mut request_sets = request_set_records
        .into_iter()
        .map(HttpRequestSet::from)
        .collect::<Vec<HttpRequestSet>>();

    for request_set in &mut request_sets {
        if let Some(id) = request_set.id {
            if let Some(requests) = requests_by_request_set_id.remove(&id) {
                request_set.requests = requests;
            }
        }
    }

    Ok(request_sets)
}

pub async fn save_request_set(
    state: &tauri::State<'_, AppState>,
    request_set: HttpRequestSet,
) -> Result<HttpRequestSet, String> {
    let db = &state.db;
    let mut tx = db
        .begin()
        .await
        .map_err(|e| format!("Failed update request set: {}", e))?;

    let request_set_id = upsert_request_set(&mut tx, &request_set).await?;

    tx.commit()
        .await
        .map_err(|e| format!("Failed update request set: {}", e))?;

    Ok(fetch_request_sets(state, vec![request_set_id])
        .await?
        .into_iter()
        .next()
        .ok_or_else(|| "Failed to load updated request set: Empty list".to_string())?)
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

pub async fn fetch_requests(
    state: &tauri::State<'_, AppState>,
    request_ids: Vec<u32>,
) -> Result<Vec<HttpRequest>, String> {
    let request_header_records = fetch_request_header_records(state, &request_ids).await?;
    let request_records: Vec<RequestRecord> = fetch_request_records(state, &request_ids).await?;
    let requests = assign_headers_to_requests(request_records, request_header_records)?;

    Ok(requests)
}

pub async fn save_request(
    state: &tauri::State<'_, AppState>,
    request: HttpRequest,
    request_set_id: Option<u32>,
) -> Result<HttpRequest, String> {
    let db = &state.db;

    let mut tx = db
        .begin()
        .await
        .map_err(|e| format!("Failed to update request: {}", e))?;

    let request_id = upsert_request(&mut tx, &request, request_set_id).await?;
    save_request_headers(&mut tx, &request).await?;

    tx.commit()
        .await
        .map_err(|e| format!("Failed to update request: {}", e))?;

    Ok(fetch_requests(state, vec![request_id])
        .await
        .map_err(|e| format!("Failed to load updated request: {}", e))?
        .into_iter()
        .next()
        .ok_or_else(|| "Failed to load updated request: Empty list".to_string())?)
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

async fn fetch_requests_for_request_sets(
    state: &tauri::State<'_, AppState>,
    request_set_ids: &Vec<u32>,
) -> Result<HashMap<u32, Vec<HttpRequest>>, String> {
    let request_records_by_request_set_id: HashMap<u32, Vec<RequestRecord>> =
        fetch_request_records_for_request_sets(state, &request_set_ids).await?;

    let mut result: HashMap<u32, Vec<HttpRequest>> = HashMap::new();
    for (request_set_id, request_records) in request_records_by_request_set_id {
        let request_ids: Vec<u32> = request_records.iter().map(|req| req.id).collect();
        let request_header_records = fetch_request_header_records(state, &request_ids).await?;
        let requests = assign_headers_to_requests(request_records, request_header_records)?;

        result.insert(request_set_id, requests);
    }

    Ok(result)
}

fn assign_headers_to_requests(
    request_records: Vec<RequestRecord>,
    request_header_records: Vec<RequestHeaderRecord>,
) -> Result<Vec<HttpRequest>, String> {
    let mut headers_by_request_id: HashMap<u32, Vec<RequestHeaderRecord>> = HashMap::new();
    for header in request_header_records {
        headers_by_request_id
            .entry(header.request_id)
            .or_default()
            .push(header);
    }

    let mut requests: Vec<HttpRequest> =
        request_records.into_iter().map(HttpRequest::from).collect();

    for request in &mut requests {
        if request.id.is_some() {
            if let Some(request_header_records_by_id) =
                headers_by_request_id.remove(&request.id.unwrap())
            {
                request.headers = request_header_records_by_id
                    .into_iter()
                    .map(HttpHeader::from)
                    .collect();
            }
        }
    }

    Ok(requests)
}

async fn fetch_request_header_records(
    state: &tauri::State<'_, AppState>,
    request_ids: &Vec<u32>,
) -> Result<Vec<RequestHeaderRecord>, String> {
    let db = &state.db;

    if request_ids.is_empty() {
        let all_request_header_records: Vec<RequestHeaderRecord> =
            sqlx::query_as::<_, RequestHeaderRecord>("SELECT * FROM request_headers")
                .fetch(db)
                .try_collect()
                .await
                .map_err(|e| format!("Failed to fetch request headers {}", e))?;

        Ok(all_request_header_records)
    } else {
        let placeholders = request_ids
            .iter()
            .map(|_| "?")
            .collect::<Vec<_>>()
            .join(",");

        let query = format!(
            "SELECT * FROM request_headers WHERE request_id IN ({})",
            placeholders
        );
        let mut q = sqlx::query_as::<_, RequestHeaderRecord>(&query);
        for id in request_ids {
            q = q.bind(id);
        }

        let request_header_records: Vec<RequestHeaderRecord> = q
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to fetch request headers {}", e))?;

        Ok(request_header_records)
    }
}

async fn fetch_request_records(
    state: &tauri::State<'_, AppState>,
    request_ids: &Vec<u32>,
) -> Result<Vec<RequestRecord>, String> {
    let db = &state.db;

    if request_ids.is_empty() {
        let all_request_records: Vec<RequestRecord> =
            sqlx::query_as::<_, RequestRecord>("SELECT * FROM requests")
                .fetch(db)
                .try_collect()
                .await
                .map_err(|e| format!("Failed to fetch requests {}", e))?;

        Ok(all_request_records)
    } else {
        let placeholders = request_ids
            .iter()
            .map(|_| "?")
            .collect::<Vec<_>>()
            .join(",");

        let query = format!("SELECT * FROM requests WHERE id IN ({})", placeholders);
        let mut q = sqlx::query_as::<_, RequestRecord>(&query);
        for id in request_ids {
            q = q.bind(id);
        }

        let request_records: Vec<RequestRecord> = q
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to fetch requests {}", e))?;

        Ok(request_records)
    }
}

async fn fetch_request_records_for_request_sets(
    state: &tauri::State<'_, AppState>,
    request_set_ids: &Vec<u32>,
) -> Result<HashMap<u32, Vec<RequestRecord>>, String> {
    let db = &state.db;

    let records: Vec<RequestRecord> = if request_set_ids.is_empty() {
        sqlx::query_as::<_, RequestRecord>("SELECT * FROM requests")
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to fetch requests {}", e))?
    } else {
        let placeholders = request_set_ids
            .iter()
            .map(|_| "?")
            .collect::<Vec<_>>()
            .join(",");

        let query_string = format!(
            "SELECT * FROM requests WHERE request_set_id IN ({})",
            placeholders
        );

        let mut query = sqlx::query_as::<_, RequestRecord>(&query_string);
        for id in request_set_ids {
            query = query.bind(id);
        }

        query
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to fetch requests {}", e))?
    };

    let mut requests_by_request_set_id: HashMap<u32, Vec<RequestRecord>> = HashMap::new();
    for record in records {
        requests_by_request_set_id
            .entry(record.request_set_id)
            .or_default()
            .push(record);
    }

    Ok(requests_by_request_set_id)
}

async fn fetch_request_set_records(
    state: &tauri::State<'_, AppState>,
    request_set_ids: &Vec<u32>,
) -> Result<Vec<RequestSetRecord>, String> {
    let db = &state.db;

    if request_set_ids.is_empty() {
        let all_request_set_records: Vec<RequestSetRecord> =
            sqlx::query_as::<_, RequestSetRecord>("SELECT * FROM request_sets")
                .fetch(db)
                .try_collect()
                .await
                .map_err(|e| format!("Failed to fetch request sets {}", e))?;

        Ok(all_request_set_records)
    } else {
        let placeholders = request_set_ids
            .iter()
            .map(|_| "?")
            .collect::<Vec<_>>()
            .join(",");

        let query = format!("SELECT * FROM request_sets WHERE id IN ({})", placeholders);
        let mut q = sqlx::query_as::<_, RequestSetRecord>(&query);
        for id in request_set_ids {
            q = q.bind(id);
        }

        let request_set_records: Vec<RequestSetRecord> = q
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to fetch request sets {}", e))?;

        Ok(request_set_records)
    }
}

async fn upsert_request(
    tx: &mut Transaction<'_, Sqlite>,
    request: &HttpRequest,
    request_set_id: Option<u32>,
) -> Result<u32, String> {
    match request.id {
        Some(id) => {
            sqlx::query(
                "UPDATE requests SET label = ?, method = ?, url = ?, body = ? WHERE id = ?",
            )
            .bind(request.label.to_owned())
            .bind(request.method.to_owned())
            .bind(request.url.to_owned())
            .bind(request.body.to_owned())
            .bind(id)
            .execute(&mut **tx)
            .await
            .map_err(|e| format!("Failed to update request: {}", e))?;

            Ok(id)
        }
        None => {
            let request_set_id_value =
                request_set_id.ok_or("Cannot insert request: No request set id given")?;

            let query_result = sqlx::query("INSERT INTO requests (request_set_id, label, method, url, body) VALUES (?1, ?2, ?3, ?4, ?5) RETURNING id")
            .bind(request_set_id_value)
            .bind(request.label.to_owned())
            .bind(request.method.to_owned())
            .bind(request.url.to_owned())
            .bind(request.body.to_owned())
            .fetch_one(&mut **tx)
            .await
            .map_err(|e| format!("Failed to update request: {}", e))?;

            Ok(query_result.get("id"))
        }
    }
}

async fn save_request_headers(
    tx: &mut Transaction<'_, Sqlite>,
    request: &HttpRequest,
) -> Result<(), String> {
    if request.headers.is_empty() {
        return Ok(());
    }

    let request_id = request
        .id
        .ok_or("Cannot update headers: request has no id")?;

    // Delete existing headers
    sqlx::query("DELETE FROM request_headers WHERE request_id = ?")
        .bind(request_id)
        .execute(&mut **tx)
        .await
        .map_err(|e| format!("Failed to delete old headers: {}", e))?;

    // Insert current headers
    for header in &request.headers {
        sqlx::query("INSERT INTO request_headers (request_id, key, value) VALUES (?, ?, ?)")
            .bind(request_id)
            .bind(header.key.to_owned())
            .bind(header.value.to_owned())
            .execute(&mut **tx)
            .await
            .map_err(|e| format!("Failed to insert header: {}", e))?;
    }

    Ok(())
}

async fn upsert_request_set(
    tx: &mut Transaction<'_, Sqlite>,
    request_set: &HttpRequestSet,
) -> Result<u32, String> {
    match request_set.id {
        Some(id) => {
            sqlx::query("UPDATE request_sets SET label = ? WHERE id = ?")
                .bind(request_set.label.to_owned())
                .bind(id)
                .execute(&mut **tx)
                .await
                .map_err(|e| format!("Failed to update request set: {}", e))?;

            Ok(id)
        }
        None => {
            let query_result =
                sqlx::query("INSERT INTO request_sets (label) VALUES (?1) RETURNING id")
                    .bind(request_set.label.to_owned())
                    .fetch_one(&mut **tx)
                    .await
                    .map_err(|e| format!("Failed to create request set: {}", e))?;

            Ok(query_result.get("id"))
        }
    }
}
