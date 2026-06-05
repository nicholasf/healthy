import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Charts from "../components/Charts";
import type { Entry } from "../types";

// Mock useEntries so Charts renders without a Tauri backend
vi.mock("../hooks/useEntries", () => ({
  useEntries: vi.fn(),
}));

import { useEntries } from "../hooks/useEntries";

const mockUseEntries = vi.mocked(useEntries);

const makeEntry = (overrides: Partial<Entry> = {}): Entry => ({
  id: 1,
  date: "2026-06-01",
  time: "9:00 AM",
  weightKg: 72.0,
  bpSystolic: 120,
  bpDiastolic: 80,
  energyLevel: 3,
  notes: null,
  createdAt: "2026-06-01T00:00:00",
  ...overrides,
});

describe("Charts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows empty state when there are no entries", () => {
    mockUseEntries.mockReturnValue({
      entries: [],
      loading: false,
      addEntry: vi.fn(),
      deleteEntry: vi.fn(),
      refresh: vi.fn(),
    });
    render(<Charts />);
    expect(screen.getByText("No data to chart.")).toBeTruthy();
  });

  it("renders without crashing when entries are present", () => {
    mockUseEntries.mockReturnValue({
      entries: [makeEntry(), makeEntry({ id: 2, date: "2026-06-02", weightKg: 71.5 })],
      loading: false,
      addEntry: vi.fn(),
      deleteEntry: vi.fn(),
      refresh: vi.fn(),
    });
    const { container } = render(<Charts />);
    expect(container.firstChild).toBeTruthy();
  });
});
