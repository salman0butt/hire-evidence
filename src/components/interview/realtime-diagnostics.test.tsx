import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import {
  RealtimeDiagnostics,
  RealtimeReadinessCheck,
} from "./realtime-diagnostics";

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

describe("RealtimeReadinessCheck", () => {
  it("does not request microphone access until the candidate explicitly starts the check", async () => {
    const runCheck = vi.fn().mockResolvedValue({ status: "ready" as const });

    render(<RealtimeReadinessCheck runCheck={runCheck} />);

    expect(runCheck).not.toHaveBeenCalled();
    const runButton = screen.getByRole("button", { name: /run microphone check/i });
    runButton.focus();
    expect(runButton).toHaveFocus();
    fireEvent.click(runButton);

    expect(await screen.findByRole("status")).toHaveTextContent(/ready for the microphone check/i);
    expect(runCheck).toHaveBeenCalledTimes(1);
  });

  it("keeps a recoverable failure retryable without starting an interview", async () => {
    const runCheck = vi
      .fn()
      .mockResolvedValueOnce({
        status: "blocked" as const,
        reason: "microphone-permission-denied" as const,
        recoverable: true,
      })
      .mockResolvedValueOnce({ status: "ready" as const });

    render(<RealtimeReadinessCheck runCheck={runCheck} />);

    fireEvent.click(screen.getByRole("button", { name: /run microphone check/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/microphone access is blocked/i);

    fireEvent.click(screen.getByRole("button", { name: /retry microphone check/i }));
    expect(await screen.findByRole("status")).toHaveTextContent(/ready for the microphone check/i);
    expect(runCheck).toHaveBeenCalledTimes(2);
  });

  it("lets the candidate choose an enumerated microphone and explicitly checks its usable input signal", async () => {
    const runCheck = vi.fn().mockResolvedValue({ status: "ready" as const });
    const listInputs = vi.fn().mockResolvedValue([
      { deviceId: "mic-1", label: "Built-in microphone" },
      { deviceId: "mic-2", label: "USB microphone" },
    ]);
    const runInputLevelCheck = vi.fn().mockResolvedValue({ status: "ready" as const });

    render(
      <RealtimeReadinessCheck
        runCheck={runCheck}
        listInputs={listInputs}
        runInputLevelCheck={runInputLevelCheck}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /run microphone check/i }));

    const microphoneSelect = await screen.findByRole("combobox", { name: /microphone/i });
    expect(listInputs).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("option", { name: "Built-in microphone" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "USB microphone" })).toBeInTheDocument();
    expect(runCheck).toHaveBeenCalledTimes(1);
    expect(runInputLevelCheck).not.toHaveBeenCalled();

    fireEvent.change(microphoneSelect, { target: { value: "mic-2" } });
    expect(runCheck).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole("button", { name: /check selected microphone/i }));

    expect(await screen.findByRole("status", { name: /microphone input/i })).toHaveTextContent(
      /microphone input detected/i,
    );
    expect(runInputLevelCheck).toHaveBeenCalledTimes(1);
    expect(runInputLevelCheck).toHaveBeenLastCalledWith("mic-2");
    expect(runCheck).toHaveBeenCalledTimes(1);
  });

  it("keeps a silent selected microphone recoverable and retries the level check", async () => {
    const runCheck = vi.fn().mockResolvedValue({ status: "ready" as const });
    const listInputs = vi
      .fn()
      .mockResolvedValue([{ deviceId: "mic-1", label: "Built-in microphone" }]);
    const runInputLevelCheck = vi
      .fn()
      .mockResolvedValueOnce({
        status: "blocked" as const,
        reason: "microphone-input-silent" as const,
        recoverable: true,
      })
      .mockResolvedValueOnce({ status: "ready" as const });

    render(
      <RealtimeReadinessCheck
        runCheck={runCheck}
        listInputs={listInputs}
        runInputLevelCheck={runInputLevelCheck}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /run microphone check/i }));
    await screen.findByRole("combobox", { name: /microphone/i });

    fireEvent.click(screen.getByRole("button", { name: /check selected microphone/i }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/no usable input was detected/i);

    fireEvent.click(screen.getByRole("button", { name: /retry microphone check/i }));
    expect(await screen.findByRole("status", { name: /microphone input/i })).toHaveTextContent(
      /microphone input detected/i,
    );
    expect(runInputLevelCheck).toHaveBeenCalledTimes(2);
    expect(runInputLevelCheck).toHaveBeenLastCalledWith("mic-1");
  });
});
