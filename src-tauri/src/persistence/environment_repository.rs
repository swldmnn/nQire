use std::collections::HashMap;

use futures::TryStreamExt;
use sqlx::{Row, Sqlite, Transaction};

use crate::{
    domain::{Environment, EnvironmentValue},
    persistence::{EnvironmentRecord, EnvironmentValueRecord},
    AppState,
};

pub async fn fetch_environments(
    state: &tauri::State<'_, AppState>,
    environment_ids: Vec<u32>,
) -> Result<Vec<Environment>, String> {
    let environment_value_records = fetch_environment_value_records(state, &environment_ids)
        .await
        .map_err(|e| format!("Failed to fetch environment values {}", e))?;

    let mut values_by_environment_id: HashMap<u32, Vec<EnvironmentValue>> = HashMap::new();
    for environment_value in environment_value_records {
        values_by_environment_id
            .entry(environment_value.environment_id)
            .or_default()
            .push(EnvironmentValue::from(environment_value));
    }

    let environment_records = fetch_environment_records(state, &environment_ids)
        .await
        .map_err(|e| format!("Failed to fetch environments {}", e))?;

    let mut environments: Vec<Environment> = environment_records
        .into_iter()
        .map(Environment::from)
        .collect();

    for environment in &mut environments {
        if let Some(environment_values) = values_by_environment_id.remove(&environment.id.unwrap())
        {
            environment.values = environment_values
        }
    }

    Ok(environments)
}

pub async fn save_environment(
    state: &tauri::State<'_, AppState>,
    environment: Environment,
) -> Result<Environment, String> {
    let db = &state.db;
    let mut tx = db
        .begin()
        .await
        .map_err(|e| format!("Failed update environment: {}", e))?;

    let environment_id = upsert_environment(&mut tx, &environment)
        .await
        .map_err(|e| format!("Failed to update environment: {}", e))?;

    save_environment_values(&mut tx, &environment)
        .await
        .map_err(|e| format!("Failed to update environment values: {}", e))?;

    tx.commit()
        .await
        .map_err(|e| format!("Failed update environment: {}", e))?;

    Ok(fetch_environments(state, vec![environment_id])
        .await
        .map_err(|e| format!("Failed to load updated environment: {}", e))?
        .into_iter()
        .next()
        .ok_or_else(|| "Failed to load updated environment: No first element".to_string())?)
}

pub async fn delete_environment(
    state: &tauri::State<'_, AppState>,
    environment_id: u32,
) -> Result<u64, String> {
    let db = &state.db;

    let query_result = sqlx::query("DELETE FROM environments WHERE id = ?")
        .bind(environment_id)
        .execute(db)
        .await
        .map_err(|e| format!("Failed to delete environment: {}", e))?;

    Ok(query_result.rows_affected())
}

async fn fetch_environment_records(
    state: &tauri::State<'_, AppState>,
    environment_ids: &Vec<u32>,
) -> Result<Vec<EnvironmentRecord>, String> {
    let db = &state.db;

    if environment_ids.is_empty() {
        let all_environment_records: Vec<EnvironmentRecord> =
            sqlx::query_as::<_, EnvironmentRecord>("SELECT * FROM environments")
                .fetch(db)
                .try_collect()
                .await
                .map_err(|e| format!("Failed to fetch environments {}", e))?;

        Ok(all_environment_records)
    } else {
        let placeholders = environment_ids
            .iter()
            .map(|_| "?")
            .collect::<Vec<_>>()
            .join(",");

        let query = format!("SELECT * FROM environments WHERE id IN ({})", placeholders);
        let mut q = sqlx::query_as::<_, EnvironmentRecord>(&query);
        for id in environment_ids {
            q = q.bind(id);
        }

        let environment_records: Vec<EnvironmentRecord> = q
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to fetch environments {}", e))?;

        Ok(environment_records)
    }
}

async fn fetch_environment_value_records(
    state: &tauri::State<'_, AppState>,
    environment_ids: &Vec<u32>,
) -> Result<Vec<EnvironmentValueRecord>, String> {
    let db = &state.db;

    if environment_ids.is_empty() {
        let all_environment_value_records: Vec<EnvironmentValueRecord> =
            sqlx::query_as::<_, EnvironmentValueRecord>("SELECT * FROM environment_values")
                .fetch(db)
                .try_collect()
                .await
                .map_err(|e| format!("Failed to fetch environment values {}", e))?;

        Ok(all_environment_value_records)
    } else {
        let placeholders = environment_ids
            .iter()
            .map(|_| "?")
            .collect::<Vec<_>>()
            .join(",");

        let query = format!(
            "SELECT * FROM environment_values WHERE environment_id IN ({})",
            placeholders
        );
        let mut q = sqlx::query_as::<_, EnvironmentValueRecord>(&query);
        for id in environment_ids {
            q = q.bind(id);
        }

        let environment_value_records: Vec<EnvironmentValueRecord> = q
            .fetch(db)
            .try_collect()
            .await
            .map_err(|e| format!("Failed to fetch environment values {}", e))?;

        Ok(environment_value_records)
    }
}

async fn upsert_environment(
    tx: &mut Transaction<'_, Sqlite>,
    environment: &Environment,
) -> Result<u32, String> {
    match environment.id {
        Some(id) => {
            sqlx::query("UPDATE environments SET label = ? WHERE id = ?")
                .bind(environment.label.to_owned())
                .bind(id)
                .execute(&mut **tx)
                .await
                .map_err(|e| format!("Failed to update environment: {}", e))?;

            Ok(id)
        }
        None => {
            let query_result =
                sqlx::query("INSERT INTO environments (label) VALUES (?1) RETURNING id")
                    .bind(environment.label.to_owned())
                    .fetch_one(&mut **tx)
                    .await
                    .map_err(|e| format!("Failed to create environment: {}", e))?;

            Ok(query_result.get("id"))
        }
    }
}

async fn save_environment_values(
    tx: &mut Transaction<'_, Sqlite>,
    environment: &Environment,
) -> Result<(), String> {
    // Delete existing values
    sqlx::query("DELETE FROM environment_values WHERE environment_id = ?")
        .bind(environment.id)
        .execute(&mut **tx)
        .await
        .map_err(|e| format!("Failed to delete old environment values: {}", e))?;

    // Insert current values
    for environment_value in environment.values.iter() {
        sqlx::query("INSERT INTO environment_values (environment_id, key, value) VALUES (?, ?, ?)")
            .bind(environment.id)
            .bind(environment_value.key.as_str())
            .bind(environment_value.value.as_str())
            .execute(&mut **tx)
            .await
            .map_err(|e| format!("Failed to insert environment values: {}", e))?;
    }

    Ok(())
}
