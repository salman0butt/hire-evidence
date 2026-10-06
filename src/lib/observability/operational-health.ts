import type { OperationalSignal } from "./operational-signal";

export type OperationalHealthProjection = Readonly<{
  health: "healthy" | "incident";
  totalSignals: number;
  errorSignals: number;
  degradedSignals: number;
  maxLatencyMs: number;
  errorCodes: readonly string[];
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

  return {
    health: errorSignals > 0 || degradedSignals > 0 ? "incident" : "healthy",
    totalSignals: signals.length,
    errorSignals,
    degradedSignals,
    maxLatencyMs,
    errorCodes: [...errorCodes].sort(),
  };
}
