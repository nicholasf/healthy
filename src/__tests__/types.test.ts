import { describe, it, expect } from "vitest";
import type { Entry, Setting } from "../types";

describe("Entry type", () => {
  it("accepts a fully populated entry", () => {
    const entry: Entry = {
      id: 1,
      date: "2026-06-05",
      time: "9:00 AM",
      weightKg: 72.5,
      bpSystolic: 120,
      bpDiastolic: 80,
      energyLevel: 4,
      notes: "Felt good",
      createdAt: "2026-06-05T00:00:00",
    };
    expect(entry.date).toBe("2026-06-05");
    expect(entry.weightKg).toBe(72.5);
    expect(entry.energyLevel).toBe(4);
  });

  it("accepts an entry with all optional fields null", () => {
    const entry: Entry = {
      id: 2,
      date: "2026-06-04",
      time: "2:30 PM",
      weightKg: null,
      bpSystolic: null,
      bpDiastolic: null,
      energyLevel: null,
      notes: null,
      createdAt: "2026-06-04T00:00:00",
    };
    expect(entry.weightKg).toBeNull();
    expect(entry.energyLevel).toBeNull();
  });
});

describe("Setting type", () => {
  it("accepts a key-value pair", () => {
    const setting: Setting = { key: "api_url", value: "http://pond:9337" };
    expect(setting.key).toBe("api_url");
    expect(setting.value).toBe("http://pond:9337");
  });
});
