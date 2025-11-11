use crate::AppState;
use futures::TryStreamExt;
use http::Request;
use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
struct RequestEntity {
    id: u16,
    label: String,
    method: String,
    url: String,
    body: String,
}

#[derive(Clone)]
pub struct RequestMetaData {
    pub id: u16,
    pub label: String,
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

    let requests = request_entities
        .iter()
        .map(|request_entity| map_request_entity_to_request(request_entity))
        .collect::<Vec<Request<String>>>();

    Ok(requests)
}

fn map_request_entity_to_request(request_entity: &RequestEntity) -> Request<String> {
    let mapped = Request::builder()
        .method(request_entity.method.as_str())
        .uri(request_entity.url.to_owned())
        .extension(RequestMetaData {
            id: request_entity.id,
            label: request_entity.label.to_owned(),
        })
        .body(request_entity.body.to_owned())
        .unwrap();

    mapped
}
