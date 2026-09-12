export type RealtimeTransportError = Readonly<{
  code: string;
  message: string;
}>;

export type RealtimeTransportEvent =
  | Readonly<{ type: "open" }>
  | Readonly<{ type: "audio"; pcm: Float32Array; sampleRate: number }>
  | Readonly<{ type: "candidateSpeechStart" }>
  | Readonly<{ type: "candidateSpeechEnd" }>
  | Readonly<{ type: "modelTurn"; text: string }>
  | Readonly<{ type: "interrupted" }>
  | Readonly<{ type: "recoverableError"; error: RealtimeTransportError }>
  | Readonly<{ type: "fatalError"; error: RealtimeTransportError }>
  | Readonly<{ type: "close"; reason?: string }>;

export type RealtimeTransportConnectInput = Readonly<{
  credential: string;
  attemptId: string;
}>;

export interface RealtimeTransportAdapter {
  connect(
    input: RealtimeTransportConnectInput,
    onEvent: (event: RealtimeTransportEvent) => void,
  ): Promise<void>;
  sendAudio(pcm: Float32Array, sampleRate: number): void;
  disconnect(): Promise<void> | void;
}

export interface RealtimeTransport {
  connect(input: RealtimeTransportConnectInput): Promise<void>;
  sendAudio(pcm: Float32Array, sampleRate: number): void;
  disconnect(): Promise<void>;
}

type TransportState = "idle" | "connecting" | "open" | "closed";

export function createRealtimeTransport(input: Readonly<{
  adapter: RealtimeTransportAdapter;
  onEvent: (event: RealtimeTransportEvent) => void;
}>): RealtimeTransport {
  let generation = 0;
  let state: TransportState = "idle";
  let adapterConnected = false;

  return {
    async connect(connectInput) {
      if (adapterConnected) {
        throw new Error("Realtime transport is already connected.");
      }

      const activeGeneration = ++generation;
      state = "connecting";
      adapterConnected = true;

      try {
        await input.adapter.connect(connectInput, (event) => {
          if (activeGeneration !== generation || !adapterConnected) {
            return;
          }

          if (event.type === "open") {
            state = "open";
          } else if (event.type === "close" || event.type === "fatalError") {
            state = "closed";
          }

          input.onEvent(event);
        });
      } catch (error) {
        adapterConnected = false;
        state = "closed";
        generation += 1;
        input.onEvent({
          type: "recoverableError",
          error: {
            code: "connect-failed",
            message: "Realtime connection failed.",
          },
        });
        throw error;
      }
    },

    sendAudio(pcm, sampleRate) {
      if (state !== "open" || !adapterConnected) {
        throw new Error("Realtime transport is not open.");
      }

      try {
        input.adapter.sendAudio(pcm, sampleRate);
      } catch (error) {
        input.onEvent({
          type: "recoverableError",
          error: {
            code: "send-failed",
            message: "Realtime audio send failed.",
          },
        });
        throw error;
      }
    },

    async disconnect() {
      if (!adapterConnected) {
        return;
      }

      adapterConnected = false;
      state = "closed";
      generation += 1;
      await input.adapter.disconnect();
    },
  };
}

export type FakeRealtimeTransportAdapter = RealtimeTransportAdapter & Readonly<{
  emit(event: RealtimeTransportEvent): void;
  sentAudio(): ReadonlyArray<Readonly<{ pcm: Float32Array; sampleRate: number }>>;
}>;

export function createFakeRealtimeTransportAdapter(): FakeRealtimeTransportAdapter {
  let onEvent: ((event: RealtimeTransportEvent) => void) | undefined;
  const audio: Array<Readonly<{ pcm: Float32Array; sampleRate: number }>> = [];

  return {
    async connect(_input, nextOnEvent) {
      onEvent = nextOnEvent;
    },
    sendAudio(pcm, sampleRate) {
      audio.push({ pcm, sampleRate });
    },
    async disconnect() {
      onEvent = undefined;
    },
    emit(event) {
      onEvent?.(event);
    },
    sentAudio() {
      return audio.slice();
    },
  };
}
