import { describe, expect, it, vi } from "vitest";

import { createRealtimeAudioCapture } from "./audio-capture";

type WorkletMessage = Readonly<{
  type: string;
  pcm?: Float32Array | undefined;
  level?: number | undefined;
}>;

describe("RealtimeAudioCapture cleanup", () => {
  it("resets the visible input level even when AudioContext close fails", async () => {
    const closeFailure = new Error("audio context close failed");
    const stopTrack = vi.fn();
    const onInputLevel = vi.fn();
    let workletMessage:
      | ((event: { data: WorkletMessage }) => void)
      | undefined;

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
          set onmessage(
            handler: ((event: { data: WorkletMessage }) => void) | undefined,
          ) {
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
});
