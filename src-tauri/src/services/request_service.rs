use http::Request;

use crate::{domain::HttpRequestSet, AppState};

pub async fn find_all_request_sets(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<HttpRequestSet>, String> {
    Ok(crate::persistence::fetch_request_sets(&state, vec![]).await?)
}

pub async fn save_request_set(
    state: tauri::State<'_, AppState>,
    request_set: HttpRequestSet,
) -> Result<HttpRequestSet, String> {
    Ok(crate::persistence::save_request_set(&state, request_set).await?)
}

pub async fn delete_request_set(
    state: tauri::State<'_, AppState>,
    request_set_id: u32,
) -> Result<u64, String> {
    Ok(crate::persistence::delete_request_set(&state, request_set_id).await?)
}

pub async fn find_request(
    state: tauri::State<'_, AppState>,
    request_id: u32,
) -> Result<Request<String>, String> {
    Ok(crate::persistence::fetch_requests(&state, vec![request_id])
        .await?
        .into_iter()
        .next()
        .ok_or_else(|| "Failed to load request: No first element".to_string())?)
}

pub async fn save_request(
    state: tauri::State<'_, AppState>,
    request: Request<String>,
) -> Result<Request<String>, String> {
    Ok(crate::persistence::save_request(&state, request).await?)
}

pub async fn delete_request(
    state: tauri::State<'_, AppState>,
    request_id: u32,
) -> Result<u64, String> {
    Ok(crate::persistence::delete_request(&state, request_id).await?)
}
