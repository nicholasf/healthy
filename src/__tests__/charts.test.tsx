import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { WeightChart, BpChart, EnergyChart } from "../components/Charts";
import type { Entry } from "../types";

const makeEntry = (overrides: Partial<Entry> = {}): Entry => ({
  id: 1,
  date: "2026-06-01",
  time: "9:00 AM",
  weightKg: 105.0,
  bpSystolic: 120,
  bpDiastolic: 80,
  energyLevel: 3,
  notes: null,
  createdAt: "2026-06-01T00:00:00",
  ...overrides,
});

describe("WeightChart", () => {
  it("shows empty state when entries array is empty", () => {
    render(<WeightChart entries={[]} />);
    expect(screen.getByText("No weight data to display.")).toBeTruthy();
  });

  it("shows empty state when no entries have weight data", () => {
    render(<WeightChart entries={[makeEntry({ weightKg: null })]} />);
    expect(screen.getByText("No weight data to display.")).toBeTruthy();
  });

  it("renders chart when weight data is present", () => {
    const entries = [
      makeEntry({ id: 1, date: "2026-06-01", weightKg: 105.0 }),
      makeEntry({ id: 2, date: "2026-06-02", weightKg: 104.5 }),
    ];
    const { container } = render(<WeightChart entries={entries} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("filters out entries without weight data", () => {
    const entries = [
      makeEntry({ id: 1, date: "2026-06-01", weightKg: 105.0 }),
      makeEntry({ id: 2, date: "2026-06-02", weightKg: null }),
    ];
    const { container } = render(<WeightChart entries={entries} />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe("BpChart", () => {
  it("shows empty state when entries array is empty", () => {
    render(<BpChart entries={[]} />);
    expect(screen.getByText("No blood pressure data to display.")).toBeTruthy();
  });

  it("shows empty state when no entries have BP data", () => {
    render(<BpChart entries={[makeEntry({ bpSystolic: null, bpDiastolic: null })]} />);
    expect(screen.getByText("No blood pressure data to display.")).toBeTruthy();
  });

  it("renders chart when BP data is present", () => {
    const entries = [
      makeEntry({ id: 1, date: "2026-06-01", bpSystolic: 120, bpDiastolic: 80 }),
      makeEntry({ id: 2, date: "2026-06-02", bpSystolic: 118, bpDiastolic: 78 }),
    ];
    const { container } = render(<BpChart entries={entries} />);
    expect(container.firstChild).toBeTruthy();
  });

  it("includes entry when only systolic is present", () => {
    const entries = [
      makeEntry({ id: 1, date: "2026-06-01", bpSystolic: 120, bpDiastolic: null }),
    ];
    const { container } = render(<BpChart entries={entries} />);
    expect(container.firstChild).toBeTruthy();
  });
});

describe("EnergyChart", () => {
  it("shows empty state when entries array is empty", () => {
    render(<EnergyChart entries={[]} />);
    expect(screen.getByText("No energy level data to display.")).toBeTruthy();
  });

  it("shows empty state when no entries have energy data", () => {
    render(<EnergyChart entries={[makeEntry({ energyLevel: null })]} />);
    expect(screen.getByText("No energy level data to display.")).toBeTruthy();
  });

  it("renders chart when energy data is present", () => {
    const entries = [
      makeEntry({ id: 1, date: "2026-06-01", energyLevel: 3 }),
      makeEntry({ id: 2, date: "2026-06-02", energyLevel: 4 }),
    ];
    const { container } = render(<EnergyChart entries={entries} />);
    expect(container.firstChild).toBeTruthy();
  });
});
