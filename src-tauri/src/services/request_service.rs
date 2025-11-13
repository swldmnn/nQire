use crate::{domain::HttpRequestSet, persistence::RequestRecord, AppState};

pub async fn find_all_request_sets(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<HttpRequestSet>, String> {
    let request_records = crate::persistence::fetch_all_requests(state)
        .await
        .map_err(|e| e)?;

    let request_sets = vec![HttpRequestSet {
        id: 1,
        label: "All requests".to_owned(),
        requests: request_records
            .into_iter()
            .map(RequestRecord::into)
            .collect(),
    }];

    Ok(request_sets)
}
