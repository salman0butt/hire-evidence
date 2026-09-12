import { describe, expect, it } from "vitest";

import {
  createInitialRealtimeConnectionState,
  reduceRealtimeConnectionState,
} from "./connection-machine";

describe("RealtimeConnectionMachine", () => {
  it("follows the authorized connection lifecycle and keeps presentation subordinate", () => {
    let state = createInitialRealtimeConnectionState();

    state = reduceRealtimeConnectionState(state, { type: "beginDiagnostics" });
    expect(state).toMatchObject({ connection: "diagnosing", presentation: "idle", generation: 0 });

    state = reduceRealtimeConnectionState(state, { type: "diagnosticsPassed" });
    expect(state.connection).toBe("authorizing");

    state = reduceRealtimeConnectionState(state, { type: "authorizationSucceeded" });
    expect(state).toMatchObject({ connection: "connecting", generation: 1 });

    state = reduceRealtimeConnectionState(state, { type: "transportOpen", generation: 1 });
    expect(state).toMatchObject({ connection: "connected", presentation: "listening" });

    state = reduceRealtimeConnectionState(state, { type: "candidateSpeechEnd", generation: 1 });
    expect(state.presentation).toBe("thinking");

    state = reduceRealtimeConnectionState(state, { type: "modelAudioStarted", generation: 1 });
    expect(state.presentation).toBe("speaking");

    state = reduceRealtimeConnectionState(state, { type: "modelAudioEnded", generation: 1 });
    expect(state.presentation).toBe("listening");
  });

  it("rejects forbidden transitions and terminal authorization failures do not retry blindly", () => {
    const idle = createInitialRealtimeConnectionState();

    expect(
      reduceRealtimeConnectionState(idle, { type: "transportOpen", generation: 0 }),
    ).toEqual(idle);

    const diagnosing = reduceRealtimeConnectionState(idle, { type: "beginDiagnostics" });
    const authorizing = reduceRealtimeConnectionState(diagnosing, { type: "diagnosticsPassed" });
    const failed = reduceRealtimeConnectionState(authorizing, {
      type: "authorizationFailed",
      reason: "Invitation is no longer available.",
    });

    expect(failed).toMatchObject({
      connection: "error",
      presentation: "idle",
      error: { recoverable: false, reason: "Invitation is no longer available." },
    });
    expect(reduceRealtimeConnectionState(failed, { type: "retry" })).toEqual(failed);
  });

  it("enters recovery only for the active generation and ignores stale transport events", () => {
    let state = createInitialRealtimeConnectionState();
    state = reduceRealtimeConnectionState(state, { type: "beginDiagnostics" });
    state = reduceRealtimeConnectionState(state, { type: "diagnosticsPassed" });
    state = reduceRealtimeConnectionState(state, { type: "authorizationSucceeded" });
    state = reduceRealtimeConnectionState(state, { type: "transportOpen", generation: 1 });
    state = reduceRealtimeConnectionState(state, {
      type: "recoverableTransportFailure",
      generation: 1,
      reason: "Connection interrupted.",
    });

    expect(state).toMatchObject({
      connection: "recovering",
      presentation: "idle",
      generation: 1,
      error: { recoverable: true, reason: "Connection interrupted." },
    });

    state = reduceRealtimeConnectionState(state, { type: "retry" });
    expect(state).toMatchObject({ connection: "connecting", generation: 2, error: undefined });

    const afterStaleOpen = reduceRealtimeConnectionState(state, {
      type: "transportOpen",
      generation: 1,
    });
    expect(afterStaleOpen).toEqual(state);

    const connected = reduceRealtimeConnectionState(state, {
      type: "transportOpen",
      generation: 2,
    });
    expect(connected).toMatchObject({ connection: "connected", presentation: "listening" });
  });

  it("ends deterministically and ignores later provider activity", () => {
    let state = createInitialRealtimeConnectionState();
    state = reduceRealtimeConnectionState(state, { type: "beginDiagnostics" });
    state = reduceRealtimeConnectionState(state, { type: "diagnosticsPassed" });
    state = reduceRealtimeConnectionState(state, { type: "authorizationSucceeded" });
    state = reduceRealtimeConnectionState(state, { type: "transportOpen", generation: 1 });

    const ended = reduceRealtimeConnectionState(state, { type: "end" });
    expect(ended).toMatchObject({ connection: "ended", presentation: "idle" });

    expect(
      reduceRealtimeConnectionState(ended, { type: "modelAudioStarted", generation: 1 }),
    ).toEqual(ended);
    expect(reduceRealtimeConnectionState(ended, { type: "retry" })).toEqual(ended);
  });
});
