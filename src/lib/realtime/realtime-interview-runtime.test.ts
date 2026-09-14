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

describe("production realtime interview runtime", () => {
  it("waits for provider readiness before starting microphone capture and routes audio both ways", async () => {
    let onTransportEvent: ((event: RealtimeTransportEvent) => void) | undefined;
    let onCaptureChunk:
      | ((pcm: Float32Array, sampleRate: number) => void)
      | undefined;

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
      createCapture: (handler) => {
        onCaptureChunk = handler;
        return capture;
      },
      playback,
    });

    const startPromise = runtime.start();

    expect(transport.connect).toHaveBeenCalledWith({
      credential: "ephemeral-provider-token",
      attemptId: "attempt-1",
    });
    expect(capture.start).not.toHaveBeenCalled();

    onTransportEvent?.({ type: "open" });
    await startPromise;

    expect(capture.start).toHaveBeenCalledTimes(1);

    const inputPcm = new Float32Array([0.25, -0.25]);
    onCaptureChunk?.(inputPcm, 48000);
    expect(transport.sendAudio).toHaveBeenCalledWith(inputPcm, 48000);

    const outputPcm = new Float32Array([0.1, 0.2]);
    onTransportEvent?.({ type: "audio", pcm: outputPcm, sampleRate: 24000 });
    expect(playback.enqueue).toHaveBeenCalledWith(outputPcm, 24000);
  });

  it("persists explicit app-owned question completion before advancing the interview", async () => {
    const persistProgress = vi.fn().mockResolvedValue({ status: "completed" as const });
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
      createTransport: () => transport,
      createCapture: () => capture,
      playback,
      persistProgress,
    });

    await runtime.completeCurrentQuestion("turn-1");

    expect(persistProgress).toHaveBeenCalledWith({
      eventId: "turn-1",
      questionId: "question-1",
    });
    expect(runtime.getSnapshot()).toMatchObject({
      status: "completed",
      currentQuestion: null,
    });
  });

  it("stops capture, transport, and playback idempotently", async () => {
    let onTransportEvent: ((event: RealtimeTransportEvent) => void) | undefined;
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
    });

    const startPromise = runtime.start();
    onTransportEvent?.({ type: "open" });
    await startPromise;

    await runtime.stop();
    await runtime.stop();

    expect(capture.stop).toHaveBeenCalledTimes(1);
    expect(transport.disconnect).toHaveBeenCalledTimes(1);
    expect(playback.stop).toHaveBeenCalledTimes(1);
  });
});