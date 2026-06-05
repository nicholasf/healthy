use crate::db::AppState;
use tauri::State;
use rusqlite::params;

pub fn db_get_setting(conn: &rusqlite::Connection, key: &str) -> rusqlite::Result<Option<String>> {
    let sql = r#"
        SELECT value
        FROM settings
        WHERE key = ?1
    "#;
    
    let mut stmt = conn.prepare(sql)?;
    let value = match stmt.query_row([key], |row| row.get::<_, String>(0)) {
        Ok(v) => Ok(Some(v)),
        Err(rusqlite::Error::QueryReturnedNoRows) => Ok(None),
        Err(e) => Err(e),
    }?;
    
    Ok(value)
}

pub fn db_set_setting(conn: &rusqlite::Connection, key: &str, value: &str) -> rusqlite::Result<()> {
    let sql = r#"
        INSERT OR REPLACE INTO settings (key, value)
        VALUES (?1, ?2)
    "#;
    
    conn.execute(sql, params![key, value])?;
    
    Ok(())
}

#[tauri::command]
pub async fn get_setting(state: State<'_, AppState>, key: String) -> Result<Option<String>, String> {
    let conn = state.db.lock().map_err(|_| "Failed to acquire database lock")?;
    
    db_get_setting(&conn, &key).map_err(|e| format!("Failed to query setting: {}", e))
}

#[tauri::command]
pub async fn set_setting(state: State<'_, AppState>, key: String, value: String) -> Result<(), String> {
    let conn = state.db.lock().map_err(|_| "Failed to acquire database lock")?;
    
    db_set_setting(&conn, &key, &value).map_err(|e| format!("Failed to set setting: {}", e))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::db::open_in_memory;

    #[test]
    fn get_missing_setting_returns_none() {
        let conn = open_in_memory().unwrap();
        let result = db_get_setting(&conn, "non_existent_key").unwrap();
        assert_eq!(result, None);
    }

    #[test]
    fn set_and_get_setting() {
        let conn = open_in_memory().unwrap();
        db_set_setting(&conn, "test_key", "test_value").unwrap();
        let result = db_get_setting(&conn, "test_key").unwrap();
        assert_eq!(result, Some("test_value".to_string()));
    }

    #[test]
    fn overwrite_setting() {
        let conn = open_in_memory().unwrap();
        db_set_setting(&conn, "overwrite_key", "first_value").unwrap();
        db_set_setting(&conn, "overwrite_key", "second_value").unwrap();
        let result = db_get_setting(&conn, "overwrite_key").unwrap();
        assert_eq!(result, Some("second_value".to_string()));
    }
}