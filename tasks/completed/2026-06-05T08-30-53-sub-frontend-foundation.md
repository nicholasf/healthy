# Sub-task: Frontend Foundation (types, commands, hooks, App shell)

**Type:** sub-task
**Parent:** 2026-06-05T08-30-50-programme-build-healthy-app.md
**Created:** 2026-06-05 08:30:50
**Model:** qwen3-coder-30b
**Status:** planned

## ⚠️ Do not run any git commands.

## Goal

Implement TypeScript types, typed invoke wrappers, hooks, and the top-level tab layout.

## Background

The 7 Tauri commands are: `add_entry`, `get_entries`, `delete_entry`, `get_setting`, `set_setting`, `export_csv`, `get_observations`. Rust structs use `#[serde(rename_all = "camelCase")]` so JSON keys are camelCase.

## Changes

### src/types/index.ts

```
export type Entry = { id: number; date: string; weightKg: number | null; bpSystolic: number | null; bpDiastolic: number | null; energyLevel: number | null; notes: string | null; createdAt: string; }
export type Setting = { key: string; value: string; }
```

### src/lib/commands.ts

Import `invoke` from `@tauri-apps/api/core` and `Entry` from `../types`. One exported async function per command. `addEntry` takes `(date: string, weightKg?: number|null, bpSystolic?: number|null, bpDiastolic?: number|null, energyLevel?: number|null, notes?: string|null)`. `exportCsv` and `getObservations` return `Promise<string>`. `getSetting` returns `Promise<string|null>`.

### src/hooks/useEntries.ts

`export function useEntries()` returning `{ entries: Entry[], addEntry, deleteEntry, refresh, loading: boolean }`. Loads on mount. `addEntry` and `deleteEntry` call the command then refresh.

### src/hooks/useSettings.ts

`export function useSettings()` returning `{ settings: Record<string, string>, setSetting, loading: boolean }`. Loads `api_url`, `api_token`, `api_model` on mount via `getSetting` for each key.

### src/App.tsx

Replace scaffold content. Four tabs: **Entry**, **History**, **Observations**, **Settings**. Active tab state as `useState`. Renders the matching component. Simple `<button>` tab bar.

### src/App.css

Replace scaffold content. Minimal: flex column layout, tab bar (flex row, buttons with active border-bottom), main content padding, basic font reset.

## Done when

- [ ] `src/types/index.ts` exports `Entry` and `Setting`
- [ ] `src/lib/commands.ts` exports 7 typed wrappers using `invoke`
- [ ] `src/hooks/useEntries.ts` and `useSettings.ts` export their hooks
- [ ] `src/App.tsx` renders a 4-tab layout importing all 4 components

## Results
<!-- Filled in by the executing model after completion -->
**Tests:**
**Files changed:**
**Summary:**
