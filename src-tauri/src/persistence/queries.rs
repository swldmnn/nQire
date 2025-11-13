use futures::TryStreamExt;

use crate::{AppState, persistence::RequestRecord};

pub async fn fetch_all_requests(
    state: tauri::State<'_, AppState>,
) -> Result<Vec<RequestRecord>, String> {
    let db = &state.db;

    let request_records: Vec<RequestRecord> =
        sqlx::query_as::<_, RequestRecord>("SELECT * FROM requests")
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to get requests {}", e))?;

    Ok(request_records)
}

/*
async fn fetch_request_sets(pool: &PgPool) -> Result<Vec<RequestSet>, sqlx::Error> {
    // ---- Fetch sets ----
    let sets_rows = sqlx::query!(
        r#"
        SELECT id, name
        FROM request_sets
        "#
    )
    .fetch_all(pool)
    .await?;

    let mut sets: Vec<RequestSet> = sets_rows
        .into_iter()
        .map(|r| RequestSet {
            id: r.id,
            name: r.name,
            requests: Vec::new(),
        })
        .collect();

    // ---- Fetch requests ----
    let requests_rows = sqlx::query!(
        r#"
        SELECT id, request_set_id, url
        FROM requests
        "#
    )
    .fetch_all(pool)
    .await?;

    let mut requests: Vec<Request> = requests_rows
        .into_iter()
        .map(|r| Request {
            id: r.id,
            request_set_id: r.request_set_id,
            url: r.url,
            headers: Vec::new(),
        })
        .collect();

    // ---- Fetch headers ----
    let headers_rows = sqlx::query!(
        r#"
        SELECT id, request_id, header_name, header_value
        FROM request_headers
        "#
    )
    .fetch_all(pool)
    .await?;

    let headers: Vec<RequestHeader> = headers_rows
        .into_iter()
        .map(|h| RequestHeader {
            id: h.id,
            request_id: h.request_id,
            header_name: h.header_name,
            header_value: h.header_value,
        })
        .collect();

    // ---- Assemble the hierarchy ----
    Ok(assemble_nested(sets, requests, headers))
}


    fn assemble_nested(
    mut sets: Vec<RequestSet>,
    mut requests: Vec<Request>,
    headers: Vec<RequestHeader>,
) -> Vec<RequestSet> {
    let mut headers_by_req: HashMap<i32, Vec<RequestHeader>> = HashMap::new();
    for header in headers {
        headers_by_req.entry(header.request_id).or_default().push(header);
    }

    for req in &mut requests {
        if let Some(hs) = headers_by_req.remove(&req.id) {
            req.headers = hs;
        }
    }

    let mut reqs_by_set: HashMap<i32, Vec<Request>> = HashMap::new();
    for req in requests {
        reqs_by_set.entry(req.request_set_id).or_default().push(req);
    }

    for set in &mut sets {
        if let Some(rs) = reqs_by_set.remove(&set.id) {
            set.requests = rs;
        }
    }

    sets
}
}


*/