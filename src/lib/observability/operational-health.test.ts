import { describe, expect, it } from "vitest";

import { projectOperationalHealth } from "./operational-health";
import type { OperationalSignal } from "./operational-signal";

const signal = (
  status: OperationalSignal["status"],
  latencyMs: number,
  errorCode?: string,
): OperationalSignal => Object.freeze({
  requestId: "req-1",
  correlationId: "corr-1",
  service: "realtime-session",
  status,
  latencyMs,
  ...(errorCode ? { errorCode } : {}),
});

describe("projectOperationalHealth", () => {
  it("projects deterministic incident health without carrying request or candidate data", () => {
    const projection = projectOperationalHealth([
      signal("ok", 40),
      signal("degraded", 850),
      signal("error", 1200, "PROVIDER_TIMEOUT"),
    ]);

    expect(projection).toEqual({
      health: "incident",
      totalSignals: 3,
      errorSignals: 1,
      degradedSignals: 1,
      maxLatencyMs: 1200,
      errorCodes: ["PROVIDER_TIMEOUT"],
    });
    expect(projection).not.toHaveProperty("requestId");
    expect(projection).not.toHaveProperty("correlationId");
  });

  it("reports healthy only when every bounded signal is healthy", () => {
    expect(projectOperationalHealth([signal("ok", 25), signal("ok", 60)])).toEqual({
      health: "healthy",
      totalSignals: 2,
      errorSignals: 0,
      degradedSignals: 0,
      maxLatencyMs: 60,
      errorCodes: [],
    });
  });
});
