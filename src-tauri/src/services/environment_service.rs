use crate::{domain::Environment, AppState};

pub async fn find_all_environments(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<Environment>, String> {
    let all_environments = crate::persistence::fetch_all_environments(&state)
        .await
        .map_err(|e| e)?;

    Ok(all_environments)
}
