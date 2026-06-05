use crate::db::{AppState, Entry};
use tauri::State;
use rusqlite::params;

pub fn db_add_entry(
    conn: &rusqlite::Connection,
    date: &str,
    time: &str,
    weight_kg: Option<f64>,
    bp_systolic: Option<i64>,
    bp_diastolic: Option<i64>,
    energy_level: Option<i64>,
    notes: Option<&str>,
) -> rusqlite::Result<Entry> {
    let sql = r#"
        INSERT INTO entries (date, time, weight_kg, bp_systolic, bp_diastolic, energy_level, notes)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)
    "#;
    
    conn.execute(sql, params![date, time, weight_kg, bp_systolic, bp_diastolic, energy_level, notes])?;
    
    let last_id = conn.last_insert_rowid();
    
    let sql = r#"
        SELECT id, date, time, weight_kg, bp_systolic, bp_diastolic, energy_level, notes, created_at
        FROM entries
        WHERE id = ?1
    "#;
    
    let mut stmt = conn.prepare(sql)?;
    let entry = stmt.query_row([last_id], |row| {
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
    })?;
    
    Ok(entry)
}

pub fn db_get_entries(conn: &rusqlite::Connection) -> rusqlite::Result<Vec<Entry>> {
    let sql = r#"
        SELECT id, date, time, weight_kg, bp_systolic, bp_diastolic, energy_level, notes, created_at
        FROM entries
        ORDER BY date DESC, time DESC
    "#;
    
    let mut stmt = conn.prepare(sql)?;
    let entries = stmt.query_map([], |row| {
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
    })?
    .collect::<Result<Vec<_>, _>>()?;
    
    Ok(entries)
}

pub fn db_delete_entry(conn: &rusqlite::Connection, id: i64) -> rusqlite::Result<()> {
    let sql = r#"
        DELETE FROM entries
        WHERE id = ?1
    "#;
    
    conn.execute(sql, params![id])?;
    
    Ok(())
}

#[tauri::command]
pub async fn add_entry(
    state: State<'_, AppState>,
    date: String,
    time: String,
    weight_kg: Option<f64>,
    bp_systolic: Option<i64>,
    bp_diastolic: Option<i64>,
    energy_level: Option<i64>,
    notes: Option<String>,
) -> Result<Entry, String> {
    let conn = state.db.lock().map_err(|_| "Failed to acquire database lock")?;
    
    db_add_entry(
        &conn,
        &date,
        &time,
        weight_kg,
        bp_systolic,
        bp_diastolic,
        energy_level,
        notes.as_deref(),
    ).map_err(|e| format!("Failed to insert entry: {}", e))
}

#[tauri::command]
pub async fn get_entries(state: State<'_, AppState>) -> Result<Vec<Entry>, String> {
    let conn = state.db.lock().map_err(|_| "Failed to acquire database lock")?;
    
    db_get_entries(&conn).map_err(|e| format!("Failed to query entries: {}", e))
}

#[tauri::command]
pub async fn delete_entry(state: State<'_, AppState>, id: i64) -> Result<(), String> {
    let conn = state.db.lock().map_err(|_| "Failed to acquire database lock")?;
    
    db_delete_entry(&conn, id).map_err(|e| format!("Failed to delete entry: {}", e))
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::db::open_in_memory;

    #[test]
    fn add_and_get_entry() {
        let conn = open_in_memory().unwrap();
        let entry = db_add_entry(
            &conn,
            "2023-01-01",
            "9:00 AM",
            Some(70.5),
            Some(120),
            Some(80),
            Some(3),
            Some("Feeling good"),
        ).unwrap();

        assert_eq!(entry.date, "2023-01-01");
        assert_eq!(entry.time, "9:00 AM");
        assert_eq!(entry.weight_kg, Some(70.5));
        assert_eq!(entry.bp_systolic, Some(120));
        assert_eq!(entry.bp_diastolic, Some(80));
        assert_eq!(entry.energy_level, Some(3));
        assert_eq!(entry.notes, Some("Feeling good".to_string()));

        let entries = db_get_entries(&conn).unwrap();
        assert_eq!(entries.len(), 1);
        assert_eq!(entries[0].date, "2023-01-01");
        assert_eq!(entries[0].time, "9:00 AM");
    }

    #[test]
    fn delete_entry() {
        let conn = open_in_memory().unwrap();
        let entry = db_add_entry(
            &conn,
            "2023-01-01",
            "9:00 AM",
            Some(70.5),
            Some(120),
            Some(80),
            Some(3),
            Some("Feeling good"),
        ).unwrap();

        db_delete_entry(&conn, entry.id).unwrap();
        let entries = db_get_entries(&conn).unwrap();
        assert_eq!(entries.len(), 0);
    }

    #[test]
    fn duplicate_datetime_is_rejected() {
        let conn = open_in_memory().unwrap();
        db_add_entry(
            &conn,
            "2023-01-01",
            "9:00 AM",
            Some(70.5),
            Some(120),
            Some(80),
            Some(3),
            Some("Feeling good"),
        ).unwrap();

        let result = db_add_entry(
            &conn,
            "2023-01-01",
            "9:00 AM",
            Some(71.0),
            Some(125),
            Some(85),
            Some(4),
            Some("Feeling better"),
        );
        
        assert!(result.is_err());
    }

    #[test]
    fn same_date_different_time_is_allowed() {
        let conn = open_in_memory().unwrap();
        db_add_entry(
            &conn,
            "2023-01-01",
            "9:00 AM",
            Some(70.5),
            Some(120),
            Some(80),
            Some(3),
            Some("Feeling good"),
        ).unwrap();

        let entry = db_add_entry(
            &conn,
            "2023-01-01",
            "3:00 PM",
            Some(71.0),
            Some(125),
            Some(85),
            Some(4),
            Some("Feeling better"),
        ).unwrap();
        
        assert_eq!(entry.time, "3:00 PM");
    }
}