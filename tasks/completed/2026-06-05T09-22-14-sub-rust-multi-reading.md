# Sub-task: Rust — Multi-reading schema + commands

**Type:** sub-task
**Parent:** 2026-06-05T09-22-13-programme-multi-reading.md
**Created:** 2026-06-05 09:22:13
**Model:** qwen3-coder-30b
**Status:** planned

## ⚠️ Do not run any git commands.

## Goal

Update the DB schema to support multiple readings per day, add a `time` field, and update all Rust commands and tests accordingly.

## Background

Read before starting:
- `src-tauri/src/db/migrations.rs`
- `src-tauri/src/db/schema.rs`
- `src-tauri/src/db/mod.rs`
- `src-tauri/src/commands/entries.rs`
- `src-tauri/src/commands/export.rs`
- `src-tauri/tests/integration.rs`

## Changes

### src-tauri/src/db/migrations.rs

Update `CREATE_ENTRIES` to the new schema:
- Remove `UNIQUE` on `date`
- Add `time TEXT NOT NULL DEFAULT '12:00 PM'` after `date`
- Add `UNIQUE(date, time)` as a table constraint

Add a new constant `MIGRATE_ADD_TIME`: a SQL block (suitable for `execute_batch`) that:
1. Creates `entries_new` with the new schema
2. `INSERT OR IGNORE INTO entries_new (id, date, time, weight_kg, bp_systolic, bp_diastolic, energy_level, notes, created_at) SELECT id, date, '12:00 PM', weight_kg, bp_systolic, bp_diastolic, energy_level, notes, created_at FROM entries`
3. `DROP TABLE entries`
4. `ALTER TABLE entries_new RENAME TO entries`

### src-tauri/src/db/mod.rs

In `init()`, after running `CREATE_ENTRIES` and `CREATE_SETTINGS`, check whether the `time` column exists:

```
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
```

`open_in_memory()` (the test helper) uses `CREATE_ENTRIES` which already has the new schema, so no migration needed there.

### src-tauri/src/db/schema.rs

Add `pub time: String` to `Entry` between `date` and `weight_kg`. Keep `#[serde(rename_all = "camelCase")]`.

### src-tauri/src/commands/entries.rs

Update `db_add_entry` signature to add `time: &str` after `date: &str`. Update the INSERT SQL to include `time` as column 2 and `?2` in VALUES (shift other params). Update the SELECT query to include `time` as column 2 and map it in the row closure (shift all column indices).

Update `db_get_entries` SELECT to include `time` as column 2, ORDER BY `date DESC, time DESC`. Shift all row.get indices.

Update `add_entry` Tauri command to add `time: String` parameter. Pass `&time` to `db_add_entry`.

Update unit tests:
- `add_and_get_entry`: add `"9:00 AM"` as the time argument, assert `entry.time == "9:00 AM"`
- `delete_entry`: add time argument
- `duplicate_date_is_rejected` → rename to `duplicate_datetime_is_rejected`: same date AND same time should fail; add a second test `same_date_different_time_is_allowed` that adds two entries with the same date but different times and asserts both succeed

### src-tauri/src/commands/export.rs

Update `build_csv` header to: `date,time,weight_kg,bp_systolic,bp_diastolic,energy_level,notes`

Update each row to include `entry.time.clone()` as the second field.

Update the SELECT in `export_csv` to include `time` as column 2, shift other column indices.

Update `csv_row_matches_entry` test: add `time: "9:30 AM".to_string()` to the Entry, assert `time` appears in the CSV row.

### src-tauri/tests/integration.rs

Add `"9:00 AM"` time argument to all `db_add_entry` calls.

In `test_entry_lifecycle`: use distinct times when adding same-day entries if needed (or use different dates — easier).

In `test_csv_export_content`: assert the header line matches the new header including `time`.

## Done when

- [ ] `cargo check --manifest-path src-tauri/Cargo.toml` exits 0
- [ ] `cargo test --manifest-path src-tauri/Cargo.toml 2>&1 | grep "FAILED"` returns no output

## Results
<!-- Filled in by the executing model after completion -->
**Tests:**
**Files changed:**
**Summary:**
