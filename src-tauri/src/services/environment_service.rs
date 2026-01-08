use crate::{domain::Environment, AppState};

pub async fn find_all_environments(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<Environment>, String> {
    let all_environments = crate::persistence::fetch_environments(&state, vec![])
        .await
        .map_err(|e| e)?;

    Ok(all_environments)
}

pub async fn find_environment(
    state: tauri::State<'_, AppState>,
    environment_id: u32,
) -> Result<Environment, String> {
    Ok(
        crate::persistence::fetch_environments(&state, vec![environment_id])
            .await
            .map_err(|e| format!("Failed to load environment: {}", e))?
            .into_iter()
            .next()
            .ok_or_else(|| "Failed to load environment: No first element".to_string())?,
    )
}

pub async fn save_environment(
    state: tauri::State<'_, AppState>,
    environment: Environment,
) -> Result<Environment, String> {
    let saved_environment = crate::persistence::save_environment(&state, environment)
        .await
        .map_err(|e| e)?;

    Ok(saved_environment)
}

pub async fn delete_environment(
    state: tauri::State<'_, AppState>,
    environment_id: u32,
) -> Result<u64, String> {
    let count_deleted = crate::persistence::delete_environment(&state, environment_id)
        .await
        .map_err(|e| e)?;

    Ok(count_deleted)
}
