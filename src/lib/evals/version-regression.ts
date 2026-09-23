export interface EvalVersionResult {
  id: string;
  suiteId: string;
  suiteVersion: string;
  metrics: Readonly<Record<string, number>>;
}

export interface EvalVersionComparison {
  baselineId: string;
  candidateId: string;
  deltas: Record<string, number>;
}

function validateMetrics(
  baseline: Readonly<Record<string, number>>,
  candidate: Readonly<Record<string, number>>,
): string[] {
  const baselineKeys = Object.keys(baseline).sort();
  const candidateKeys = Object.keys(candidate).sort();

  if (
    baselineKeys.length === 0 ||
    baselineKeys.length !== candidateKeys.length ||
    baselineKeys.some((key, index) => key !== candidateKeys[index])
  ) {
    throw new Error("Eval metrics must be present and identical for baseline and candidate");
  }

  for (const key of baselineKeys) {
    const baselineValue = baseline[key];
    const candidateValue = candidate[key];
    if (
      baselineValue === undefined ||
      candidateValue === undefined ||
      !Number.isFinite(baselineValue) ||
      !Number.isFinite(candidateValue)
    ) {
      throw new Error("Eval metrics must contain only finite numeric values");
    }
  }

  return baselineKeys;
}

export function compareEvalVersions(
  baseline: EvalVersionResult,
  candidate: EvalVersionResult,
): EvalVersionComparison {
  if (baseline.id === candidate.id) {
    throw new Error("Baseline and candidate eval versions must be distinct");
  }

  if (
    baseline.suiteId !== candidate.suiteId ||
    baseline.suiteVersion !== candidate.suiteVersion
  ) {
    throw new Error("Eval versions must use the same immutable suite identity and version");
  }

  const metricKeys = validateMetrics(baseline.metrics, candidate.metrics);
  const deltas: Record<string, number> = {};

  for (const key of metricKeys) {
    const baselineValue = baseline.metrics[key];
    const candidateValue = candidate.metrics[key];
    if (baselineValue === undefined || candidateValue === undefined) {
      throw new Error("Validated eval metrics unexpectedly missing");
    }
    // Round away floating-point representation noise while preserving meaningful eval precision.
    deltas[key] = Number((candidateValue - baselineValue).toFixed(12));
  }

  return {
    baselineId: baseline.id,
    candidateId: candidate.id,
    deltas,
  };
}
