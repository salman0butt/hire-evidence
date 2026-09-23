import { describe, expect, it } from "vitest";

import { aggregateHumanDisagreement } from "./human-disagreement";

describe("aggregateHumanDisagreement", () => {
  it("aggregates calibration and disagreement signals without candidate-level ranking", () => {
    const analytics = aggregateHumanDisagreement([
      {
        criterionId: "system-design",
        aiOutcome: "meets",
        humanOutcome: "partially-meets",
        reason: "evidence-weight",
      },
      {
        criterionId: "system-design",
        aiOutcome: "meets",
        humanOutcome: "meets",
      },
      {
        criterionId: "debugging",
        aiOutcome: "insufficient",
        humanOutcome: "partially-meets",
        reason: "missed-evidence",
      },
    ]);

    expect(analytics.totalReviews).toBe(3);
    expect(analytics.disagreements).toBe(2);
    expect(analytics.disagreementRate).toBeCloseTo(2 / 3);
    expect(analytics.byCriterion).toEqual({
      debugging: { reviews: 1, disagreements: 1 },
      "system-design": { reviews: 2, disagreements: 1 },
    });
    expect(analytics.byReason).toEqual({ "evidence-weight": 1, "missed-evidence": 1 });
    expect(analytics).not.toHaveProperty("candidates");
    expect(analytics).not.toHaveProperty("ranking");
  });

  it("returns a finite zero rate for an empty aggregate", () => {
    expect(aggregateHumanDisagreement([])).toEqual({
      totalReviews: 0,
      disagreements: 0,
      disagreementRate: 0,
      byCriterion: {},
      byReason: {},
    });
  });

  it("rejects malformed or candidate-identifying analytics input", () => {
    expect(() =>
      aggregateHumanDisagreement([
        {
          criterionId: "system-design",
          aiOutcome: "meets",
          humanOutcome: "meets",
          candidateId: "candidate-123",
        } as never,
      ]),
    ).toThrow(/candidate|identifier|unsupported/i);

    expect(() =>
      aggregateHumanDisagreement([
        { criterionId: "", aiOutcome: "meets", humanOutcome: "meets" } as never,
      ]),
    ).toThrow(/criterion/i);
  });
});
