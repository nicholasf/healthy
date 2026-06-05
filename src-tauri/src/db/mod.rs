pub mod migrations;
pub mod schema;

pub use schema::Entry;

use std::sync::Mutex;
use std::path::Path;
use rusqlite::Connection;

pub struct AppState {
    pub db: Mutex<Connection>,
}

pub fn init(path: &Path) -> rusqlite::Result<Connection> {
    let db_path = path.join("healthy.db");
    let conn = Connection::open(db_path)?;
    
    conn.execute_batch(migrations::CREATE_ENTRIES)?;
    conn.execute_batch(migrations::CREATE_SETTINGS)?;
    
    // Check if the time column exists (for upgrading from older versions)
    let has_time: bool = conn
        .query_row(
            "SELECT COUNT(*) FROM pragma_table_info('entries') WHERE name='time'",
            [],
            |row| row.get::<_, i64>(0),
        )
        .unwrap_or(0) > 0;

    if !has_time {
        conn.execute_batch(migrations::MIGRATE_ADD_TIME)?;
    }
    
    Ok(conn)
}

#[cfg(test)]
pub(crate) fn open_in_memory() -> rusqlite::Result<rusqlite::Connection> {
    let conn = rusqlite::Connection::open_in_memory()?;
    conn.execute_batch(migrations::CREATE_ENTRIES)?;
    conn.execute_batch(migrations::CREATE_SETTINGS)?;
    Ok(conn)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn schema_creates_entries_table() {
        let conn = open_in_memory().unwrap();
        let count: i64 = conn.query_row(
            "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='entries'",
            [],
            |row| row.get(0)
        ).unwrap();
        assert_eq!(count, 1);
    }

    #[test]
    fn schema_creates_settings_table() {
        let conn = open_in_memory().unwrap();
        let count: i64 = conn.query_row(
            "SELECT COUNT(*) FROM sqlite_master WHERE type='table' AND name='settings'",
            [],
            |row| row.get(0)
        ).unwrap();
        assert_eq!(count, 1);
    }
}