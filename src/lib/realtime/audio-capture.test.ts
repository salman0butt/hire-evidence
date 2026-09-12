import { describe, expect, it, vi } from "vitest";

import { createRealtimeAudioCapture } from "./audio-capture";

describe("RealtimeAudioCapture", () => {
  it("acquires the selected microphone and emits mono PCM only after start", async () => {
    const stopTrack = vi.fn();
    const onChunk = vi.fn();
    const postMessage = vi.fn();
    const connect = vi.fn();
    const disconnect = vi.fn();
    let workletMessage:
      | ((event: {
          data: {
            type: string;
            pcm?: Float32Array | undefined;
            level?: number | undefined;
          };
        }) => void)
      | undefined;

    const stream = {
      getTracks: () => [{ stop: stopTrack }],
    };
    const source = { connect, disconnect };
    const workletNode = {
      connect: vi.fn(),
      disconnect: vi.fn(),
      port: {
        postMessage,
        set onmessage(handler: typeof workletMessage) {
          workletMessage = handler;
        },
      },
    };
    const audioContext = {
      sampleRate: 48_000,
      audioWorklet: { addModule: vi.fn().mockResolvedValue(undefined) },
      createMediaStreamSource: vi.fn(() => source),
      destination: {},
      close: vi.fn().mockResolvedValue(undefined),
    };
    const getUserMedia = vi.fn().mockResolvedValue(stream);
    const createAudioContext = vi.fn(() => audioContext);
    const createWorkletNode = vi.fn(() => workletNode);

    const capture = createRealtimeAudioCapture({
      selectedInputDeviceId: "usb-mic",
      getUserMedia,
      createAudioContext,
      createWorkletNode,
      onChunk,
    });

    expect(onChunk).not.toHaveBeenCalled();

    await capture.start();

    expect(getUserMedia).toHaveBeenCalledWith({
      audio: {
        deviceId: { exact: "usb-mic" },
        channelCount: 1,
      },
      video: false,
    });
    expect(audioContext.audioWorklet.addModule).toHaveBeenCalledWith(
      "/worklets/interview-mic-processor.js",
    );
    expect(source.connect).toHaveBeenCalledWith(workletNode);

    const pcm = new Float32Array([0.25, -0.5]);
    workletMessage?.({ data: { type: "pcm", pcm } });

    expect(onChunk).toHaveBeenCalledTimes(1);
    expect(onChunk).toHaveBeenCalledWith(pcm, 48_000);
  });

  it("releases the microphone and audio context when startup fails", async () => {
    const workletFailure = new Error("worklet failed");
    const stopTrack = vi.fn();
    const close = vi.fn().mockResolvedValue(undefined);
    const stream = {
      getTracks: () => [{ stop: stopTrack }],
    };
    const source = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
    const audioContext = {
      sampleRate: 48_000,
      audioWorklet: { addModule: vi.fn().mockRejectedValue(workletFailure) },
      createMediaStreamSource: vi.fn(() => source),
      destination: {},
      close,
    };

    const capture = createRealtimeAudioCapture({
      getUserMedia: vi.fn().mockResolvedValue(stream),
      createAudioContext: vi.fn(() => audioContext),
      createWorkletNode: vi.fn(() => ({
        connect: vi.fn(),
        disconnect: vi.fn(),
        port: { postMessage: vi.fn() },
      })),
      onChunk: vi.fn(),
    });

    await expect(capture.start()).rejects.toThrow("worklet failed");

    expect(stopTrack).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
  });

  it("coalesces concurrent start requests into one microphone acquisition", async () => {
    const stream = {
      getTracks: () => [{ stop: vi.fn() }],
    };
    const source = {
      connect: vi.fn(),
      disconnect: vi.fn(),
    };
    const workletNode = {
      connect: vi.fn(),
      disconnect: vi.fn(),
      port: { postMessage: vi.fn() },
    };
    const audioContext = {
      sampleRate: 48_000,
      audioWorklet: { addModule: vi.fn().mockResolvedValue(undefined) },
      createMediaStreamSource: vi.fn(() => source),
      destination: {},
      close: vi.fn().mockResolvedValue(undefined),
    };
    const getUserMedia = vi.fn().mockResolvedValue(stream);
    const capture = createRealtimeAudioCapture({
      getUserMedia,
      createAudioContext: vi.fn(() => audioContext),
      createWorkletNode: vi.fn(() => workletNode),
      onChunk: vi.fn(),
    });

    await Promise.all([capture.start(), capture.start()]);

    expect(getUserMedia).toHaveBeenCalledTimes(1);
  });

  it("does not activate capture when stopped while microphone acquisition is pending", async () => {
    let resolveStream: ((stream: { getTracks: () => { stop: () => void }[] }) => void) | undefined;
    const stopTrack = vi.fn();
    const close = vi.fn().mockResolvedValue(undefined);
    const addModule = vi.fn().mockResolvedValue(undefined);
    const stream = {
      getTracks: () => [{ stop: stopTrack }],
    };
    const getUserMedia = vi.fn(
      () =>
        new Promise<typeof stream>((resolve) => {
          resolveStream = resolve;
        }),
    );
    const capture = createRealtimeAudioCapture({
      getUserMedia,
      createAudioContext: vi.fn(() => ({
        sampleRate: 48_000,
        audioWorklet: { addModule },
        createMediaStreamSource: vi.fn(() => ({
          connect: vi.fn(),
          disconnect: vi.fn(),
        })),
        destination: {},
        close,
      })),
      createWorkletNode: vi.fn(() => ({
        connect: vi.fn(),
        disconnect: vi.fn(),
        port: { postMessage: vi.fn() },
      })),
      onChunk: vi.fn(),
    });

    const startPromise = capture.start();
    await Promise.resolve();
    await capture.stop();
    resolveStream?.(stream);
    await startPromise;

    expect(stopTrack).toHaveBeenCalledTimes(1);
    expect(addModule).not.toHaveBeenCalled();
    expect(close).not.toHaveBeenCalled();
  });
});
