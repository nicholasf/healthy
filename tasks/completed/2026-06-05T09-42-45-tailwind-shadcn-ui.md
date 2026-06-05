# Restyle app with Tailwind + shadcn/ui

**Created:** 2026-06-05 09:42:45
**Model:** qwen3-coder-30b — mechanical component restyle
**Status:** planned

## ⚠️ Do not run any git commands.

## Goal

Replace all custom CSS classes in the React components and App shell with Tailwind utility classes and shadcn/ui primitives. The design system is already installed — just use it.

## Background

Read these files before starting:
- `src/App.tsx`
- `src/App.css` (contains Tailwind + shadcn CSS vars — do not modify this file)
- `src/components/EntryForm.tsx`
- `src/components/History.tsx`
- `src/components/Observations.tsx`
- `src/components/Settings.tsx`

Available shadcn components (import from `@/components/ui/<name>`):
- `Button` from `@/components/ui/button`
- `Card`, `CardHeader`, `CardTitle`, `CardContent` from `@/components/ui/card`
- `Input` from `@/components/ui/input`
- `Label` from `@/components/ui/label`
- `Textarea` from `@/components/ui/textarea`
- `Badge` from `@/components/ui/badge`
- `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell` from `@/components/ui/table`
- `Separator` from `@/components/ui/separator`

`cn` utility: `import { cn } from "@/lib/utils"` — use for conditional class merging.

Lucide icons are available: `import { ... } from "lucide-react"`. Use sparingly for nav items.

## Changes

### src/App.tsx

Replace the custom tab bar with a vertical sidebar nav using Tailwind. Layout: full-height flex row. Left side: `main-content` takes `flex-1 overflow-y-auto p-6`. Right side: a sidebar `<nav>` that is `w-44 border-l flex flex-col gap-1 p-3 bg-card`.

Each nav button: use shadcn `Button` with `variant="ghost"` for inactive, `variant="secondary"` for active. Full width (`w-full`), left-aligned text (`justify-start`). Remove the old `.tab-bar`, `.tab-button`, `.app-container`, `.main-content` class names entirely.

Add a small app title or logo at the top of the sidebar — just `<p className="text-sm font-semibold text-muted-foreground px-2 py-2">healthy</p>`.

### src/components/EntryForm.tsx

Wrap the whole form in a `<Card>` with `<CardHeader><CardTitle>New Entry</CardTitle></CardHeader><CardContent>`. 

Use `<Label>` and `<Input>` for date and numeric fields. Use `<Textarea>` for notes. Replace the energy level `<input type="range">` with a row of 6 `<Button variant="outline">` buttons (0–5); the selected value gets `variant="default"`. Replace the submit `<button>` with `<Button type="submit">`. Show errors in a `<p className="text-sm text-destructive">`.

### src/components/History.tsx

Use the shadcn `Table` components: `<Table><TableHeader><TableRow>...<TableHead>`  and `<TableBody><TableRow><TableCell>`. Delete button: `<Button variant="destructive" size="sm">Delete</Button>`. Wrap in a `<Card><CardHeader><CardTitle>History</CardTitle></CardHeader><CardContent>`.

### src/components/Observations.tsx

Wrap in `<Card><CardHeader><CardTitle>Observations</CardTitle></CardHeader><CardContent>`. Replace the button with `<Button>`. Show the result in a `<div className="mt-4 rounded-md bg-muted p-4 text-sm whitespace-pre-wrap">`. Show errors as `<p className="text-sm text-destructive">`.

### src/components/Settings.tsx

Wrap in `<Card><CardHeader><CardTitle>Settings</CardTitle></CardHeader><CardContent>`. Use `<Label>` and `<Input>` for API URL and Model. Use `<Input type="password">` for API Token. Submit: `<Button type="submit">Save</Button>`. Show "Saved." as `<p className="text-sm text-green-600">`. Use `<Separator className="my-4" />` between the settings form and the export section. Export button: `<Button variant="outline">Export CSV</Button>`.

## Done when

- [ ] `pnpm exec tsc --noEmit` exits 0 (run from project root `/home/nicholasf/code/github/nicholasf/healthy`)
- [ ] No component file imports from `../hooks/useEntries` or similar using raw `<button>`, `<input>`, `<label>`, or `<textarea>` HTML elements directly (they should all use shadcn equivalents)
- [ ] `src/App.tsx` imports `Button` from `@/components/ui/button`

## Results
<!-- Filled in by the executing model after completion -->
**Tests:**
**Files changed:**
**Summary:**
