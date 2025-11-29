use http::Request;

use crate::{
    api::{EnvironmentTransfer, HttpRequestSetTransfer, HttpRequestTransfer, HttpResponseTransfer},
    AppState,
};

#[tauri::command]
pub fn send_http_request(request: HttpRequestTransfer) -> HttpResponseTransfer {
    let req = Request::<String>::try_from(request).expect("could not map request");

    match crate::services::send_http_request(req) {
        Ok(r) => {
            return HttpResponseTransfer {
                status: r.status().as_u16(),
                body: r.body().to_owned(),
            }
        }
        Err(e) => return HttpResponseTransfer { status: 0, body: e },
    };
}

#[tauri::command]
pub async fn find_all_request_sets(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<HttpRequestSetTransfer>, String> {
    let request_sets = crate::services::find_all_request_sets(state)
        .await
        .map_err(|e| e)?;

    let request_set_transfers = request_sets
        .into_iter()
        .map(HttpRequestSetTransfer::try_from)
        .collect::<Result<Vec<_>, _>>()?;

    Ok(request_set_transfers)
}

#[tauri::command]
pub async fn find_all_environments(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<EnvironmentTransfer>, String> {
    let environments = crate::services::find_all_environments(state)
        .await
        .map_err(|e| e)?;

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
) -> Result<u64, String> {
    let req = Request::<String>::try_from(request).expect("Could not map request");

    let result = crate::services::save_request(state, req)
        .await
        .map_err(|e| e)?;

    Ok(result)
}
