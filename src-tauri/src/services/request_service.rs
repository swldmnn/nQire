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

pub async fn save_request(
    state: tauri::State<'_, AppState>,
    request: Request<String>,
) -> Result<u64, String> {
    let count_updated = crate::persistence::save_request(&state, request)
        .await
        .map_err(|e| e)?;

    Ok(count_updated)
}
