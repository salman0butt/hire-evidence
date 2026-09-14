import type { RealtimeAudioCapture } from "./audio-capture";
import type { RealtimeAudioPlayback } from "./audio-playback";
import {
  createRealtimeInterviewSession,
  type RealtimeInterviewSession,
  type RealtimeInterviewSessionSnapshot,
} from "./interview-session";
import type { RealtimeSessionAuthorization } from "./session-authorization";
import type { RealtimeAttemptProgressResult } from "./session-repository";
import type {
  RealtimeTransport,
  RealtimeTransportEvent,
} from "./transport";

type AuthorizedRealtimeSession = Extract<
  RealtimeSessionAuthorization,
  { status: "authorized" }
>;

type RealtimeInterviewRuntimeOptions = Readonly<{
  authorization: AuthorizedRealtimeSession;
  createTransport: (
    onEvent: (event: RealtimeTransportEvent) => void,
  ) => RealtimeTransport;
  createCapture: (
    onChunk: (pcm: Float32Array, sampleRate: number) => void,
  ) => RealtimeAudioCapture;
  playback: RealtimeAudioPlayback;
  persistProgress?:
    | ((input: Readonly<{ eventId: string; questionId: string }>) => Promise<RealtimeAttemptProgressResult>)
    | undefined;
  onSnapshot?: ((snapshot: RealtimeInterviewSessionSnapshot) => void) | undefined;
}>;

export type RealtimeInterviewRuntime = Readonly<{
  start(): Promise<void>;
  stop(): Promise<void>;
  setMuted(muted: boolean): void;
  completeCurrentQuestion(eventId: string): Promise<void>;
  getSnapshot(): RealtimeInterviewSessionSnapshot;
}>;

export function createRealtimeInterviewRuntime(
  options: RealtimeInterviewRuntimeOptions,
): RealtimeInterviewRuntime {
  let resolveReady: (() => void) | undefined;
  let rejectReady: ((error: Error) => void) | undefined;
  let started = false;
  let stopped = false;
  let startPromise: Promise<void> | undefined;
  let stopPromise: Promise<void> | undefined;

  const providerReady = new Promise<void>((resolve, reject) => {
    resolveReady = resolve;
    rejectReady = reject;
  });

  const session: RealtimeInterviewSession = createRealtimeInterviewSession({
    plan: options.authorization.interviewPlan,
    playback: options.playback,
    ...(options.authorization.resumeCheckpoint
      ? { resumeCheckpoint: options.authorization.resumeCheckpoint }
      : {}),
    ...(options.persistProgress ? { persistProgress: options.persistProgress } : {}),
    onSnapshot: options.onSnapshot,
  });

  const transport = options.createTransport((event) => {
    session.handleTransportEvent(event);

    if (event.type === "open") {
      resolveReady?.();
      resolveReady = undefined;
      rejectReady = undefined;
      return;
    }

    if (
      event.type === "fatalError" ||
      event.type === "recoverableError" ||
      event.type === "close"
    ) {
      rejectReady?.(new Error("Realtime provider did not become ready."));
      resolveReady = undefined;
      rejectReady = undefined;
    }
  });

  const capture = options.createCapture((pcm, sampleRate) => {
    if (!started || stopped) return;
    try {
      transport.sendAudio(pcm, sampleRate);
    } catch {
      // The transport emits its own normalized recoverable error. Avoid throwing
      // from an AudioWorklet message callback after that signal has been emitted.
    }
  });

  async function startRuntime() {
    if (stopped) {
      throw new Error("Realtime interview runtime is stopped.");
    }

    await transport.connect({
      credential: options.authorization.providerCredential.credential,
      attemptId: options.authorization.attemptId,
    });
    await providerReady;

    if (stopped) return;
    started = true;
    await capture.start();
  }

  function start() {
    if (started) return Promise.resolve();
    startPromise ??= startRuntime().catch((error) => {
      startPromise = undefined;
      throw error;
    });
    return startPromise;
  }

  function stop() {
    if (stopPromise) return stopPromise;
    if (stopped) return Promise.resolve();

    stopped = true;
    started = false;
    rejectReady?.(new Error("Realtime interview runtime stopped before provider readiness."));
    resolveReady = undefined;
    rejectReady = undefined;

    stopPromise = Promise.allSettled([
      capture.stop(),
      transport.disconnect(),
      options.playback.stop(),
    ]).then(() => undefined);

    return stopPromise;
  }

  return Object.freeze({
    start,
    stop,
    setMuted(muted) {
      capture.setMuted(muted);
    },
    completeCurrentQuestion(eventId) {
      return session.completeCurrentQuestion(eventId);
    },
    getSnapshot() {
      return session.getSnapshot();
    },
  });
}