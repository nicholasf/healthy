# Development Log

## 2026-06-05 — Multi-reading refactor

Added `time` field (12-hour string, e.g. "9:30 AM") to entries, enabling multiple readings per day. Removed UNIQUE constraint on `date`, replaced with UNIQUE(date, time). Added `MIGRATE_ADD_TIME` migration that recreates the table via SQLite's rename pattern; `init()` checks for the column and runs it automatically on existing DBs. Updated all Rust commands, export CSV, LLM observations prompt, schema struct, and tests. Frontend: `EntryForm` gains a time picker (HTML `<input type="time">` converted to/from 12-hour on submit), auto-inherits weight and BP from the most recent entry on mount. History and Charts updated for the new field. 11 unit + 4 integration Rust tests green; 5 React tests green. Delegated to qwen3-coder-30b on pond.

## 2026-06-05 — Rust unit + integration tests

Refactored command modules to extract testable core functions (`db_add_entry`, `db_get_entries`, `db_delete_entry`, `db_get_setting`, `db_set_setting`, `build_csv`). Added `#[cfg(test)]` unit tests in `db/mod.rs`, `commands/entries.rs`, `commands/settings.rs`, `commands/export.rs` (10 tests total). Added `src-tauri/tests/integration.rs` using Tauri's `MockRuntime` — `build_test_app()` creates a full mock Tauri app with real SQLite in a tempdir and tests entry lifecycle, settings roundtrip, CSV content, and state management. Fixed broken `get_setting` error handling in `settings.rs`. Delegated to qwen3-coder-30b on pond.

## 2026-06-05 — Initial app implementation

Built the full starting-point implementation of the healthy Tauri app. Rust backend: SQLite via rusqlite (bundled), schema with entries and settings tables, 7 Tauri commands (add_entry, get_entries, delete_entry, get_setting, set_setting, export_csv, get_observations), OpenAI-compatible LLM client via reqwest. React frontend: typed invoke wrappers, useEntries/useSettings hooks, 4-tab layout (Entry, History+Charts, Observations, Settings), Recharts line charts for weight/BP/energy. Project renamed from scaffold to "healthy" throughout. Delegated to qwen3-coder-30b on pond; Rust correctness fixes (lib.rs builder pattern, mutex-before-await) applied by Claude.

## 2026-06-05 — Scaffold Tauri project structure

Copied Tauri v2 + React TypeScript scaffold into project root and layered planned application structure on top. Created stub files for all frontend components (`EntryForm`, `History`, `Charts`, `Observations`, `Settings`), hooks, lib, and types directories. Created Rust module stubs for `commands/`, `db/`, and `llm.rs`. Existing `CLAUDE.md`, `DESIGN.md`, and `README.md` were preserved. Executed by qwen3-coder-30b on pond.