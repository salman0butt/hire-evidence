import type { EvalVersionResult } from "./version-regression";

export type MetricDirection = "higher-is-better" | "lower-is-better";

export interface CiMetricThreshold {
  direction: MetricDirection;
  tolerance: number;
}

export interface CiRegressionThresholds {
  id: string;
  suiteId: string;
  suiteVersion: string;
  metrics: Readonly<Record<string, CiMetricThreshold>>;
}

export interface CiRegressionViolation {
  metric: string;
  baseline: number;
  candidate: number;
  tolerance: number;
  direction: MetricDirection;
}

export interface CiRegressionGateResult {
  thresholdId: string;
  passed: boolean;
  violations: CiRegressionViolation[];
}

function sortedMetricKeys(
  baseline: EvalVersionResult,
  candidate: EvalVersionResult,
  thresholds: CiRegressionThresholds,
): string[] {
  if (
    baseline.suiteId !== candidate.suiteId ||
    baseline.suiteVersion !== candidate.suiteVersion
  ) {
    throw new Error("Baseline and candidate must use the same immutable suite");
  }

  if (
    thresholds.suiteId !== baseline.suiteId ||
    thresholds.suiteVersion !== baseline.suiteVersion
  ) {
    throw new Error("Threshold suite provenance must match the immutable eval suite");
  }

  const baselineKeys = Object.keys(baseline.metrics).sort();
  const candidateKeys = Object.keys(candidate.metrics).sort();
  const thresholdKeys = Object.keys(thresholds.metrics).sort();
  if (
    baselineKeys.length === 0 ||
    baselineKeys.length !== candidateKeys.length ||
    baselineKeys.length !== thresholdKeys.length ||
    baselineKeys.some((key, index) => key !== candidateKeys[index] || key !== thresholdKeys[index])
  ) {
    throw new Error("Thresholds must completely cover the identical compared metric set");
  }

  return baselineKeys;
}

export function evaluateCiRegressionGate(
  baseline: EvalVersionResult,
  candidate: EvalVersionResult,
  thresholds: CiRegressionThresholds,
): CiRegressionGateResult {
  const metricKeys = sortedMetricKeys(baseline, candidate, thresholds);
  const violations: CiRegressionViolation[] = [];

  for (const metric of metricKeys) {
    const baselineValue = baseline.metrics[metric];
    const candidateValue = candidate.metrics[metric];
    const threshold = thresholds.metrics[metric];
    if (
      baselineValue === undefined ||
      candidateValue === undefined ||
      threshold === undefined ||
      !Number.isFinite(baselineValue) ||
      !Number.isFinite(candidateValue) ||
      !Number.isFinite(threshold.tolerance) ||
      threshold.tolerance < 0 ||
      (threshold.direction !== "higher-is-better" && threshold.direction !== "lower-is-better")
    ) {
      throw new Error("Thresholds and compared metrics must be complete, finite, and non-negative");
    }

    const regressed = threshold.direction === "higher-is-better"
      ? candidateValue < baselineValue - threshold.tolerance
      : candidateValue > baselineValue + threshold.tolerance;

    if (regressed) {
      violations.push({
        metric,
        baseline: baselineValue,
        candidate: candidateValue,
        tolerance: threshold.tolerance,
        direction: threshold.direction,
      });
    }
  }

  return {
    thresholdId: thresholds.id,
    passed: violations.length === 0,
    violations,
  };
}
