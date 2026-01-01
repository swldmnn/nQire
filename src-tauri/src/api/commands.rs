use http::Request;

use crate::{
    api::{
        EnvironmentTransfer, ErrorTransfer, HttpRequestSetTransfer, HttpRequestTransfer,
        HttpResponseTransfer,
    },
    domain::Environment,
    AppState,
};

#[tauri::command]
pub fn send_http_request(
    request: HttpRequestTransfer,
) -> Result<HttpResponseTransfer, ErrorTransfer> {
    let req = Request::<String>::try_from(request).expect("could not map request");

    match crate::services::send_http_request(req) {
        Ok(r) => Ok(HttpResponseTransfer {
            status: r.status().as_u16(),
            body: r.body().to_owned(),
        }),
        Err(e) => Err(ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        }),
    }
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

    let request_set_transfers = request_sets
        .into_iter()
        .map(HttpRequestSetTransfer::try_from)
        .collect::<Result<Vec<_>, _>>()
        .map_err(|e| ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        })?;

    Ok(request_set_transfers)
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
pub async fn save_request(
    state: tauri::State<'_, AppState>,
    request: HttpRequestTransfer,
) -> Result<u64, ErrorTransfer> {
    let req = Request::<String>::try_from(request).map_err(|e| ErrorTransfer {
        typename: "Error".to_owned(),
        error_message: e,
    })?;

    let result = crate::services::save_request(state, req)
        .await
        .map_err(|e| ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        })?;

    Ok(result)
}

#[tauri::command]
pub async fn save_environment(
    state: tauri::State<'_, AppState>,
    environment: EnvironmentTransfer,
) -> Result<u64, ErrorTransfer> {
    let env = Environment::from(environment);

    let result = crate::services::save_environment(state, env)
        .await
        .map_err(|e| ErrorTransfer {
            typename: "Error".to_owned(),
            error_message: e,
        })?;

    Ok(result)
}
