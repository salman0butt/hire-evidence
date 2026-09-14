import { describe, expect, it, vi } from "vitest";

import {
  createRealtimeTransport,
  type RealtimeTransportAdapter,
  type RealtimeTransportEvent,
} from "./transport";

function createAdapterHarness() {
  let emit: ((event: RealtimeTransportEvent) => void) | undefined;
  const connect = vi.fn(
    async (
      _input: Readonly<{ credential: string; attemptId: string }>,
      onEvent: (event: RealtimeTransportEvent) => void,
    ) => {
      emit = onEvent;
    },
  );
  const sendAudio = vi.fn();
  const disconnect = vi.fn().mockResolvedValue(undefined);

  const adapter: RealtimeTransportAdapter = {
    connect,
    sendAudio,
    disconnect,
  };

  return {
    adapter,
    connect,
    sendAudio,
    disconnect,
    emit(event: RealtimeTransportEvent) {
      if (!emit) {
        throw new Error("Adapter is not connected.");
      }
      emit(event);
    },
    currentEmitter() {
      if (!emit) {
        throw new Error("Adapter is not connected.");
      }
      return emit;
    },
  };
}

describe("RealtimeTransport", () => {
  it("enforces open lifecycle before audio send and rejects sends after close", async () => {
    const harness = createAdapterHarness();
    const onEvent = vi.fn();
    const transport = createRealtimeTransport({ adapter: harness.adapter, onEvent });

    expect(() => transport.sendAudio(new Float32Array([0.1]), 48_000)).toThrow(
      /transport is not open/i,
    );

    await transport.connect({ credential: "short-lived-token", attemptId: "attempt-1" });

    expect(() => transport.sendAudio(new Float32Array([0.2]), 48_000)).toThrow(
      /transport is not open/i,
    );

    harness.emit({ type: "open" });
    const pcm = new Float32Array([0.25, -0.25]);
    transport.sendAudio(pcm, 48_000);

    expect(harness.sendAudio).toHaveBeenCalledWith(pcm, 48_000);
    expect(onEvent).toHaveBeenLastCalledWith({ type: "open" });

    harness.emit({ type: "close", reason: "provider-closed" });
    expect(() => transport.sendAudio(new Float32Array([0.3]), 48_000)).toThrow(
      /transport is not open/i,
    );
  });

  it("ignores stale adapter callbacks after disconnect and after a newer connection", async () => {
    const harness = createAdapterHarness();
    const onEvent = vi.fn();
    const transport = createRealtimeTransport({ adapter: harness.adapter, onEvent });

    await transport.connect({ credential: "token-1", attemptId: "attempt-1" });
    const staleEmit = harness.currentEmitter();
    harness.emit({ type: "open" });
    expect(onEvent).toHaveBeenCalledTimes(1);

    await transport.disconnect();
    await transport.disconnect();
    expect(harness.disconnect).toHaveBeenCalledTimes(1);

    staleEmit({ type: "candidateSpeechStart" });
    expect(onEvent).toHaveBeenCalledTimes(1);

    await transport.connect({ credential: "token-2", attemptId: "attempt-1" });
    const currentEmit = harness.currentEmitter();
    staleEmit({ type: "fatalError", error: { code: "stale", message: "obsolete" } });
    currentEmit({ type: "open" });
    currentEmit({ type: "candidateSpeechStart" });

    expect(onEvent).toHaveBeenCalledTimes(3);
    expect(onEvent).toHaveBeenNthCalledWith(2, { type: "open" });
    expect(onEvent).toHaveBeenNthCalledWith(3, { type: "candidateSpeechStart" });
  });

  it("normalizes adapter connection and audio-send failures into technical events", async () => {
    const connectFailure = new Error("socket unavailable");
    const sendFailure = new Error("socket write failed");
    const onEvent = vi.fn();
    const failingConnectAdapter: RealtimeTransportAdapter = {
      connect: vi.fn().mockRejectedValue(connectFailure),
      sendAudio: vi.fn(),
      disconnect: vi.fn(),
    };
    const failedConnectTransport = createRealtimeTransport({
      adapter: failingConnectAdapter,
      onEvent,
    });

    await expect(
      failedConnectTransport.connect({ credential: "token", attemptId: "attempt-1" }),
    ).rejects.toThrow("socket unavailable");
    expect(onEvent).toHaveBeenLastCalledWith({
      type: "recoverableError",
      error: { code: "connect-failed", message: "Realtime connection failed." },
    });

    const harness = createAdapterHarness();
    harness.adapter.sendAudio = vi.fn(() => {
      throw sendFailure;
    });
    const sendEvents = vi.fn();
    const transport = createRealtimeTransport({ adapter: harness.adapter, onEvent: sendEvents });

    await transport.connect({ credential: "token", attemptId: "attempt-1" });
    harness.emit({ type: "open" });

    expect(() => transport.sendAudio(new Float32Array([0.2]), 48_000)).toThrow(
      "socket write failed",
    );
    expect(sendEvents).toHaveBeenLastCalledWith({
      type: "recoverableError",
      error: { code: "send-failed", message: "Realtime audio send failed." },
    });
  });
});
