pub mod db;
pub mod llm;
pub mod commands;

use tauri::Manager;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let data_dir = app.path().app_data_dir().map_err(|e| e.to_string())?;
            let conn = db::init(&data_dir).map_err(|e| e.to_string())?;
            app.manage(db::AppState {
                db: std::sync::Mutex::new(conn),
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            commands::entries::add_entry,
            commands::entries::get_entries,
            commands::entries::delete_entry,
            commands::settings::get_setting,
            commands::settings::set_setting,
            commands::export::export_csv,
            commands::observations::get_observations
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
