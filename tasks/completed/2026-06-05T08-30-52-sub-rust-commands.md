# Sub-task: Rust Commands + LLM Client

**Type:** sub-task
**Parent:** 2026-06-05T08-30-50-programme-build-healthy-app.md
**Created:** 2026-06-05 08:30:50
**Model:** qwen3-coder-30b
**Status:** planned

## ⚠️ Do not run any git commands.

## Goal

Implement all Tauri commands, the LLM HTTP client, and wire everything into lib.rs.

## Background

Read `src-tauri/src/db/mod.rs` and `src-tauri/src/db/schema.rs` before writing anything.

## Changes

### src-tauri/src/llm.rs

- `pub struct LlmClient { pub url: String, pub token: String, pub model: String }`
- `pub async fn complete(client: &LlmClient, system: &str, user: &str) -> Result<String, String>`: POST to `{url}/v1/chat/completions` with `Authorization: Bearer {token}`, body `{ model, messages: [{role:"system",...},{role:"user",...}], stream: false }`. Return `choices[0].message.content`. Use typed request/response structs with serde.

### src-tauri/src/commands/mod.rs

`pub mod entries; pub mod export; pub mod observations; pub mod settings;`

### src-tauri/src/commands/entries.rs

Three `#[tauri::command] pub async fn` taking `state: tauri::State<'_, crate::db::AppState>`:
- `add_entry(state, date: String, weight_kg: Option<f64>, bp_systolic: Option<i64>, bp_diastolic: Option<i64>, energy_level: Option<i64>, notes: Option<String>) -> Result<crate::db::Entry, String>`: INSERT then SELECT by `last_insert_rowid()`. Use `rusqlite::params![...]` for mixed types.
- `get_entries(state) -> Result<Vec<crate::db::Entry>, String>`: SELECT all ORDER BY date DESC
- `delete_entry(state, id: i64) -> Result<(), String>`: DELETE WHERE id = ?

### src-tauri/src/commands/settings.rs

- `get_setting(state, key: String) -> Result<Option<String>, String>`: SELECT value WHERE key = ?
- `set_setting(state, key: String, value: String) -> Result<(), String>`: INSERT OR REPLACE

### src-tauri/src/commands/export.rs

`export_csv(state: tauri::State<'_, crate::db::AppState>, app: tauri::AppHandle) -> Result<String, String>`:
- SELECT all entries ORDER BY date ASC
- Write CSV to `app.path().download_dir()/healthy_export_<today>.csv` using `chrono::Utc::now().format("%Y-%m-%d")`
- Header: `date,weight_kg,bp_systolic,bp_diastolic,energy_level,notes`
- Return the full path string

### src-tauri/src/commands/observations.rs

`get_observations(state: tauri::State<'_, crate::db::AppState>) -> Result<String, String>`:
- Lock the DB, read `api_url`, `api_token`, `api_model` settings and last 30 entries, then **drop the lock before any await**
- Return error string if api_url or api_token unset
- Format entries as a plain-text table
- System prompt: "You are a health assistant. Analyze the following health tracking data and provide concise observations about trends in weight, blood pressure, and energy level. Note any patterns or concerns."
- Use a private sync helper `fn query_setting(conn: &rusqlite::Connection, key: &str) -> Result<Option<String>, String>` — not async

### src-tauri/src/lib.rs

Replace scaffold content entirely:
- `mod db; mod llm; mod commands;`
- `use tauri::Manager;`
- `.setup()` closure: get `app.path().app_data_dir()`, call `db::init()`, call `app.manage(db::AppState { db: std::sync::Mutex::new(conn) })`
- `.invoke_handler(tauri::generate_handler![commands::entries::add_entry, commands::entries::get_entries, commands::entries::delete_entry, commands::settings::get_setting, commands::settings::set_setting, commands::export::export_csv, commands::observations::get_observations])`
- No `tauri_plugin_opener`

## Done when

- [ ] `src-tauri/src/llm.rs` has `LlmClient` struct and `complete()` function
- [ ] `src-tauri/src/commands/entries.rs` has `add_entry`, `get_entries`, `delete_entry`
- [ ] `src-tauri/src/lib.rs` registers all 7 commands and manages AppState

## Results
<!-- Filled in by the executing model after completion -->
**Tests:**
**Files changed:**
**Summary:**
