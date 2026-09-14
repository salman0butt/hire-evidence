export type RealtimePlaybackAudioBuffer = Readonly<{
  sampleRate: number;
  copyToChannel: (data: Float32Array, channelNumber?: number) => void;
}>;

export type RealtimePlaybackBufferSource = {
  buffer: unknown;
  onended: (() => void) | null;
  connect: (destination: unknown) => unknown;
  start: () => void;
  stop: () => void;
  disconnect: () => void;
};

export type RealtimePlaybackAudioContext = Readonly<{
  destination: unknown;
  createBuffer: (
    numberOfChannels: number,
    length: number,
    sampleRate: number,
  ) => RealtimePlaybackAudioBuffer;
  createBufferSource: () => RealtimePlaybackBufferSource;
  close: () => Promise<void> | void;
}>;

export type RealtimeAudioPlayback = Readonly<{
  enqueue: (pcm: Float32Array, sampleRate: number) => void;
  interrupt: () => void;
  stop: () => Promise<void>;
}>;

type QueuedAudio = Readonly<{
  pcm: Float32Array;
  sampleRate: number;
}>;

function peakLevel(pcm: Float32Array) {
  let peak = 0;
  for (const sample of pcm) {
    peak = Math.max(peak, Math.abs(sample));
  }
  return peak;
}

export function createRealtimeAudioPlayback(options: Readonly<{
  createAudioContext: () => RealtimePlaybackAudioContext;
  onOutputLevel?: ((level: number) => void) | undefined;
}>): RealtimeAudioPlayback {
  let context: RealtimePlaybackAudioContext | undefined;
  let activeSource: RealtimePlaybackBufferSource | undefined;
  let queue: QueuedAudio[] = [];
  let epoch = 0;
  let stopped = false;
  let stopPromise: Promise<void> | undefined;

  function ensureContext() {
    context ??= options.createAudioContext();
    return context;
  }

  function releaseSource(source: RealtimePlaybackBufferSource) {
    source.onended = null;
    source.disconnect();
  }

  function startNext(expectedEpoch: number) {
    if (stopped || expectedEpoch !== epoch || activeSource) {
      return;
    }

    const next = queue.shift();
    if (!next) {
      options.onOutputLevel?.(0);
      return;
    }

    const currentContext = ensureContext();
    const buffer = currentContext.createBuffer(1, next.pcm.length, next.sampleRate);
    buffer.copyToChannel(next.pcm, 0);

    const source = currentContext.createBufferSource();
    source.buffer = buffer;
    source.connect(currentContext.destination);
    activeSource = source;

    source.onended = () => {
      if (activeSource !== source || expectedEpoch !== epoch) {
        return;
      }

      activeSource = undefined;
      releaseSource(source);
      startNext(expectedEpoch);
    };

    options.onOutputLevel?.(peakLevel(next.pcm));
    source.start();
  }

  function interrupt() {
    if (stopped) {
      return;
    }

    epoch += 1;
    queue = [];

    const source = activeSource;
    activeSource = undefined;
    if (source) {
      source.onended = null;
      source.stop();
      source.disconnect();
    }

    options.onOutputLevel?.(0);
  }

  function enqueue(pcm: Float32Array, sampleRate: number) {
    if (stopped) {
      throw new Error("Realtime audio playback is stopped.");
    }
    if (!Number.isFinite(sampleRate) || sampleRate <= 0) {
      throw new Error("Realtime audio sample rate must be positive.");
    }

    queue.push({ pcm: new Float32Array(pcm), sampleRate });
    startNext(epoch);
  }

  function stop() {
    if (stopPromise) {
      return stopPromise;
    }
    if (stopped) {
      return Promise.resolve();
    }

    stopped = true;
    epoch += 1;
    queue = [];

    const source = activeSource;
    activeSource = undefined;
    if (source) {
      source.onended = null;
      source.stop();
      source.disconnect();
    }

    options.onOutputLevel?.(0);

    const currentContext = context;
    context = undefined;
    const pendingStop = Promise.resolve(currentContext?.close()).then(() => undefined);
    stopPromise = pendingStop;
    return pendingStop;
  }

  return { enqueue, interrupt, stop };
}
