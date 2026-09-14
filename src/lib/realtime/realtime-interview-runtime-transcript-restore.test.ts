import { describe, expect, it, vi } from "vitest";

import type { RealtimeAudioCapture } from "./audio-capture";
import type { RealtimeAudioPlayback } from "./audio-playback";
import { createRealtimeInterviewRuntime } from "./realtime-interview-runtime";
import type { RealtimeSessionAuthorization } from "./session-authorization";
import type { RealtimeTransport } from "./transport";

describe("realtime interview runtime transcript restoration", () => {
  it("hydrates finalized reconnect turns into the initial snapshot without partials", () => {
    const authorization: Extract<RealtimeSessionAuthorization, { status: "authorized" }> = {
      status: "authorized",
      attemptId: "attempt-1",
      interviewerVersionId: "version-1",
      durationSeconds: 1800,
      language: "en",
      interviewPlan: {
        versionId: "version-1",
        sections: [{
          id: "section-1",
          title: "Technical depth",
          questions: [{
            id: "question-1",
            prompt: "Describe a production incident.",
            required: true,
            followUpLimit: 1,
          }],
        }],
      },
      providerCredential: {
        credential: "ephemeral-credential",
        expiresAt: "2026-09-15T00:00:00.000Z",
      },
      transcriptTurns: [
        {
          id: "message-1",
          eventId: "event-1",
          sequence: 1,
          speaker: "interviewer",
          text: "Describe a production incident.",
          startedAt: null,
          endedAt: null,
          finalizedAt: "2026-09-14T19:00:00.000Z",
        },
        {
          id: "message-2",
          eventId: "event-2",
          sequence: 2,
          speaker: "candidate",
          text: "I restored service by rolling back the deploy.",
          startedAt: null,
          endedAt: null,
          finalizedAt: "2026-09-14T19:00:05.000Z",
        },
      ],
    };
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
    });

    expect(runtime.getSnapshot().transcript).toEqual({
      partials: { candidate: "", interviewer: "" },
      finalizedTurns: [
        { speaker: "interviewer", text: "Describe a production incident." },
        { speaker: "candidate", text: "I restored service by rolling back the deploy." },
      ],
    });
  });
});
