type AudioCaptureTrack = Readonly<{
  stop: () => void;
}>;

type AudioCaptureStream = Readonly<{
  getTracks: () => readonly AudioCaptureTrack[];
}>;

type AudioCaptureSourceNode = Readonly<{
  connect: (destination: unknown) => unknown;
  disconnect: () => void;
}>;

type AudioCaptureWorkletMessage = Readonly<{
  type: string;
  pcm?: Float32Array | undefined;
  level?: number | undefined;
}>;

type AudioCaptureWorkletNode = Readonly<{
  connect: (destination: unknown) => unknown;
  disconnect: () => void;
  port: {
    postMessage: (message: unknown) => void;
    onmessage?: ((event: { data: AudioCaptureWorkletMessage }) => void) | undefined;
  };
}>;

type AudioCaptureContext = Readonly<{
  sampleRate: number;
  audioWorklet: Readonly<{
    addModule: (url: string) => Promise<void>;
  }>;
  createMediaStreamSource: (stream: AudioCaptureStream) => AudioCaptureSourceNode;
  destination: unknown;
  close: () => Promise<void> | void;
}>;

type AudioCaptureConstraints = Readonly<{
  audio: Readonly<{
    channelCount: 1;
    deviceId?: Readonly<{ exact: string }> | undefined;
  }>;
  video: false;
}>;

export type RealtimeAudioCapture = Readonly<{
  start: () => Promise<void>;
  setMuted: (muted: boolean) => void;
  stop: () => Promise<void>;
}>;

type RealtimeAudioCaptureOptions = Readonly<{
  selectedInputDeviceId?: string | undefined;
  getUserMedia: (constraints: AudioCaptureConstraints) => Promise<AudioCaptureStream>;
  createAudioContext: () => AudioCaptureContext;
  createWorkletNode: (context: AudioCaptureContext) => AudioCaptureWorkletNode;
  onChunk: (pcm: Float32Array, sampleRate: number) => void;
  onInputLevel?: ((level: number) => void) | undefined;
}>;

const WORKLET_URL = "/worklets/interview-mic-processor.js";

export function createRealtimeAudioCapture(
  options: RealtimeAudioCaptureOptions,
): RealtimeAudioCapture {
  let stream: AudioCaptureStream | undefined;
  let context: AudioCaptureContext | undefined;
  let source: AudioCaptureSourceNode | undefined;
  let workletNode: AudioCaptureWorkletNode | undefined;
  let active = false;
  let muted = false;
  let generation = 0;

  async function start() {
    if (active) {
      return;
    }

    const currentGeneration = ++generation;
    const constraints: AudioCaptureConstraints = {
      audio: {
        channelCount: 1,
        ...(options.selectedInputDeviceId
          ? { deviceId: { exact: options.selectedInputDeviceId } }
          : {}),
      },
      video: false,
    };

    try {
      stream = await options.getUserMedia(constraints);
      context = options.createAudioContext();
      await context.audioWorklet.addModule(WORKLET_URL);
      source = context.createMediaStreamSource(stream);
      workletNode = options.createWorkletNode(context);

      source.connect(workletNode);
      workletNode.connect(context.destination);
      workletNode.port.onmessage = (event) => {
        if (!active || currentGeneration !== generation) {
          return;
        }

        const message = event.data;
        if (message.type === "pcm" && message.pcm && !muted) {
          options.onChunk(message.pcm, context?.sampleRate ?? 0);
        }
        if (message.type === "level" && typeof message.level === "number") {
          options.onInputLevel?.(muted ? 0 : message.level);
        }
      };

      active = true;
    } catch (error) {
      await stop();
      throw error;
    }
  }

  function setMuted(nextMuted: boolean) {
    muted = nextMuted;
    workletNode?.port.postMessage({ type: "mute", muted: nextMuted });
    if (nextMuted) {
      options.onInputLevel?.(0);
    }
  }

  async function stop() {
    if (!stream && !context && !source && !workletNode) {
      return;
    }

    active = false;
    generation += 1;

    const currentStream = stream;
    const currentContext = context;
    const currentSource = source;
    const currentWorkletNode = workletNode;

    stream = undefined;
    context = undefined;
    source = undefined;
    workletNode = undefined;

    currentSource?.disconnect();
    currentWorkletNode?.disconnect();
    currentStream?.getTracks().forEach((track) => track.stop());
    await currentContext?.close();
    options.onInputLevel?.(0);
  }

  return { start, setMuted, stop };
}
