import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Observations from "../components/Observations";

const mockInvoke = vi.hoisted(() => vi.fn());

vi.mock("@tauri-apps/api/core", () => ({
  invoke: mockInvoke,
}));

beforeEach(() => {
  mockInvoke.mockImplementation((cmd: string, args?: Record<string, unknown>) => {
    if (cmd === "get_setting") {
      const vals: Record<string, string> = { api_provider: "anthropic", api_model: "claude-sonnet-4-6" };
      return Promise.resolve(vals[args?.key as string] ?? null);
    }
    if (cmd === "get_observations") return Promise.resolve("Weight is trending down over 30 days.");
    return Promise.resolve(null);
  });
});

describe("Observations", () => {
  it("renders the Get Observations button", () => {
    render(<Observations />);
    expect(screen.getByText("Get Observations")).toBeTruthy();
  });

  it("shows provider and model in log before calling API", async () => {
    render(<Observations />);
    fireEvent.click(screen.getByText("Get Observations"));
    await waitFor(() => {
      expect(screen.getByText(/Provider: anthropic/)).toBeTruthy();
      expect(screen.getByText(/Model: claude-sonnet-4-6/)).toBeTruthy();
    });
  });

  it("displays result text on success", async () => {
    render(<Observations />);
    fireEvent.click(screen.getByText("Get Observations"));
    await waitFor(() => {
      expect(screen.getByText("Done.")).toBeTruthy();
      expect(screen.getByText("Weight is trending down over 30 days.")).toBeTruthy();
    });
  });

  it("shows error message in log on failure", async () => {
    mockInvoke.mockImplementation((cmd: string, args?: Record<string, unknown>) => {
      if (cmd === "get_setting") {
        const vals: Record<string, string> = { api_provider: "anthropic", api_model: "claude-sonnet-4-6" };
        return Promise.resolve(vals[args?.key as string] ?? null);
      }
      if (cmd === "get_observations") return Promise.reject(new Error("CompletionError: token invalid"));
      return Promise.resolve(null);
    });

    render(<Observations />);
    fireEvent.click(screen.getByText("Get Observations"));
    await waitFor(() => {
      expect(screen.getByText(/Error: CompletionError: token invalid/)).toBeTruthy();
    });
  });
});
