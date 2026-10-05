import { describe, expect, it } from "vitest";

import { createOperationalSignal } from "./operational-signal";

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
