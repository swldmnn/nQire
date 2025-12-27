use crate::{domain::Environment, AppState};

pub async fn find_all_environments(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<Environment>, String> {
    let all_environments = crate::persistence::fetch_all_environments(&state)
        .await
        .map_err(|e| e)?;

    Ok(all_environments)
}

pub async fn save_environment(
    state: tauri::State<'_, AppState>,
    environment: Environment,
) -> Result<u64, String> {
    let count_updated = crate::persistence::save_environment(&state, environment)
        .await
        .map_err(|e| e)?;

    Ok(count_updated)
}