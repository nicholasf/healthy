use tauri::Manager;
use tauri::test::{mock_builder, mock_context, noop_assets};
use tempfile::TempDir;

use healthy_lib::commands::entries::{db_add_entry, db_delete_entry, db_get_entries};
use healthy_lib::commands::export::build_csv;
use healthy_lib::commands::settings::{db_get_setting, db_set_setting};
use healthy_lib::db::AppState;

fn build_test_app() -> (tauri::App<tauri::test::MockRuntime>, TempDir) {
    let dir = TempDir::new().unwrap();
    let db_path = dir.path().to_path_buf();
    let app = mock_builder()
        .build(mock_context(noop_assets()))
        .expect("failed to build test app");
    let conn = healthy_lib::db::init(&db_path).expect("failed to init db");
    app.manage(AppState {
        db: std::sync::Mutex::new(conn),
    });
    (app, dir)
}

#[test]
fn test_app_state_is_managed() {
    let (app, _dir) = build_test_app();
    let state = app.state::<AppState>();
    let _conn = state.db.lock().expect("lock should not be poisoned");
}

#[test]
fn test_entry_lifecycle() {
    let (app, _dir) = build_test_app();
    let state = app.state::<AppState>();
    let conn = state.db.lock().unwrap();

    let e1 = db_add_entry(&conn, "2024-01-01", "9:00 AM", Some(70.5), Some(120), Some(80), Some(3), Some("day 1")).unwrap();
    db_add_entry(&conn, "2024-01-02", "10:00 AM", Some(71.0), Some(125), Some(82), Some(4), Some("day 2")).unwrap();
    db_add_entry(&conn, "2024-01-03", "11:00 AM", Some(70.8), Some(118), Some(78), Some(2), Some("day 3")).unwrap();

    let entries = db_get_entries(&conn).unwrap();
    assert_eq!(entries.len(), 3);

    db_delete_entry(&conn, e1.id).unwrap();

    let entries = db_get_entries(&conn).unwrap();
    assert_eq!(entries.len(), 2);
}

#[test]
fn test_settings_roundtrip() {
    let (app, _dir) = build_test_app();
    let state = app.state::<AppState>();
    let conn = state.db.lock().unwrap();

    db_set_setting(&conn, "api_url", "http://pond:9337").unwrap();
    db_set_setting(&conn, "api_model", "qwen3-coder-30b").unwrap();

    assert_eq!(db_get_setting(&conn, "api_url").unwrap(), Some("http://pond:9337".to_string()));
    assert_eq!(db_get_setting(&conn, "api_model").unwrap(), Some("qwen3-coder-30b".to_string()));
    assert_eq!(db_get_setting(&conn, "api_token").unwrap(), None);
}

#[test]
fn test_csv_export_content() {
    let (app, _dir) = build_test_app();
    let state = app.state::<AppState>();
    let conn = state.db.lock().unwrap();

    db_add_entry(&conn, "2024-01-01", "9:00 AM", Some(72.0), Some(120), Some(80), Some(4), Some("good day")).unwrap();
    db_add_entry(&conn, "2024-01-02", "10:00 AM", Some(71.5), Some(118), Some(78), Some(3), None).unwrap();

    let mut entries = db_get_entries(&conn).unwrap();
    entries.sort_by(|a, b| a.date.cmp(&b.date));

    let csv = build_csv(&entries).unwrap();
    let lines: Vec<&str> = csv.lines().collect();
    assert_eq!(lines[0], "date,time,weight_kg,bp_systolic,bp_diastolic,energy_level,notes");
    assert_eq!(lines.len(), 3); // header + 2 rows
    assert!(lines[1].starts_with("2024-01-01,9:00 AM,72"));
}
