# Sub-task: Frontend — Multi-reading UI

**Type:** sub-task
**Parent:** 2026-06-05T09-22-13-programme-multi-reading.md
**Created:** 2026-06-05 09:22:13
**Model:** qwen3-coder-30b
**Status:** planned

## ⚠️ Do not run any git commands.

## Goal

Update TypeScript types, command wrappers, hooks, and components for the new `time` field and auto-inherit behaviour.

## Background

Depends on rust-multi-reading being complete. Read before starting:
- `src/types/index.ts`
- `src/lib/commands.ts`
- `src/hooks/useEntries.ts`
- `src/components/EntryForm.tsx`
- `src/components/History.tsx`
- `src/components/Charts.tsx`

## Changes

### src/types/index.ts

Add `time: string` to `Entry` between `date` and `weightKg`.

### src/lib/commands.ts

Update `addEntry` to add `time: string` as the second parameter (after `date`, before `weightKg`). Pass it to `invoke` as `{ date, time, weightKg, ... }`.

### src/hooks/useEntries.ts

Update `addNewEntry` to add `time: string` as the second parameter. Pass it through to `addEntry`.

### src/components/EntryForm.tsx

**Time field:** Add a `time` state field. Use `<input type="time">` (which is HH:MM in 24-hour). Default to the current local time. Before submitting, convert from 24-hour HH:MM to 12-hour format for storage. After submission, reset the time field to the current time.

Conversion (include as local functions):
- `to12Hour(time24: string): string` — splits on ':', treats hour ≥ 12 as PM (hour 12 stays 12, others subtract 12 for PM; hour 0 becomes 12 AM), zero-pads minutes. Result format: `"9:30 AM"` or `"2:05 PM"`.
- `to24Hour(time12: string): string` — reverse of above, used only if you need to convert back for the input value.

**Auto-inherit:** On mount (inside `useEffect`), after `entries` loads, if `entries.length > 0`, take `entries[0]` (most recent, since `get_entries` returns newest first) and pre-fill `weightKg` and `bpSystolic`/`bpDiastolic` state with its values if they are non-null. Do not pre-fill `energyLevel` or `notes`.

Add time to the form submission call.

### src/components/History.tsx

Add a `Time` column after `Date` in the table header and render `entry.time` in each row.

### src/components/Charts.tsx

Use `entry.date + ' ' + entry.time` as the `date` key passed into each chart's data array (rename the key to `datetime` in chart data). Update XAxis `dataKey` to `"datetime"`.

## Done when

- [ ] `pnpm exec tsc --noEmit` exits 0 (run from project root)
- [ ] `EntryForm.tsx` contains `to12Hour` function
- [ ] `EntryForm.tsx` contains `useEffect` that pre-fills weight and BP from last entry

## Results
<!-- Filled in by the executing model after completion -->
**Tests:**
**Files changed:**
**Summary:**
