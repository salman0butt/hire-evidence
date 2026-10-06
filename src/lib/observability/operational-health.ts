import type { OperationalSignal } from "./operational-signal";

export type OperationalServiceLevelProjection = Readonly<{
  measuredSignals: number;
  successfulSignals: number;
  incidentSignals: number;
  successRate: number | null;
  incidentRate: number | null;
}>;

export type OperationalHealthProjection = Readonly<{
  health: "healthy" | "incident";
  totalSignals: number;
  errorSignals: number;
  degradedSignals: number;
  maxLatencyMs: number;
  errorCodes: readonly string[];
  serviceLevel: OperationalServiceLevelProjection;
}>;

export function projectOperationalHealth(signals: readonly OperationalSignal[]): OperationalHealthProjection {
  let errorSignals = 0;
  let degradedSignals = 0;
  let maxLatencyMs = 0;
  const errorCodes = new Set<string>();

  for (const signal of signals) {
    maxLatencyMs = Math.max(maxLatencyMs, signal.latencyMs);

    if (signal.status === "error") {
      errorSignals += 1;
      if (signal.errorCode) errorCodes.add(signal.errorCode);
    } else if (signal.status === "degraded") {
      degradedSignals += 1;
    }
  }

  const measuredSignals = signals.length;
  const incidentSignals = errorSignals + degradedSignals;
  const successfulSignals = measuredSignals - incidentSignals;

  return {
    health: incidentSignals > 0 ? "incident" : "healthy",
    totalSignals: measuredSignals,
    errorSignals,
    degradedSignals,
    maxLatencyMs,
    errorCodes: [...errorCodes].sort(),
    serviceLevel: {
      measuredSignals,
      successfulSignals,
      incidentSignals,
      successRate: measuredSignals === 0 ? null : successfulSignals / measuredSignals,
      incidentRate: measuredSignals === 0 ? null : incidentSignals / measuredSignals,
    },
  };
}
