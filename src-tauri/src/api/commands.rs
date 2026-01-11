use crate::{
    api::{
        EnvironmentTransfer, ErrorTransfer, HttpRequestSetTransfer, HttpRequestTransfer,
        HttpResponseTransfer,
    },
    domain::{Environment, HttpRequest, HttpRequestSet},
    AppState,
};

#[tauri::command]
pub fn send_http_request(
    request: HttpRequestTransfer,
) -> Result<HttpResponseTransfer, ErrorTransfer> {
    let req = HttpRequest::from(request);
    let response = crate::services::send_http_request(req).map_err(|e| ErrorTransfer {
        typename: "Error".to_owned(),
        error_message: e,
    })?;

    Ok(HttpResponseTransfer {
        status: response.status().as_u16(),
        body: response.body().to_owned(),
    })
}

#[tauri::command]
pub async fn find_all_request_sets(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<HttpRequestSetTransfer>, ErrorTransfer> {
    let request_sets = crate::services::find_all_request_sets(state)
        .await
        .map_err(|e| ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        })?;

    Ok(request_sets
        .into_iter()
        .map(HttpRequestSetTransfer::from)
        .collect())
}

#[tauri::command]
pub async fn save_request_set(
    state: tauri::State<'_, AppState>,
    request_set: HttpRequestSetTransfer,
) -> Result<HttpRequestSetTransfer, ErrorTransfer> {
    let req_set = HttpRequestSet::from(request_set);

    let result = crate::services::save_request_set(state, req_set)
        .await
        .map_err(|e| ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        })?;

    Ok(HttpRequestSetTransfer::from(result))
}

#[tauri::command]
pub async fn delete_request_set(
    state: tauri::State<'_, AppState>,
    request_set_id: u32,
) -> Result<u64, ErrorTransfer> {
    let result = crate::services::delete_request_set(state, request_set_id)
        .await
        .map_err(|e| ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        })?;

    Ok(result)
}

#[tauri::command]
pub async fn find_request(
    state: tauri::State<'_, AppState>,
    request_id: u32,
) -> Result<HttpRequestTransfer, ErrorTransfer> {
    let request = crate::services::find_request(state, request_id)
        .await
        .map_err(|e| ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        })?;

    Ok(HttpRequestTransfer::from(request))
}

#[tauri::command]
pub async fn save_request(
    state: tauri::State<'_, AppState>,
    request: HttpRequestTransfer,
    request_set_id: Option<u32>,
) -> Result<HttpRequestTransfer, ErrorTransfer> {
    let req = HttpRequest::from(request);

    let updated_request = crate::services::save_request(state, req, request_set_id)
        .await
        .map_err(|e| ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        })?;

    Ok(HttpRequestTransfer::from(updated_request))
}

#[tauri::command]
pub async fn delete_request(
    state: tauri::State<'_, AppState>,
    request_id: u32,
) -> Result<u64, ErrorTransfer> {
    let result = crate::services::delete_request(state, request_id)
        .await
        .map_err(|e| ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        })?;

    Ok(result)
}

#[tauri::command]
pub async fn find_all_environments(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<EnvironmentTransfer>, ErrorTransfer> {
    let environments = crate::services::find_all_environments(state)
        .await
        .map_err(|e| ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        })?;

    let environment_transfers = environments
        .into_iter()
        .map(EnvironmentTransfer::from)
        .collect();

    Ok(environment_transfers)
}

#[tauri::command]
pub async fn find_environment(
    state: tauri::State<'_, AppState>,
    environment_id: u32,
) -> Result<EnvironmentTransfer, ErrorTransfer> {
    let environment = crate::services::find_environment(state, environment_id)
        .await
        .map_err(|e| ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        })?;

    Ok(EnvironmentTransfer::from(environment))
}

#[tauri::command]
pub async fn save_environment(
    state: tauri::State<'_, AppState>,
    environment: EnvironmentTransfer,
) -> Result<EnvironmentTransfer, ErrorTransfer> {
    let env = Environment::from(environment);

    let saved_environment = crate::services::save_environment(state, env)
        .await
        .map_err(|e| ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        })?;

    Ok(EnvironmentTransfer::from(saved_environment))
}

#[tauri::command]
pub async fn delete_environment(
    state: tauri::State<'_, AppState>,
    environment_id: u32,
) -> Result<u64, ErrorTransfer> {
    let result = crate::services::delete_environment(state, environment_id)
        .await
        .map_err(|e| ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        })?;

    Ok(result)
}
