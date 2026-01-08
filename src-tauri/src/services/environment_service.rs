use crate::{domain::Environment, AppState};

pub async fn find_all_environments(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<Environment>, String> {
    Ok(crate::persistence::fetch_environments(&state, vec![]).await?)
}

pub async fn find_environment(
    state: tauri::State<'_, AppState>,
    environment_id: u32,
) -> Result<Environment, String> {
    Ok(
        crate::persistence::fetch_environments(&state, vec![environment_id])
            .await?
            .into_iter()
            .next()
            .ok_or_else(|| "Failed to load environment: No first element".to_string())?,
    )
}

pub async fn save_environment(
    state: tauri::State<'_, AppState>,
    environment: Environment,
) -> Result<Environment, String> {
    Ok(crate::persistence::save_environment(&state, environment).await?)
}

pub async fn delete_environment(
    state: tauri::State<'_, AppState>,
    environment_id: u32,
) -> Result<u64, String> {
    Ok(crate::persistence::delete_environment(&state, environment_id).await?)
}
