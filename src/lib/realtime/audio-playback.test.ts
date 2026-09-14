import { describe, expect, it, vi, type Mock } from "vitest";

import { createRealtimeAudioPlayback, type RealtimePlaybackAudioContext } from "./audio-playback";

type SourceHarness = {
  start: Mock<() => void>;
  stop: Mock<() => void>;
  disconnect: Mock<() => void>;
  end(): void;
};

function createAudioHarness() {
  const sources: SourceHarness[] = [];
  const close = vi.fn<() => Promise<void>>().mockResolvedValue(undefined);
  const context: RealtimePlaybackAudioContext = {
    destination: {},
    createBuffer: vi.fn((_channels, length, sampleRate) => {
      const channel = new Float32Array(length);
      return {
        sampleRate,
        copyToChannel(data: Float32Array) {
          channel.set(data);
        },
      };
    }),
    createBufferSource: vi.fn(() => {
      let onended: (() => void) | null = null;
      const source: SourceHarness & {
        buffer: unknown;
        onended: (() => void) | null;
        connect(destination: unknown): void;
      } = {
        buffer: null,
        get onended() {
          return onended;
        },
        set onended(value) {
          onended = value;
        },
        connect: vi.fn<(destination: unknown) => void>(),
        start: vi.fn<() => void>(),
        stop: vi.fn<() => void>(),
        disconnect: vi.fn<() => void>(),
        end() {
          onended?.();
        },
      };
      sources.push(source);
      return source;
    }),
    close,
  };

  return { context, sources, close };
}

describe("RealtimeAudioPlayback", () => {
  it("serializes queued PCM chunks and cleans up each ended source", () => {
    const harness = createAudioHarness();
    const onOutputLevel = vi.fn();
    const playback = createRealtimeAudioPlayback({
      createAudioContext: () => harness.context,
      onOutputLevel,
    });

    playback.enqueue(new Float32Array([0.25, -0.5]), 24_000);
    playback.enqueue(new Float32Array([0.75]), 24_000);

    expect(harness.sources).toHaveLength(1);
    expect(harness.sources[0]?.start).toHaveBeenCalledTimes(1);
    expect(onOutputLevel).toHaveBeenLastCalledWith(0.5);

    harness.sources[0]?.end();

    expect(harness.sources[0]?.disconnect).toHaveBeenCalledTimes(1);
    expect(harness.sources).toHaveLength(2);
    expect(harness.sources[1]?.start).toHaveBeenCalledTimes(1);
    expect(onOutputLevel).toHaveBeenLastCalledWith(0.75);

    harness.sources[1]?.end();
    expect(harness.sources[1]?.disconnect).toHaveBeenCalledTimes(1);
    expect(onOutputLevel).toHaveBeenLastCalledWith(0);
  });

  it("interrupts active playback, invalidates queued audio, and ignores stale ended callbacks", () => {
    const harness = createAudioHarness();
    const onOutputLevel = vi.fn();
    const playback = createRealtimeAudioPlayback({
      createAudioContext: () => harness.context,
      onOutputLevel,
    });

    playback.enqueue(new Float32Array([0.4]), 48_000);
    playback.enqueue(new Float32Array([0.8]), 48_000);
    const interruptedSource = harness.sources[0];

    playback.interrupt();

    expect(interruptedSource?.stop).toHaveBeenCalledTimes(1);
    expect(interruptedSource?.disconnect).toHaveBeenCalledTimes(1);
    expect(onOutputLevel).toHaveBeenLastCalledWith(0);

    interruptedSource?.end();
    expect(harness.sources).toHaveLength(1);

    playback.enqueue(new Float32Array([0.6]), 48_000);
    expect(harness.sources).toHaveLength(2);
    expect(harness.sources[1]?.start).toHaveBeenCalledTimes(1);

    interruptedSource?.end();
    expect(harness.sources).toHaveLength(2);
    expect(harness.sources[1]?.stop).not.toHaveBeenCalled();
  });

  it("stops active playback and closes resources exactly once", async () => {
    const harness = createAudioHarness();
    const onOutputLevel = vi.fn();
    const playback = createRealtimeAudioPlayback({
      createAudioContext: () => harness.context,
      onOutputLevel,
    });

    playback.enqueue(new Float32Array([0.3]), 48_000);
    playback.enqueue(new Float32Array([0.9]), 48_000);

    await playback.stop();
    await playback.stop();

    expect(harness.sources).toHaveLength(1);
    expect(harness.sources[0]?.stop).toHaveBeenCalledTimes(1);
    expect(harness.sources[0]?.disconnect).toHaveBeenCalledTimes(1);
    expect(harness.close).toHaveBeenCalledTimes(1);
    expect(onOutputLevel).toHaveBeenLastCalledWith(0);
  });
});
