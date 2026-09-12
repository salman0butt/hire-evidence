import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RealtimeDiagnostics } from "./realtime-diagnostics";

describe("RealtimeDiagnostics", () => {
  it("announces when the browser is ready without exposing a retry action", () => {
    render(<RealtimeDiagnostics result={{ status: "ready" }} />);

    expect(screen.getByRole("status")).toHaveTextContent(/ready for the microphone check/i);
    expect(screen.queryByRole("button", { name: /retry/i })).not.toBeInTheDocument();
  });

  it("renders actionable recoverable microphone guidance and retries explicitly", () => {
    const onRetry = vi.fn();

    render(
      <RealtimeDiagnostics
        result={{
          status: "blocked",
          reason: "microphone-permission-denied",
          recoverable: true,
        }}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/microphone access/i);
    expect(screen.getByRole("alert")).toHaveTextContent(/browser settings/i);

    fireEvent.click(screen.getByRole("button", { name: /retry microphone check/i }));
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not offer a retry for an unsupported browser capability", () => {
    render(
      <RealtimeDiagnostics
        result={{
          status: "blocked",
          reason: "audio-worklet-unavailable",
          recoverable: false,
        }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/supported modern browser/i);
    expect(screen.queryByRole("button", { name: /retry/i })).not.toBeInTheDocument();
  });
});
