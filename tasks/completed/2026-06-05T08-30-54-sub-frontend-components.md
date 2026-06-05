# Sub-task: Frontend Components

**Type:** sub-task
**Parent:** 2026-06-05T08-30-50-programme-build-healthy-app.md
**Created:** 2026-06-05 08:30:50
**Model:** qwen3-coder-30b
**Status:** planned

## ⚠️ Do not run any git commands.

## Goal

Implement all five React components and add recharts to package.json.

## Background

Read `src/types/index.ts`, `src/lib/commands.ts`, `src/hooks/useEntries.ts`, `src/hooks/useSettings.ts` before writing any component.

## Changes

### package.json

Add `"recharts": "^2.15.0"` to `dependencies`. Do not change any other field.

### src/components/EntryForm.tsx

Uses `useEntries()`. Fields: date (text, default today as YYYY-MM-DD), weight_kg (number, step 0.1, optional), bp_systolic (number, optional), bp_diastolic (number, optional), energy_level (range 0–5, optional), notes (textarea, optional). On submit: call `addEntry`, clear form on success, show inline error string on failure.

### src/components/History.tsx

Uses `useEntries()`. HTML table, newest first. Columns: Date, Weight (kg), Systolic, Diastolic, Energy, Notes, Delete. Delete button calls `deleteEntry(entry.id)`. Shows "No entries yet." when empty.

### src/components/Charts.tsx

Uses `useEntries()`. Three stacked Recharts `<LineChart>` components inside `<ResponsiveContainer width="100%">`:
1. Weight (kg) over time
2. Blood pressure — two lines: systolic and diastolic
3. Energy level over time

Sort data by date ASC before charting. Filter out entries where the charted value is null. Show "No data to chart." if entries is empty.

### src/components/Observations.tsx

Local state: `text`, `loading`, `error`. Button "Get Observations" calls `getObservations()` from commands. Shows loading text while in flight. Renders result in a `<pre>`. Shows error inline on failure.

### src/components/Settings.tsx

Uses `useSettings()`. Three fields: API URL (text), API Token (password), Model (text, placeholder "gpt-4o-mini"). Pre-populate from `settings` record. On submit: call `setSetting` for each. Show "Saved." for 2s on success. Export CSV button calls `exportCsv()`, displays returned path.

## Done when

- [ ] All five `.tsx` files have real implementations (not `return null`)
- [ ] `package.json` includes `recharts`
- [ ] `Charts.tsx` uses `ResponsiveContainer` and `LineChart` from recharts

## Results
<!-- Filled in by the executing model after completion -->
**Tests:**
**Files changed:**
**Summary:**
