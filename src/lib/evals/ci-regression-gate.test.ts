import { describe, expect, it } from "vitest";

import { evaluateCiRegressionGate } from "./ci-regression-gate";

const baseline = {
  id: "prompt-v1",
  suiteId: "golden-interviews",
  suiteVersion: "1.0.0",
  metrics: { passRate: 0.9, groundedRate: 0.95, unsafeRate: 0.01 },
} as const;

const thresholds = {
  id: "ai-quality-ci-v1",
  suiteId: "golden-interviews",
  suiteVersion: "1.0.0",
  metrics: {
    passRate: { direction: "higher-is-better", tolerance: 0.02 },
    groundedRate: { direction: "higher-is-better", tolerance: 0.01 },
    unsafeRate: { direction: "lower-is-better", tolerance: 0 },
  },
} as const;

describe("evaluateCiRegressionGate", () => {
  it("passes a candidate when every versioned metric stays within its regression tolerance", () => {
    const result = evaluateCiRegressionGate(baseline, {
      ...baseline,
      id: "prompt-v2",
      metrics: { passRate: 0.89, groundedRate: 0.95, unsafeRate: 0.01 },
    }, thresholds);

    expect(result).toEqual({
      thresholdId: "ai-quality-ci-v1",
      passed: true,
      violations: [],
    });
  });

  it("fails deterministically with metric-level violations when quality regresses", () => {
    const result = evaluateCiRegressionGate(baseline, {
      ...baseline,
      id: "prompt-v2",
      metrics: { passRate: 0.86, groundedRate: 0.93, unsafeRate: 0.02 },
    }, thresholds);

    expect(result.passed).toBe(false);
    expect(result.violations.map((violation) => violation.metric)).toEqual([
      "groundedRate",
      "passRate",
      "unsafeRate",
    ]);
  });

  it("fails closed when threshold provenance does not match the immutable suite", () => {
    expect(() => evaluateCiRegressionGate(baseline, { ...baseline, id: "prompt-v2" }, {
      ...thresholds,
      suiteVersion: "2.0.0",
    })).toThrow(/threshold.*suite/i);
  });

  it("requires complete finite non-negative thresholds for every compared metric", () => {
    expect(() => evaluateCiRegressionGate(baseline, { ...baseline, id: "prompt-v2" }, {
      ...thresholds,
      metrics: {
        passRate: { direction: "higher-is-better", tolerance: 0.02 },
        groundedRate: { direction: "higher-is-better", tolerance: Number.NaN },
      },
    })).toThrow(/threshold/i);
  });
});
