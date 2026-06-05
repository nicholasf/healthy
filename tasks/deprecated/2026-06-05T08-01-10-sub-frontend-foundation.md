# Sub-task: Frontend Foundation (types, commands, hooks, App shell)

**Type:** sub-task
**Parent:** 2026-06-05T08-01-07-programme-build-healthy-app.md
**Created:** 2026-06-05 08:01:07
**Model:** qwen3-coder-30b — mechanical TypeScript scaffolding
**Status:** planned

## Goal

Implement TypeScript types, typed invoke wrappers, hooks, and the top-level tab layout in App.tsx.

## Background

Depends on rust-core and rust-commands being complete. The 7 Tauri commands are: `add_entry`, `get_entries`, `delete_entry`, `get_setting`, `set_setting`, `export_csv`, `get_observations`. All Rust struct fields use camelCase in JSON (serde rename_all).

## Changes

### src/types/index.ts

```
Entry: { id: number; date: string; weightKg: number | null; bpSystolic: number | null; bpDiastolic: number | null; energyLevel: number | null; notes: string | null; createdAt: string }
Setting: { key: string; value: string }
```

### src/lib/commands.ts

Typed wrappers using `invoke` from `@tauri-apps/api/core`. One exported async function per command, matching the Rust signatures exactly. `addEntry` takes optional fields for weightKg, bpSystolic, bpDiastolic, energyLevel, notes. `exportCsv` and `getObservations` return string. `getSetting` returns `string | null`.

### src/hooks/useEntries.ts

`useEntries()` returns `{ entries: Entry[], addEntry, deleteEntry, refresh, loading: boolean }`. Calls `getEntries` on mount. `addEntry` and `deleteEntry` call the command then refresh.

### src/hooks/useSettings.ts

`useSettings()` returns `{ settings: Record<string, string>, setSetting, getSetting, loading: boolean }`. Loads all three known settings keys (`api_url`, `api_token`, `api_model`) on mount using `getSetting` for each.

### src/App.tsx

Replace scaffold content entirely. Four tabs: **Entry**, **History**, **Observations**, **Settings**. Active tab tracked with `useState`. Renders the matching component. Import all four components. No routing library — pure state. Simple tab bar at the top using `<button>` elements.

### src/App.css

Replace scaffold content with minimal styles: tab bar layout (flex row, buttons with active state), main content padding, basic font/reset. Keep it simple — no UI library.

## Recommended approach

Write types/index.ts → lib/commands.ts → hooks → App.tsx → App.css.

## Done when

- [ ] `src/types/index.ts` exports `Entry` and `Setting`
- [ ] `src/lib/commands.ts` exports all 7 typed wrappers
- [ ] `src/hooks/useEntries.ts` and `useSettings.ts` compile without errors
- [ ] `src/App.tsx` renders a 4-tab layout and imports all components

## Results
<!-- Filled in by the executing model after completion -->
**Tests:**
All files compile correctly and implement the required functionality as specified in the task.

**Files changed:**
- src/types/index.ts
- src/lib/commands.ts
- src/hooks/useEntries.ts
- src/hooks/useSettings.ts
- src/App.tsx
- src/App.css

**Summary:**
Successfully implemented the frontend foundation as specified in the task. Created TypeScript types for Entry and Setting, implemented typed command wrappers for all 7 Tauri commands, built useEntries and useSettings hooks with proper loading states and error handling, and implemented a 4-tab layout in App.tsx with proper styling. The implementation follows the requirements exactly, including camelCase field names matching the Rust backend, proper async handling, and clean component structure.
