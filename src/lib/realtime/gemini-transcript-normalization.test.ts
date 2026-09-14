import { describe, expect, it } from "vitest";

import { createGeminiRealtimeTransportAdapter } from "./gemini-transport";
import type { RealtimeTransportEvent } from "./transport";

type Listener = (event: { data?: string; reason?: string }) => void;

class FakeWebSocket {
  readonly sent: string[] = [];
  private readonly listeners = new Map<string, Listener[]>();

  addEventListener(type: string, listener: Listener) {
    this.listeners.set(type, [...(this.listeners.get(type) ?? []), listener]);
  }

  send(value: string) {
    this.sent.push(value);
  }

  close() {
    this.emit("close", { reason: "client-close" });
  }

  emit(type: string, event: { data?: string; reason?: string } = {}) {
    for (const listener of this.listeners.get(type) ?? []) listener(event);
  }
}

describe("Gemini transcript normalization", () => {
  it("enables transcription and emits provider-neutral candidate/interviewer transcript events", async () => {
    const socket = new FakeWebSocket();
    const events: RealtimeTransportEvent[] = [];
    const adapter = createGeminiRealtimeTransportAdapter({
      createWebSocket: () => socket,
    });

    await adapter.connect(
      { credential: "token", attemptId: "attempt-1" },
      (event) => events.push(event),
    );

    socket.emit("open");
    expect(JSON.parse(socket.sent[0]!)).toMatchObject({
      setup: {
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
    });

    socket.emit("message", {
      data: JSON.stringify({
        serverContent: {
          interimInputTranscription: { text: "I built" },
        },
      }),
    });
    socket.emit("message", {
      data: JSON.stringify({
        serverContent: {
          inputTranscription: { text: "I built the service." },
        },
      }),
    });
    socket.emit("message", {
      data: JSON.stringify({
        serverContent: {
          outputTranscription: { text: "Thanks for" },
        },
      }),
    });
    socket.emit("message", {
      data: JSON.stringify({
        serverContent: {
          outputTranscription: { text: " the example." },
          turnComplete: true,
        },
      }),
    });

    expect(events).toEqual([
      {
        type: "partialTranscript",
        speaker: "candidate",
        text: "I built",
      },
      {
        type: "finalTranscript",
        speaker: "candidate",
        text: "I built the service.",
      },
      {
        type: "partialTranscript",
        speaker: "interviewer",
        text: "Thanks for",
      },
      {
        type: "partialTranscript",
        speaker: "interviewer",
        text: "Thanks for the example.",
      },
      {
        type: "finalTranscript",
        speaker: "interviewer",
        text: "Thanks for the example.",
      },
    ]);
  });

  it("ignores whitespace-only transcript payloads", async () => {
    const socket = new FakeWebSocket();
    const events: RealtimeTransportEvent[] = [];
    const adapter = createGeminiRealtimeTransportAdapter({
      createWebSocket: () => socket,
    });

    await adapter.connect(
      { credential: "token", attemptId: "attempt-1" },
      (event) => events.push(event),
    );

    socket.emit("message", {
      data: JSON.stringify({
        serverContent: {
          interimInputTranscription: { text: "   " },
          inputTranscription: { text: "\n" },
          outputTranscription: { text: "\t" },
          turnComplete: true,
        },
      }),
    });

    expect(events).toEqual([]);
  });
});
