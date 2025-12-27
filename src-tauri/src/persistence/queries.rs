use std::{collections::HashMap, env};

use futures::TryStreamExt;
use http::{HeaderName, HeaderValue, Request};

use crate::{
    domain::{Environment, EnvironmentValue, HttpRequestSet, RequestHeader, RequestMetaData},
    persistence::{
        EnvironmentRecord, EnvironmentValueRecord, RequestHeaderRecord, RequestRecord,
        RequestSetRecord,
    },
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

pub async fn fetch_all_environments(
    state: &tauri::State<'_, AppState>,
) -> Result<Vec<Environment>, String> {
    let db = &state.db;

    let all_environment_values = fetch_all_environment_values(state)
        .await
        .map_err(|e| format!("Failed to fetch environment values {}", e))?;

    let mut values_by_environment_id: HashMap<u32, Vec<EnvironmentValue>> = HashMap::new();
    for environment_value in all_environment_values {
        values_by_environment_id
            .entry(environment_value.environment_id)
            .or_default()
            .push(environment_value);
    }

    let all_environment_records: Vec<EnvironmentRecord> =
        sqlx::query_as::<_, EnvironmentRecord>("SELECT * FROM environments")
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to fetch environments {}", e))?;

    let mut environments: Vec<Environment> = all_environment_records
        .into_iter()
        .map(Environment::from)
        .collect();

    for environment in &mut environments {
        if let Some(environment_values) = values_by_environment_id.remove(&environment.id) {
            environment.values = environment_values
        }
    }

    Ok(environments)
}

pub async fn fetch_all_environment_values(
    state: &tauri::State<'_, AppState>,
) -> Result<Vec<EnvironmentValue>, String> {
    let db = &state.db;

    let all_environment_value_records: Vec<EnvironmentValueRecord> =
        sqlx::query_as::<_, EnvironmentValueRecord>("SELECT * FROM environment_values")
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to fetch environment values {}", e))?;

    Ok(all_environment_value_records
        .into_iter()
        .map(EnvironmentValue::from)
        .collect())
}

pub async fn save_request(
    state: &tauri::State<'_, AppState>,
    request: Request<String>,
) -> Result<u64, String> {
    let db = &state.db;

    if let Some(meta_data) = request.extensions().get::<RequestMetaData>() {
        let id = meta_data.id;
        let label = &meta_data.label;

        let query_result = sqlx::query("UPDATE requests SET label = $1, method = $2, url = $3, body = $4 WHERE id = $5")
            .bind(label)
            .bind(request.method().to_string())
            .bind(request.uri().to_string())
            .bind(request.body().to_string())
            .bind(id)
            .execute(db)
            .await
            .map_err(|e| format!("Failed update request: {}", e))?;

        //TODO: update headers

        Ok(query_result.rows_affected())
    } else {
        Err("Cannot update request: request has no metadata".to_owned())
    }
}

pub async fn save_environment(
    state: &tauri::State<'_, AppState>,
    environment: Environment,
) -> Result<u64, String> {
    let db = &state.db;

    //TODO: update other properties
    let query_result = sqlx::query("UPDATE environments SET label = $1 WHERE id = $2")
        .bind(environment.label)
        .bind(environment.id)
        .execute(db)
        .await
        .map_err(|e| format!("Failed update request: {}", e))?;

    Ok(query_result.rows_affected())
}
