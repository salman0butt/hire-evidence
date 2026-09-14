import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { RealtimeConnectionState } from "@/lib/realtime/connection-machine";
import { RealtimeControls } from "./realtime-controls";

function state(
  overrides: Partial<RealtimeConnectionState> = {},
): RealtimeConnectionState {
  return {
    connection: "connected",
    presentation: "listening",
    generation: 1,
    error: undefined,
    ...overrides,
  };
}

describe("RealtimeControls", () => {
  it("announces connected presentation state and exposes keyboard-operable mute/end controls", () => {
    const onMutedChange = vi.fn();
    const onEnd = vi.fn();

    render(
      <RealtimeControls
        state={state()}
        muted={false}
        onMutedChange={onMutedChange}
        onEnd={onEnd}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(/listening/i);

    const mute = screen.getByRole("button", { name: /mute microphone/i });
    expect(mute).toHaveAttribute("aria-pressed", "false");
    expect(mute).toBeEnabled();
    mute.focus();
    expect(mute).toHaveFocus();
    fireEvent.click(mute);
    expect(onMutedChange).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole("button", { name: /end interview/i }));
    expect(onEnd).toHaveBeenCalledTimes(1);
  });

  it("reflects muted and speaking presentation state without changing connection authority", () => {
    render(
      <RealtimeControls
        state={state({ presentation: "speaking" })}
        muted
        onMutedChange={vi.fn()}
        onEnd={vi.fn()}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(/ai is speaking/i);
    expect(screen.getByRole("button", { name: /unmute microphone/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("disables microphone control during recovery and offers explicit retry only for recoverable state", () => {
    const onRetry = vi.fn();

    render(
      <RealtimeControls
        state={state({
          connection: "recovering",
          presentation: "idle",
          error: { recoverable: true, reason: "Connection interrupted." },
        })}
        muted={false}
        onMutedChange={vi.fn()}
        onEnd={vi.fn()}
        onRetry={onRetry}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(/connection interrupted/i);
    expect(screen.getByRole("button", { name: /mute microphone/i })).toBeDisabled();

    const retry = screen.getByRole("button", { name: /retry connection/i });
    expect(retry).toBeEnabled();
    fireEvent.click(retry);
    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("does not expose retry for terminal authorization errors and disables ended controls", () => {
    const { rerender } = render(
      <RealtimeControls
        state={state({
          connection: "error",
          presentation: "idle",
          error: { recoverable: false, reason: "Invitation is no longer available." },
        })}
        muted={false}
        onMutedChange={vi.fn()}
        onEnd={vi.fn()}
        onRetry={vi.fn()}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(/invitation is no longer available/i);
    expect(screen.queryByRole("button", { name: /retry/i })).not.toBeInTheDocument();

    rerender(
      <RealtimeControls
        state={state({ connection: "ended", presentation: "idle" })}
        muted={false}
        onMutedChange={vi.fn()}
        onEnd={vi.fn()}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(/interview ended/i);
    expect(screen.getByRole("button", { name: /mute microphone/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /end interview/i })).toBeDisabled();
  });
});
