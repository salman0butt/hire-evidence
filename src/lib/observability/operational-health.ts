import type { OperationalSignal } from "./operational-signal";

export type OperationalHealthProjection = Readonly<{
  health: "healthy" | "incident";
  totalSignals: number;
  errorSignals: number;
  degradedSignals: number;
  maxLatencyMs: number;
  errorCodes: readonly string[];
}>;

export function projectOperationalHealth(_signals: readonly OperationalSignal[]): OperationalHealthProjection {
  return {
    health: "healthy",
    totalSignals: 0,
    errorSignals: 0,
    degradedSignals: 0,
    maxLatencyMs: 0,
    errorCodes: [],
  };
}
