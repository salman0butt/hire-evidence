import { createRealtimeAudioCapture } from "./audio-capture";
import {
  createRealtimeAudioPlayback,
  type RealtimePlaybackAudioContext,
} from "./audio-playback";
import { createGeminiRealtimeTransportAdapter } from "./gemini-transport";
import {
  createRealtimeInterviewRuntime,
  type RealtimeInterviewRuntime,
} from "./realtime-interview-runtime";
import type { RealtimeSessionAuthorization } from "./session-authorization";
import { createRealtimeTransport } from "./transport";

type AuthorizedRealtimeSession = Extract<
  RealtimeSessionAuthorization,
  { status: "authorized" }
>;
type CaptureOptions = Parameters<typeof createRealtimeAudioCapture>[0];
type CaptureContext = ReturnType<CaptureOptions["createAudioContext"]>;
type CaptureWorkletNode = ReturnType<CaptureOptions["createWorkletNode"]>;

function createPlaybackContext(): RealtimePlaybackAudioContext {
  const context = new AudioContext();

  return {
    destination: context.destination,
    createBuffer(numberOfChannels, length, sampleRate) {
      return context.createBuffer(numberOfChannels, length, sampleRate);
    },
    createBufferSource() {
      const source = context.createBufferSource();
      return {
        get buffer() {
          return source.buffer;
        },
        set buffer(value) {
          source.buffer = value as AudioBuffer | null;
        },
        get onended() {
          return source.onended as (() => void) | null;
        },
        set onended(value) {
          source.onended = value;
        },
        connect(destination) {
          return source.connect(destination as AudioNode);
        },
        start() {
          source.start();
        },
        stop() {
          source.stop();
        },
        disconnect() {
          source.disconnect();
        },
      };
    },
    close() {
      return context.close();
    },
  };
}

function createCaptureBrowserAdapters() {
  const browserContexts = new WeakMap<object, AudioContext>();

  const getUserMedia: CaptureOptions["getUserMedia"] = async (constraints) => {
    const audio: MediaTrackConstraints = {
      channelCount: constraints.audio.channelCount,
      ...(constraints.audio.deviceId
        ? { deviceId: { exact: constraints.audio.deviceId.exact } }
        : {}),
    };

    return navigator.mediaDevices.getUserMedia({ audio, video: false });
  };

  const createAudioContext: CaptureOptions["createAudioContext"] = () => {
    const browserContext = new AudioContext();
    const context: CaptureContext = {
      sampleRate: browserContext.sampleRate,
      audioWorklet: {
        addModule(url) {
          return browserContext.audioWorklet.addModule(url);
        },
      },
      createMediaStreamSource(stream) {
        const source = browserContext.createMediaStreamSource(stream as MediaStream);
        return {
          connect(destination) {
            return source.connect(destination as AudioNode);
          },
          disconnect() {
            source.disconnect();
          },
        };
      },
      destination: browserContext.destination,
      close() {
        return browserContext.close();
      },
    };

    browserContexts.set(context as object, browserContext);
    return context;
  };

  const createWorkletNode: CaptureOptions["createWorkletNode"] = (context) => {
    const browserContext = browserContexts.get(context as object);
    if (!browserContext) {
      throw new Error("Realtime capture audio context is unavailable.");
    }

    const node = new AudioWorkletNode(browserContext, "interview-mic-processor");
    const port: CaptureWorkletNode["port"] = {
      postMessage(message) {
        node.port.postMessage(message);
      },
      get onmessage() {
        return node.port.onmessage as CaptureWorkletNode["port"]["onmessage"];
      },
      set onmessage(handler) {
        node.port.onmessage = handler as MessagePort["onmessage"];
      },
    };

    return {
      connect(destination) {
        return node.connect(destination as AudioNode);
      },
      disconnect() {
        node.disconnect();
      },
      port,
    };
  };

  return { getUserMedia, createAudioContext, createWorkletNode };
}

export function createBrowserRealtimeInterviewRuntime(
  authorization: AuthorizedRealtimeSession,
): RealtimeInterviewRuntime {
  const playback = createRealtimeAudioPlayback({
    createAudioContext: createPlaybackContext,
  });
  const captureAdapters = createCaptureBrowserAdapters();

  return createRealtimeInterviewRuntime({
    authorization,
    playback,
    createTransport: (onEvent) =>
      createRealtimeTransport({
        adapter: createGeminiRealtimeTransportAdapter(),
        onEvent,
      }),
    createCapture: (onChunk) =>
      createRealtimeAudioCapture({
        ...captureAdapters,
        onChunk,
      }),
  });
}
