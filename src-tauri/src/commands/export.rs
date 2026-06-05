use crate::db::{AppState, Entry};
use tauri::{Manager, State};
use chrono::Utc;
use csv::Writer;

pub fn build_csv(entries: &[Entry]) -> Result<String, csv::Error> {
    let mut wtr = Writer::from_writer(vec![]);
    
    // Write header
    wtr.write_record(&["date", "time", "weight_kg", "bp_systolic", "bp_diastolic", "energy_level", "notes"])?;
    
    // Write entries
    for entry in entries {
        wtr.write_record(&[
            entry.date.clone(),
            entry.time.clone(),
            entry.weight_kg.map(|v| v.to_string()).unwrap_or_else(|| "".to_string()),
            entry.bp_systolic.map(|v| v.to_string()).unwrap_or_else(|| "".to_string()),
            entry.bp_diastolic.map(|v| v.to_string()).unwrap_or_else(|| "".to_string()),
            entry.energy_level.map(|v| v.to_string()).unwrap_or_else(|| "".to_string()),
            entry.notes.clone().unwrap_or_else(|| "".to_string()),
        ])?;
    }
    
    let csv_content = String::from_utf8(wtr.into_inner().unwrap()).expect("CSV is valid UTF-8");
    Ok(csv_content)
}

#[tauri::command]
pub async fn export_csv(state: State<'_, AppState>, app: tauri::AppHandle) -> Result<String, String> {
    let conn = state.db.lock().map_err(|_| "Failed to acquire database lock")?;
    
    let sql = r#"
        SELECT id, date, time, weight_kg, bp_systolic, bp_diastolic, energy_level, notes, created_at
        FROM entries
        ORDER BY date ASC
    "#;
    
    let mut stmt = conn.prepare(sql).map_err(|e| format!("Failed to prepare query: {}", e))?;
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
    }).map_err(|e| format!("Failed to query entries: {}", e))?
    .collect::<Result<Vec<_>, _>>()
    .map_err(|e| format!("Failed to collect entries: {}", e))?;
    
    let csv_content = build_csv(&entries).map_err(|e| format!("Failed to build CSV: {}", e))?;
    
    let date_str = Utc::now().format("%Y-%m-%d").to_string();
    let file_name = format!("healthy_export_{}.csv", date_str);
    let download_dir = app.path().download_dir().map_err(|e| format!("Failed to get download directory: {}", e))?;
    let file_path = download_dir.join(file_name);
    
    std::fs::write(&file_path, csv_content).map_err(|e| format!("Failed to write CSV file: {}", e))?;
    
    Ok(file_path.to_string_lossy().to_string())
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn empty_csv_has_header_only() {
        let entries: Vec<Entry> = vec![];
        let csv_content = build_csv(&entries).unwrap();
        assert_eq!(csv_content, "date,time,weight_kg,bp_systolic,bp_diastolic,energy_level,notes\n");
    }

    #[test]
    fn csv_row_matches_entry() {
        let entry = Entry {
            id: 1,
            date: "2023-01-01".to_string(),
            time: "9:30 AM".to_string(),
            weight_kg: Some(70.5),
            bp_systolic: Some(120),
            bp_diastolic: Some(80),
            energy_level: Some(3),
            notes: Some("Feeling good".to_string()),
            created_at: "2023-01-01 10:00:00".to_string(),
        };
        
        let entries = vec![entry];
        let csv_content = build_csv(&entries).unwrap();
        
        // Check that the header is present
        assert!(csv_content.starts_with("date,time,weight_kg,bp_systolic,bp_diastolic,energy_level,notes\n"));
        
        // Check that the entry data is present in the second line
        let lines: Vec<&str> = csv_content.lines().collect();
        assert_eq!(lines.len(), 2);
        assert_eq!(lines[1], "2023-01-01,9:30 AM,70.5,120,80,3,Feeling good");
    }
}