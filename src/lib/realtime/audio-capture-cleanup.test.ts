import { describe, expect, it, vi } from "vitest";

import { createRealtimeAudioCapture } from "./audio-capture";

type WorkletMessage = Readonly<{
  type: string;
  pcm?: Float32Array | undefined;
  level?: number | undefined;
}>;

type WorkletHandler = ((event: { data: WorkletMessage }) => void) | undefined;

describe("RealtimeAudioCapture cleanup", () => {
  it("resets the visible input level even when AudioContext close fails", async () => {
    const closeFailure = new Error("audio context close failed");
    const stopTrack = vi.fn();
    const onInputLevel = vi.fn();
    let workletMessage: WorkletHandler;

    const capture = createRealtimeAudioCapture({
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: () => [{ stop: stopTrack }],
      }),
      createAudioContext: vi.fn(() => ({
        sampleRate: 48_000,
        audioWorklet: { addModule: vi.fn().mockResolvedValue(undefined) },
        createMediaStreamSource: vi.fn(() => ({
          connect: vi.fn(),
          disconnect: vi.fn(),
        })),
        destination: {},
        close: vi.fn().mockRejectedValue(closeFailure),
      })),
      createWorkletNode: vi.fn(() => ({
        connect: vi.fn(),
        disconnect: vi.fn(),
        port: {
          postMessage: vi.fn(),
          set onmessage(handler: WorkletHandler) {
            workletMessage = handler;
          },
        },
      })),
      onChunk: vi.fn(),
      onInputLevel,
    });

    await capture.start();
    workletMessage?.({ data: { type: "level", level: 0.75 } });
    expect(onInputLevel).toHaveBeenLastCalledWith(0.75);

    await expect(capture.stop()).rejects.toThrow("audio context close failed");

    expect(stopTrack).toHaveBeenCalledTimes(1);
    expect(onInputLevel).toHaveBeenLastCalledWith(0);
  });

  it("suppresses PCM and reports zero input while muted, then resumes after unmute", async () => {
    const postMessage = vi.fn();
    const onChunk = vi.fn();
    const onInputLevel = vi.fn();
    let workletMessage: WorkletHandler;

    const capture = createRealtimeAudioCapture({
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: () => [{ stop: vi.fn() }],
      }),
      createAudioContext: vi.fn(() => ({
        sampleRate: 48_000,
        audioWorklet: { addModule: vi.fn().mockResolvedValue(undefined) },
        createMediaStreamSource: vi.fn(() => ({
          connect: vi.fn(),
          disconnect: vi.fn(),
        })),
        destination: {},
        close: vi.fn().mockResolvedValue(undefined),
      })),
      createWorkletNode: vi.fn(() => ({
        connect: vi.fn(),
        disconnect: vi.fn(),
        port: {
          postMessage,
          set onmessage(handler: WorkletHandler) {
            workletMessage = handler;
          },
        },
      })),
      onChunk,
      onInputLevel,
    });

    await capture.start();
    capture.setMuted(true);

    const mutedPcm = new Float32Array([0.4]);
    workletMessage?.({ data: { type: "pcm", pcm: mutedPcm } });
    workletMessage?.({ data: { type: "level", level: 0.8 } });

    expect(postMessage).toHaveBeenLastCalledWith({ type: "mute", muted: true });
    expect(onChunk).not.toHaveBeenCalled();
    expect(onInputLevel).toHaveBeenLastCalledWith(0);

    capture.setMuted(false);
    const audiblePcm = new Float32Array([0.25]);
    workletMessage?.({ data: { type: "pcm", pcm: audiblePcm } });
    workletMessage?.({ data: { type: "level", level: 0.35 } });

    expect(postMessage).toHaveBeenLastCalledWith({ type: "mute", muted: false });
    expect(onChunk).toHaveBeenCalledTimes(1);
    expect(onChunk).toHaveBeenCalledWith(audiblePcm, 48_000);
    expect(onInputLevel).toHaveBeenLastCalledWith(0.35);
  });

  it("ignores stale worklet callbacks after stop and releases active resources only once", async () => {
    const stopTrack = vi.fn();
    const sourceDisconnect = vi.fn();
    const workletDisconnect = vi.fn();
    const close = vi.fn().mockResolvedValue(undefined);
    const onChunk = vi.fn();
    const onInputLevel = vi.fn();
    let workletMessage: WorkletHandler;

    const capture = createRealtimeAudioCapture({
      getUserMedia: vi.fn().mockResolvedValue({
        getTracks: () => [{ stop: stopTrack }],
      }),
      createAudioContext: vi.fn(() => ({
        sampleRate: 48_000,
        audioWorklet: { addModule: vi.fn().mockResolvedValue(undefined) },
        createMediaStreamSource: vi.fn(() => ({
          connect: vi.fn(),
          disconnect: sourceDisconnect,
        })),
        destination: {},
        close,
      })),
      createWorkletNode: vi.fn(() => ({
        connect: vi.fn(),
        disconnect: workletDisconnect,
        port: {
          postMessage: vi.fn(),
          set onmessage(handler: WorkletHandler) {
            workletMessage = handler;
          },
        },
      })),
      onChunk,
      onInputLevel,
    });

    await capture.start();
    const staleHandler = workletMessage;

    await capture.stop();
    await capture.stop();

    staleHandler?.({ data: { type: "pcm", pcm: new Float32Array([0.9]) } });
    staleHandler?.({ data: { type: "level", level: 0.9 } });

    expect(sourceDisconnect).toHaveBeenCalledTimes(1);
    expect(workletDisconnect).toHaveBeenCalledTimes(1);
    expect(stopTrack).toHaveBeenCalledTimes(1);
    expect(close).toHaveBeenCalledTimes(1);
    expect(onChunk).not.toHaveBeenCalled();
    expect(onInputLevel).toHaveBeenCalledTimes(1);
    expect(onInputLevel).toHaveBeenLastCalledWith(0);
  });
});
