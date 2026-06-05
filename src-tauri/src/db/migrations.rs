pub const CREATE_ENTRIES: &str = r#"
CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    time TEXT NOT NULL DEFAULT '12:00 PM',
    weight_kg REAL,
    bp_systolic INTEGER,
    bp_diastolic INTEGER,
    energy_level INTEGER,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(date, time)
);
"#;

pub const CREATE_SETTINGS: &str = r#"
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);
"#;

pub const MIGRATE_ADD_TIME: &str = r#"
CREATE TABLE entries_new (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    time TEXT NOT NULL DEFAULT '12:00 PM',
    weight_kg REAL,
    bp_systolic INTEGER,
    bp_diastolic INTEGER,
    energy_level INTEGER,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    UNIQUE(date, time)
);
INSERT OR IGNORE INTO entries_new (id, date, time, weight_kg, bp_systolic, bp_diastolic, energy_level, notes, created_at) SELECT id, date, '12:00 PM', weight_kg, bp_systolic, bp_diastolic, energy_level, notes, created_at FROM entries;
DROP TABLE entries;
ALTER TABLE entries_new RENAME TO entries;
"#;