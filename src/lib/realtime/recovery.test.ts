import { describe, expect, it } from "vitest";

import { decideRealtimeRecovery } from "./recovery";

describe("realtime technical recovery policy", () => {
  it.each([
    "provider-closed",
    "provider-error",
    "credential-expired",
    "send-failed",
    "decode-failed",
  ] as const)("retries transient %s failures only within the configured bound", (kind) => {
    expect(
      decideRealtimeRecovery({
        failure: { kind, detail: "provider-internal secret details" },
        retryCount: 0,
        maxRetries: 2,
        attemptStatus: "active",
      }),
    ).toEqual({
      action: "retry",
      reason: "The interview connection was interrupted. We will try to reconnect.",
      affectsEvaluation: false,
    });

    expect(
      decideRealtimeRecovery({
        failure: { kind, detail: "provider-internal secret details" },
        retryCount: 2,
        maxRetries: 2,
        attemptStatus: "active",
      }),
    ).toEqual({
      action: "end-safe",
      reason: "The interview cannot continue because of a technical issue.",
      affectsEvaluation: false,
    });
  });

  it("routes microphone loss through candidate-remediable input recovery", () => {
    expect(
      decideRealtimeRecovery({
        failure: { kind: "microphone-lost" },
        retryCount: 0,
        maxRetries: 2,
        attemptStatus: "active",
      }),
    ).toEqual({
      action: "recover-input",
      reason: "Microphone access was interrupted. Check your microphone and try again.",
      affectsEvaluation: false,
    });
  });

  it.each(["authorization-denied", "consent-missing", "invitation-unavailable"] as const)(
    "never blindly retries terminal %s failures",
    (kind) => {
      expect(
        decideRealtimeRecovery({
          failure: { kind },
          retryCount: 0,
          maxRetries: 3,
          attemptStatus: "active",
        }),
      ).toMatchObject({ action: "end-safe", affectsEvaluation: false });
    },
  );

  it("ends safely for unsupported browsers and interview timeout", () => {
    for (const kind of ["browser-unsupported", "interview-timeout"] as const) {
      expect(
        decideRealtimeRecovery({
          failure: { kind },
          retryCount: 0,
          maxRetries: 2,
          attemptStatus: "active",
        }),
      ).toMatchObject({ action: "end-safe", affectsEvaluation: false });
    }
  });

  it("never retries a completed attempt or leaks provider details into candidate copy", () => {
    const decision = decideRealtimeRecovery({
      failure: { kind: "provider-error", detail: "secret provider payload" },
      retryCount: 0,
      maxRetries: 2,
      attemptStatus: "completed",
    });

    expect(decision.action).toBe("end-safe");
    expect(decision.affectsEvaluation).toBe(false);
    expect(decision.reason).not.toContain("secret provider payload");
  });
});
