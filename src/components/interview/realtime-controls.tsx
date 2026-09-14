"use client";

import type { RealtimeConnectionState } from "@/lib/realtime/connection-machine";

type RealtimeControlsProps = Readonly<{
  state: RealtimeConnectionState;
  muted: boolean;
  onMutedChange: (muted: boolean) => void;
  onEnd: () => void;
  onRetry?: () => void;
}>;

function statusMessage(state: RealtimeConnectionState): string {
  if (state.error) return state.error.reason;
  if (state.connection === "ended") return "Interview ended";
  if (state.connection === "recovering") return "Connection interrupted";
  if (state.connection !== "connected") return state.connection;

  switch (state.presentation) {
    case "speaking":
      return "AI is speaking";
    case "thinking":
      return "AI is thinking";
    case "listening":
      return "Listening";
    default:
      return "Connected";
  }
}

export function RealtimeControls({
  state,
  muted,
  onMutedChange,
  onEnd,
  onRetry,
}: RealtimeControlsProps) {
  const microphoneDisabled = state.connection !== "connected";
  const ended = state.connection === "ended";
  const terminalError = state.connection === "error" && state.error?.recoverable === false;
  const canRetry =
    state.connection === "recovering" && state.error?.recoverable === true && onRetry !== undefined;

  return (
    <section aria-label="Realtime interview controls" className="space-y-3">
      <p role={terminalError ? "alert" : "status"} aria-live={terminalError ? "assertive" : "polite"}>
        {statusMessage(state)}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          aria-pressed={muted}
          disabled={microphoneDisabled}
          onClick={() => onMutedChange(!muted)}
        >
          {muted ? "Unmute microphone" : "Mute microphone"}
        </button>

        {canRetry ? (
          <button type="button" onClick={onRetry}>
            Retry connection
          </button>
        ) : null}

        <button type="button" disabled={ended} onClick={onEnd}>
          End interview
        </button>
      </div>
    </section>
  );
}
