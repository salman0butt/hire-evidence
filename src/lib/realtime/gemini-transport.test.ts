import { describe, expect, it } from "vitest";

import { createGeminiRealtimeTransportAdapter } from "./gemini-transport";
import type { RealtimeTransportEvent } from "./transport";

type Listener = (event: { data?: string; reason?: string }) => void;

type WebSocketFactory = (url: string) => FakeWebSocket;

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
    for (const listener of this.listeners.get(type) ?? []) {
      listener(event);
    }
  }
}

function base64FromInt16(values: number[]): string {
  const bytes = new Uint8Array(values.length * 2);
  const view = new DataView(bytes.buffer);
  values.forEach((value, index) => view.setInt16(index * 2, value, true));
  return Buffer.from(bytes).toString("base64");
}

describe("Gemini Live realtime transport adapter", () => {
  it("uses the constrained Live endpoint, waits for setup, sends PCM, and normalizes server events", async () => {
    const socket = new FakeWebSocket();
    let openedUrl = "";
    const events: RealtimeTransportEvent[] = [];

    const createWebSocket: WebSocketFactory = (url: string) => {
      openedUrl = url;
      return socket;
    };

    const adapter = createGeminiRealtimeTransportAdapter({ createWebSocket });

    await adapter.connect(
      { credential: "auth_tokens/token/with spaces", attemptId: "attempt-1" },
      (event: RealtimeTransportEvent) => events.push(event),
    );

    expect(openedUrl).toBe(
      "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained?access_token=auth_tokens%2Ftoken%2Fwith%20spaces",
    );

    socket.emit("open");
    expect(socket.sent).toHaveLength(1);
    expect(JSON.parse(socket.sent[0]!)).toEqual({
      setup: {
        model: "models/gemini-3.1-flash-live-preview",
        generationConfig: {
          responseModalities: ["AUDIO"],
        },
        inputAudioTranscription: {},
        outputAudioTranscription: {},
        sessionResumption: {},
      },
    });
    expect(events).toEqual([]);

    socket.emit("message", { data: JSON.stringify({ setupComplete: {} }) });
    expect(events).toEqual([{ type: "open" }]);

    adapter.sendAudio(new Float32Array([-1, 0, 0.5, 1]), 48000);
    expect(JSON.parse(socket.sent[1]!)).toEqual({
      realtimeInput: {
        audio: {
          data: base64FromInt16([-32768, 0, 16384, 32767]),
          mimeType: "audio/pcm;rate=48000",
        },
      },
    });

    socket.emit("message", {
      data: JSON.stringify({
        serverContent: {
          modelTurn: {
            parts: [
              { text: "Thanks for that example." },
              {
                inlineData: {
                  mimeType: "audio/pcm;rate=24000",
                  data: base64FromInt16([-32768, 0, 32767]),
                },
              },
            ],
          },
        },
      }),
    });

    expect(events[1]).toEqual({
      type: "modelTurn",
      text: "Thanks for that example.",
    });
    expect(events[2]?.type).toBe("audio");
    if (events[2]?.type === "audio") {
      expect(events[2].sampleRate).toBe(24000);
      expect(Array.from(events[2].pcm)).toEqual([-1, 0, 32767 / 32768]);
    }

    socket.emit("message", {
      data: JSON.stringify({ serverContent: { interrupted: true } }),
    });
    expect(events.at(-1)).toEqual({ type: "interrupted" });
  });
});