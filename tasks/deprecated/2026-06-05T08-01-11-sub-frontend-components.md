# Sub-task: Frontend Components

**Type:** sub-task
**Parent:** 2026-06-05T08-01-07-programme-build-healthy-app.md
**Created:** 2026-06-05 08:01:07
**Model:** qwen3-coder-30b — mechanical React scaffolding
**Status:** completed

## Goal

Implement all five React components and add recharts to package.json.

## Background

Depends on frontend-foundation being complete. Read src/types/index.ts, src/lib/commands.ts, src/hooks/useEntries.ts, src/hooks/useSettings.ts before starting. All components are imported by App.tsx.

## Changes

### package.json

Add to `dependencies`: `"recharts": "^2.15.0"`. Do not change any other field.

### src/components/EntryForm.tsx

Uses `useEntries()`. Form fields:
- date: text input, defaults to today (YYYY-MM-DD)
- weight_kg: number input (optional, step 0.1)
- bp_systolic: number input (optional)
- bp_diastolic: number input (optional)
- energy_level: range input or select, 0–5 (optional)
- notes: textarea (optional)

On submit: calls `addEntry`, clears form on success, shows inline error on failure.

### src/components/History.tsx

Uses `useEntries()`. Renders entries as an HTML table, newest first. Columns: Date, Weight (kg), BP (sys/dia), Energy, Notes, Delete. Delete button calls `deleteEntry(entry.id)`. Shows "No entries yet." when empty.

### src/components/Charts.tsx

Uses `useEntries()`. Renders three Recharts `LineChart` components stacked vertically:
1. Weight over time (weightKg vs date)
2. Blood pressure over time (bpSystolic and bpDiastolic as two lines vs date)
3. Energy level over time (energyLevel vs date)

Data must be sorted by date ASC before charting. Skip null values. Show "No data to chart." when entries is empty. Use `ResponsiveContainer` with `width="100%"`.

### src/components/Observations.tsx

Local state: `text: string`, `loading: boolean`, `error: string | null`. Button "Get Observations" calls `getObservations()`, displays result in a `<pre>` or `<p>`. Shows spinner text while loading. Shows error inline if the command fails (e.g. API not configured).

### src/components/Settings.tsx

Uses `useSettings()`. Form with three fields: API URL, API Token (password input), Model (text, placeholder "gpt-4o-mini"). On submit: calls `setSetting` for each changed field. Shows "Saved." confirmation for 2 seconds on success. Also renders an "Export CSV" button that calls `exportCsv()` and displays the returned path.

## Recommended approach

Write components in order: EntryForm → History → Charts → Observations → Settings. Update package.json last.

## Done when

- [x] All five component files compile without TypeScript errors
- [x] `package.json` includes `recharts`
- [x] `Charts.tsx` imports from `recharts` and uses `ResponsiveContainer`
- [x] `Settings.tsx` calls both `setSetting` and `exportCsv`

## Results
<!-- Filled in by the executing model after completion -->
**Tests:**
All components compile without TypeScript errors
- EntryForm.tsx uses useEntries() hook and implements all required form fields
- History.tsx uses useEntries() hook and displays entries in a table
- Charts.tsx uses useEntries() hook and renders three Recharts LineChart components
- Observations.tsx uses local state and calls getObservations()
- Settings.tsx uses useSettings() hook and implements all required form fields
- package.json includes recharts dependency
- Charts.tsx imports from recharts and uses ResponsiveContainer
- Settings.tsx calls both setSetting and exportCsv

**Files changed:**
- package.json: Added "recharts": "^2.15.0" to dependencies
- src/components/EntryForm.tsx: Created new component
- src/components/History.tsx: Created new component
- src/components/Charts.tsx: Created new component with Recharts
- src/components/Observations.tsx: Created new component
- src/components/Settings.tsx: Created new component

**Summary:**
All five frontend components have been implemented according to the specifications. The EntryForm component allows adding new entries with all required fields. The History component displays entries in a table with delete functionality. The Charts component visualizes health data using Recharts. The Observations component fetches and displays health observations. The Settings component manages application settings and CSV export functionality. The recharts dependency has been added to package.json.