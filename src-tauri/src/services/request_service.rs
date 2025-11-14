use crate::{domain::HttpRequestSet, AppState};

pub async fn find_all_request_sets(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<HttpRequestSet>, String> {
    let all_request_sets = crate::persistence::fetch_all_request_sets(&state)
        .await
        .map_err(|e| e)?;

    Ok(all_request_sets)
}
