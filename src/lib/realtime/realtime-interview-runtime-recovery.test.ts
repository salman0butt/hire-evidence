import { describe, expect, it, vi } from "vitest";

import type { RealtimeAudioCapture } from "./audio-capture";
import type { RealtimeAudioPlayback } from "./audio-playback";
import { createRealtimeInterviewRuntime } from "./realtime-interview-runtime";
import type { RealtimeSessionAuthorization } from "./session-authorization";
import type {
  RealtimeTransport,
  RealtimeTransportEvent,
} from "./transport";

const authorization: Extract<
  RealtimeSessionAuthorization,
  { status: "authorized" }
> = {
  status: "authorized",
  attemptId: "attempt-1",
  interviewerVersionId: "version-1",
  durationSeconds: 1800,
  language: "en",
  interviewPlan: {
    versionId: "version-1",
    sections: [
      {
        id: "section-1",
        title: "Experience",
        questions: [
          {
            id: "question-1",
            prompt: "Describe a relevant project.",
            required: true,
            followUpLimit: 1,
          },
        ],
      },
    ],
  },
  providerCredential: {
    credential: "ephemeral-provider-token",
    expiresAt: "2026-09-14T12:00:00.000Z",
  },
};

function runtimeHarness() {
  let onTransportEvent: ((event: RealtimeTransportEvent) => void) | undefined;
  const onRecoverableFailure = vi.fn();
  const transport: RealtimeTransport = {
    connect: vi.fn(async () => undefined),
    sendAudio: vi.fn(),
    disconnect: vi.fn(async () => undefined),
  };
  const capture: RealtimeAudioCapture = {
    start: vi.fn(async () => undefined),
    setMuted: vi.fn(),
    stop: vi.fn(async () => undefined),
  };
  const playback: RealtimeAudioPlayback = {
    enqueue: vi.fn(),
    interrupt: vi.fn(),
    stop: vi.fn(async () => undefined),
  };

  const runtime = createRealtimeInterviewRuntime({
    authorization,
    createTransport: (handler) => {
      onTransportEvent = handler;
      return transport;
    },
    createCapture: () => capture,
    playback,
    onRecoverableFailure,
  });

  return {
    runtime,
    onRecoverableFailure,
    emit(event: RealtimeTransportEvent) {
      onTransportEvent?.(event);
    },
  };
}

describe("production realtime runtime recovery signal", () => {
  it("reports a normalized provider failure after connection so the launcher can reauthorize the same attempt", async () => {
    const { runtime, onRecoverableFailure, emit } = runtimeHarness();
    const startPromise = runtime.start();
    emit({ type: "open" });
    await startPromise;

    emit({
      type: "recoverableError",
      error: {
        code: "provider-transport-error",
        message: "Realtime provider connection failed.",
      },
    });

    expect(onRecoverableFailure).toHaveBeenCalledTimes(1);
    expect(onRecoverableFailure).toHaveBeenCalledWith({
      kind: "provider-error",
    });
  });

  it("reports an unexpected provider close after connection so the launcher can reconnect the same attempt", async () => {
    const { runtime, onRecoverableFailure, emit } = runtimeHarness();
    const startPromise = runtime.start();
    emit({ type: "open" });
    await startPromise;

    emit({ type: "close", reason: "network-lost" });

    expect(onRecoverableFailure).toHaveBeenCalledTimes(1);
    expect(onRecoverableFailure).toHaveBeenCalledWith({
      kind: "provider-error",
    });
  });
});
