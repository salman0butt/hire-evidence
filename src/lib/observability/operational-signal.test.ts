import { describe, expect, it, vi } from "vitest";

import * as operationalSignals from "./operational-signal";

const { createOperationalSignal } = operationalSignals;

const validSignal = {
  requestId: "req-123",
  correlationId: "corr-456",
  service: "realtime-session",
  status: "ok",
  latencyMs: 42,
} as const;

describe("createOperationalSignal", () => {
  it("creates an immutable structured operational signal", () => {
    const signal = createOperationalSignal(validSignal);
    expect(signal).toEqual(validSignal);
    expect(Object.isFrozen(signal)).toBe(true);
  });

  it("rejects free-form shadow payload fields", () => {
    for (const unsafe of [
      { transcript: "free form content" },
      { candidateText: "free form content" },
      { resume: "free form content" },
      { rawPayload: { anything: true } },
    ]) {
      expect(() => createOperationalSignal({ ...validSignal, ...unsafe })).toThrow(/operational signal/i);
    }
  });

  it("rejects missing identity and unbounded health or latency values", () => {
    expect(() => createOperationalSignal({ ...validSignal, requestId: "" })).toThrow(/operational signal/i);
    expect(() => createOperationalSignal({ ...validSignal, correlationId: "" })).toThrow(/operational signal/i);
    expect(() => createOperationalSignal({ ...validSignal, status: "arbitrary-free-form-status" })).toThrow(/operational signal/i);
    expect(() => createOperationalSignal({ ...validSignal, latencyMs: -1 })).toThrow(/operational signal/i);
    expect(() => createOperationalSignal({ ...validSignal, latencyMs: 999999999 })).toThrow(/operational signal/i);
  });

  it("accepts only bounded machine-readable error codes", () => {
    expect(createOperationalSignal({ ...validSignal, status: "error", errorCode: "PROVIDER_TIMEOUT" }).errorCode)
      .toBe("PROVIDER_TIMEOUT");
    expect(() => createOperationalSignal({ ...validSignal, status: "error", errorCode: "arbitrary free form text" }))
      .toThrow(/operational signal/i);
  });
});

describe("createOperationalSignalRecorder", () => {
  type Rpc = (
    name: string,
    args: Readonly<Record<string, unknown>>,
  ) => Promise<Readonly<{ data: unknown; error: unknown }>>;
  type RecorderFactory = (
    rpc: Rpc,
  ) => (input: unknown) => Promise<void>;

  const getFactory = () =>
    (operationalSignals as typeof operationalSignals & {
      createOperationalSignalRecorder?: RecorderFactory;
    }).createOperationalSignalRecorder;

  it("persists only the normalized bounded operational fields", async () => {
    const factory = getFactory();
    expect(factory).toBeTypeOf("function");

    const rpc = vi.fn<Rpc>().mockResolvedValue({ data: 1, error: null });
    const record = factory!(rpc);

    await record(validSignal);

    expect(rpc).toHaveBeenCalledOnce();
    expect(rpc).toHaveBeenCalledWith("record_operational_signal", {
      p_request_id: "req-123",
      p_correlation_id: "corr-456",
      p_service: "realtime-session",
      p_status: "ok",
      p_latency_ms: 42,
      p_error_code: null,
    });
  });

  it("rejects unsafe inputs before RPC and maps database details to a constant-safe error", async () => {
    const factory = getFactory();
    expect(factory).toBeTypeOf("function");

    const rpc = vi.fn<Rpc>();
    const record = factory!(rpc);

    await expect(record({ ...validSignal, transcript: "candidate answer" }))
      .rejects.toThrow(/operational signal/i);
    expect(rpc).not.toHaveBeenCalled();

    rpc.mockResolvedValue({
      data: null,
      error: { message: "database detail containing sensitive infrastructure metadata" },
    });

    await expect(record(validSignal)).rejects.toThrow("operational signal unavailable");
    await expect(record(validSignal)).rejects.not.toThrow(/sensitive infrastructure metadata/i);
  });
});
