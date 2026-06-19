import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Settings from "../components/Settings";

const mockInvoke = vi.hoisted(() => vi.fn());

vi.mock("@tauri-apps/api/core", () => ({
  invoke: mockInvoke,
}));

const defaultSettings: Record<string, string | null> = {
  api_provider: "openai",
  api_url: "http://localhost:11434/v1",
  api_token: "",
  api_model: "gpt-4o-mini",
};

beforeEach(() => {
  mockInvoke.mockImplementation((cmd: string, args?: Record<string, unknown>) => {
    if (cmd === "get_setting") return Promise.resolve(defaultSettings[args?.key as string] ?? null);
    if (cmd === "set_setting") return Promise.resolve();
    return Promise.resolve(null);
  });
});

describe("Settings", () => {
  it("renders provider toggle buttons", async () => {
    render(<Settings />);
    await waitFor(() => {
      expect(screen.getByText("Anthropic")).toBeTruthy();
      expect(screen.getByText("OpenAI-compatible")).toBeTruthy();
    });
  });

  it("shows API URL field when OpenAI-compatible is selected", async () => {
    render(<Settings />);
    await waitFor(() => expect(screen.getByLabelText("API URL")).toBeTruthy());
  });

  it("hides API URL field when Anthropic is selected", async () => {
    render(<Settings />);
    await waitFor(() => screen.getByText("Anthropic"));
    fireEvent.click(screen.getByText("Anthropic"));
    expect(screen.queryByLabelText("API URL")).toBeNull();
  });

  it("shows model dropdown populated from models.json", async () => {
    render(<Settings />);
    await waitFor(() => {
      const select = screen.getByLabelText("Model") as HTMLSelectElement;
      expect(select.options.length).toBeGreaterThan(0);
      const values = Array.from(select.options).map((o) => o.value);
      expect(values).toContain("claude-sonnet-4-6");
    });
  });

  it("saves all settings on submit", async () => {
    render(<Settings />);
    await waitFor(() => screen.getByText("Save Settings"));
    fireEvent.click(screen.getByText("Save Settings"));
    await waitFor(() => {
      const setCalls = mockInvoke.mock.calls.filter(([cmd]) => cmd === "set_setting");
      const keys = setCalls.map(([, args]) => (args as Record<string, string>).key);
      expect(keys).toContain("api_provider");
      expect(keys).toContain("api_token");
      expect(keys).toContain("api_model");
    });
  });
});
