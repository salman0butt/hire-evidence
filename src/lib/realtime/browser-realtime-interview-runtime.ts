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

function createBrowserAudioContext() {
  return new AudioContext();
}

export function createBrowserRealtimeInterviewRuntime(
  authorization: AuthorizedRealtimeSession,
): RealtimeInterviewRuntime {
  const playback = createRealtimeAudioPlayback({
    createAudioContext: () =>
      createBrowserAudioContext() as unknown as RealtimePlaybackAudioContext,
  });

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
        getUserMedia: (constraints) => navigator.mediaDevices.getUserMedia(constraints),
        createAudioContext: createBrowserAudioContext,
        createWorkletNode: (context) =>
          new AudioWorkletNode(
            context as unknown as BaseAudioContext,
            "interview-mic-processor",
          ),
        onChunk,
      }),
  });
}
