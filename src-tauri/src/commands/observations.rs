use crate::db::{AppState, Entry};
use tauri::State;
use rusqlite::Connection;

fn query_setting(conn: &Connection, key: &str) -> Result<Option<String>, String> {
    let mut stmt = conn
        .prepare("SELECT value FROM settings WHERE key = ?1")
        .map_err(|e| format!("Failed to prepare query: {}", e))?;
    match stmt.query_row([key], |row| row.get::<_, String>(0)) {
        Ok(value) => Ok(Some(value)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(format!("Failed to query setting: {}", e)),
    }
}

#[tauri::command]
pub async fn get_observations(state: State<'_, AppState>) -> Result<String, String> {
    let (api_url, api_token, api_model, entries_text) = {
        let conn = state.db.lock().map_err(|_| "Failed to acquire database lock")?;

        let api_url = query_setting(&conn, "api_url")?
            .ok_or_else(|| "API URL not configured. Add it in Settings.".to_string())?;
        let api_token = query_setting(&conn, "api_token")?
            .ok_or_else(|| "API token not configured. Add it in Settings.".to_string())?;
        let api_model = query_setting(&conn, "api_model")?
            .unwrap_or_else(|| "gpt-4o-mini".to_string());

        let mut stmt = conn
            .prepare("SELECT id, date, time, weight_kg, bp_systolic, bp_diastolic, energy_level, notes, created_at FROM entries ORDER BY date DESC LIMIT 30")
            .map_err(|e| format!("Failed to prepare query: {}", e))?;
        let entries = stmt
            .query_map([], |row| {
                Ok(Entry {
                    id: row.get(0)?,
                    date: row.get(1)?,
                    time: row.get(2)?,
                    weight_kg: row.get(3)?,
                    bp_systolic: row.get(4)?,
                    bp_diastolic: row.get(5)?,
                    energy_level: row.get(6)?,
                    notes: row.get(7)?,
                    created_at: row.get(8)?,
                })
            })
            .map_err(|e| format!("Failed to query entries: {}", e))?
            .collect::<Result<Vec<_>, _>>()
            .map_err(|e| format!("Failed to collect entries: {}", e))?;

        let mut text = String::from("Date       | Time     | Weight (kg) | BP sys/dia  | Energy | Notes\n");
        text.push_str("-----------|----------|-------------|-------------|--------|------\n");
        for e in &entries {
            text.push_str(&format!(
                "{:<10} | {:<8} | {:<11} | {:>5}/{:<5} | {:<6} | {}\n",
                e.date,
                e.time,
                e.weight_kg.map(|v| format!("{:.1}", v)).unwrap_or_default(),
                e.bp_systolic.map(|v| v.to_string()).unwrap_or_default(),
                e.bp_diastolic.map(|v| v.to_string()).unwrap_or_default(),
                e.energy_level.map(|v| v.to_string()).unwrap_or_default(),
                e.notes.as_deref().unwrap_or(""),
            ));
        }

        (api_url, api_token, api_model, text)
    }; // lock dropped here, before any await

    let client = crate::llm::LlmClient { url: api_url, token: api_token, model: api_model };
    let system = "You are a health assistant. Analyze the following health tracking data and provide concise observations about trends in weight, blood pressure, and energy level. Note any patterns or concerns.";
    crate::llm::complete(&client, system, &entries_text).await
}
