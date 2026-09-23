import { describe, expect, it } from "vitest";

import { compareEvalVersions } from "./version-regression";

describe("compareEvalVersions", () => {
  const baseline = {
    id: "prompt-v1",
    suiteId: "golden-interviews",
    suiteVersion: "1.0.0",
    metrics: { passRate: 0.9, groundedRate: 0.95, unsafeRate: 0 },
  } as const;

  it("compares immutable suite versions with explicit metric deltas", () => {
    const comparison = compareEvalVersions(baseline, {
      ...baseline,
      id: "prompt-v2",
      metrics: { passRate: 0.95, groundedRate: 0.93, unsafeRate: 0 },
    });

    expect(comparison.baselineId).toBe("prompt-v1");
    expect(comparison.candidateId).toBe("prompt-v2");
    expect(comparison.deltas).toEqual({ passRate: 0.05, groundedRate: -0.02, unsafeRate: 0 });
  });

  it("rejects comparisons across different suite identities or versions", () => {
    expect(() =>
      compareEvalVersions(baseline, { ...baseline, id: "prompt-v2", suiteVersion: "2.0.0" }),
    ).toThrow(/same immutable suite/i);
  });

  it("requires an explicit distinct baseline and candidate", () => {
    expect(() => compareEvalVersions(baseline, baseline)).toThrow(/distinct/i);
  });

  it("rejects missing, non-finite, or mismatched metrics instead of silently comparing partial data", () => {
    expect(() =>
      compareEvalVersions(baseline, {
        ...baseline,
        id: "prompt-v2",
        metrics: { passRate: 0.95, groundedRate: Number.NaN },
      }),
    ).toThrow(/metrics/i);
  });
});
