use http::Request;

use crate::{domain::HttpRequestSet, AppState};

pub async fn find_all_request_sets(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<HttpRequestSet>, String> {
    let all_request_sets = crate::persistence::fetch_all_request_sets(&state)
        .await
        .map_err(|e| e)?;

    Ok(all_request_sets)
}

pub async fn save_request_set(
    state: tauri::State<'_, AppState>,
    request_set: HttpRequestSet,
) -> Result<u64, String> {
    let count_updated = crate::persistence::save_request_set(&state, request_set)
        .await
        .map_err(|e| e)?;

    Ok(count_updated)
}

pub async fn save_request(
    state: tauri::State<'_, AppState>,
    request: Request<String>,
) -> Result<u64, String> {
    let count_updated = crate::persistence::save_request(&state, request)
        .await
        .map_err(|e| e)?;

    Ok(count_updated)
}

pub async fn delete_request(
    state: tauri::State<'_, AppState>,
    request_id: u32,
) -> Result<u64, String> {
    let count_deleted = crate::persistence::delete_request(&state, request_id)
        .await
        .map_err(|e| e)?;

    Ok(count_deleted)
}
