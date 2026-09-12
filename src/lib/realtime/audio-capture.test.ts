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
      | ((event: { data: { type: string; pcm?: Float32Array; level?: number } }) => void)
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
});
