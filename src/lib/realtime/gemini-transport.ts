import { GEMINI_LIVE_MODEL } from "./gemini-provider-token";
import type {
  RealtimeTransportAdapter,
  RealtimeTransportConnectInput,
  RealtimeTransportEvent,
} from "./transport";

const GEMINI_LIVE_ENDPOINT =
  "wss://generativelanguage.googleapis.com/ws/google.ai.generativelanguage.v1beta.GenerativeService.BidiGenerateContentConstrained";

type SocketEvent = Readonly<{
  data?: string | undefined;
  reason?: string | undefined;
}>;

type GeminiWebSocket = Readonly<{
  addEventListener: (
    type: "open" | "message" | "error" | "close",
    listener: (event: SocketEvent) => void,
  ) => void;
  send: (value: string) => void;
  close: () => void;
}>;

type GeminiRealtimeTransportOptions = Readonly<{
  createWebSocket?: (url: string) => GeminiWebSocket;
  model?: string;
}>;

type GeminiServerMessage = Readonly<{
  setupComplete?: unknown;
  serverContent?: Readonly<{
    interrupted?: boolean;
    modelTurn?: Readonly<{
      parts?: ReadonlyArray<
        Readonly<{
          text?: unknown;
          inlineData?: Readonly<{
            mimeType?: unknown;
            data?: unknown;
          }>;
        }>
      >;
    }>;
  }>;
}>;

function browserWebSocket(url: string): GeminiWebSocket {
  return new WebSocket(url) as unknown as GeminiWebSocket;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary);
}

function base64ToBytes(value: string): Uint8Array {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index);
  }
  return bytes;
}

function floatPcmToBase64(pcm: Float32Array): string {
  const bytes = new Uint8Array(pcm.length * 2);
  const view = new DataView(bytes.buffer);

  pcm.forEach((sample, index) => {
    const clamped = Math.max(-1, Math.min(1, sample));
    const int16 = Math.round(clamped < 0 ? clamped * 32768 : clamped * 32767);
    view.setInt16(index * 2, int16, true);
  });

  return bytesToBase64(bytes);
}

function base64ToFloatPcm(value: string): Float32Array {
  const bytes = base64ToBytes(value);
  if (bytes.byteLength % 2 !== 0) {
    throw new Error("Gemini returned malformed PCM audio");
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const pcm = new Float32Array(bytes.byteLength / 2);
  for (let index = 0; index < pcm.length; index += 1) {
    pcm[index] = view.getInt16(index * 2, true) / 32768;
  }
  return pcm;
}

function parseSampleRate(mimeType: string): number | undefined {
  const match = /(?:^|;)\s*rate=(\d+)(?:;|$)/i.exec(mimeType);
  if (!match) return undefined;
  const value = Number(match[1]);
  return Number.isFinite(value) && value > 0 ? value : undefined;
}

function normalizeModel(model: string): string {
  const trimmed = model.trim();
  return trimmed.startsWith("models/") ? trimmed : `models/${trimmed}`;
}

export function createGeminiRealtimeTransportAdapter(
  options: GeminiRealtimeTransportOptions = {},
): RealtimeTransportAdapter {
  const createWebSocket = options.createWebSocket ?? browserWebSocket;
  const model = normalizeModel(options.model ?? GEMINI_LIVE_MODEL);
  let socket: GeminiWebSocket | undefined;
  let onEvent: ((event: RealtimeTransportEvent) => void) | undefined;
  let setupComplete = false;

  function emitServerMessage(message: GeminiServerMessage) {
    if (message.setupComplete !== undefined && !setupComplete) {
      setupComplete = true;
      onEvent?.({ type: "open" });
    }

    const content = message.serverContent;
    if (!content) return;

    if (content.interrupted) {
      onEvent?.({ type: "interrupted" });
    }

    const parts = content.modelTurn?.parts ?? [];
    const text = parts
      .map((part) => (typeof part.text === "string" ? part.text : ""))
      .join("")
      .trim();
    if (text) {
      onEvent?.({ type: "modelTurn", text });
    }

    for (const part of parts) {
      const inlineData = part.inlineData;
      if (
        !inlineData ||
        typeof inlineData.data !== "string" ||
        typeof inlineData.mimeType !== "string" ||
        !inlineData.mimeType.toLowerCase().startsWith("audio/pcm")
      ) {
        continue;
      }

      const sampleRate = parseSampleRate(inlineData.mimeType) ?? 24000;
      onEvent?.({
        type: "audio",
        pcm: base64ToFloatPcm(inlineData.data),
        sampleRate,
      });
    }
  }

  return {
    async connect(
      input: RealtimeTransportConnectInput,
      nextOnEvent: (event: RealtimeTransportEvent) => void,
    ) {
      if (socket) {
        throw new Error("Gemini Live transport is already connected");
      }

      onEvent = nextOnEvent;
      setupComplete = false;
      const url = `${GEMINI_LIVE_ENDPOINT}?access_token=${encodeURIComponent(input.credential)}`;
      const nextSocket = createWebSocket(url);
      socket = nextSocket;

      nextSocket.addEventListener("open", () => {
        nextSocket.send(
          JSON.stringify({
            setup: {
              model,
              generationConfig: {
                responseModalities: ["AUDIO"],
              },
              sessionResumption: {},
            },
          }),
        );
      });

      nextSocket.addEventListener("message", (event) => {
        if (typeof event.data !== "string") return;
        try {
          emitServerMessage(JSON.parse(event.data) as GeminiServerMessage);
        } catch {
          onEvent?.({
            type: "recoverableError",
            error: {
              code: "provider-message-invalid",
              message: "Realtime provider returned an invalid message.",
            },
          });
        }
      });

      nextSocket.addEventListener("error", () => {
        onEvent?.({
          type: "recoverableError",
          error: {
            code: "provider-transport-error",
            message: "Realtime provider connection failed.",
          },
        });
      });

      nextSocket.addEventListener("close", (event) => {
        if (socket === nextSocket) socket = undefined;
        setupComplete = false;
        onEvent?.({
          type: "close",
          ...(event.reason ? { reason: event.reason } : {}),
        });
      });
    },

    sendAudio(pcm, sampleRate) {
      if (!socket || !setupComplete) {
        throw new Error("Gemini Live transport is not ready");
      }
      if (!Number.isFinite(sampleRate) || sampleRate <= 0) {
        throw new Error("Gemini Live audio sample rate must be positive");
      }

      socket.send(
        JSON.stringify({
          realtimeInput: {
            audio: {
              data: floatPcmToBase64(pcm),
              mimeType: `audio/pcm;rate=${Math.round(sampleRate)}`,
            },
          },
        }),
      );
    },

    disconnect() {
      const activeSocket = socket;
      socket = undefined;
      setupComplete = false;
      onEvent = undefined;
      activeSocket?.close();
    },
  };
}