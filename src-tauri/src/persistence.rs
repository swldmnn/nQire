use crate::AppState;
use futures::TryStreamExt;
use http::Request;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct RequestEntity {
    id: u16,
    method: String,
    url: String,
    body: String,
}

pub async fn find_all_requests(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<Request<String>>, String> {
    let db = &state.db;

    let request_entities: Vec<RequestEntity> =
        sqlx::query_as::<_, RequestEntity>("SELECT * FROM requests")
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to get requests {}", e))?;

    let requests = map_request_entities_to_requests(request_entities);

    Ok(requests)
}

fn map_request_entities_to_requests(request_entities: Vec<RequestEntity>) -> Vec<Request<String>> {
    let requests = request_entities
        .iter()
        .map(|request_entity| {
            let mapped = Request::builder()
                .method(request_entity.method.as_str())
                .uri(request_entity.url.to_owned())
                .body(request_entity.body.to_owned())
                .unwrap();

            mapped
        })
        .collect::<Vec<Request<String>>>();

    requests
}
