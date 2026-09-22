import { describe, expect, it } from "vitest";

import {
  defineGoldenInterviewDataset,
  type GoldenInterviewFixture,
} from "./golden-interviews";

const fixture = (overrides: Partial<GoldenInterviewFixture> = {}): GoldenInterviewFixture => ({
  id: "interview-normal-01",
  version: "1.0.0",
  category: "normal",
  provenance: "synthetic",
  transcript: [
    { sequence: 1, speaker: "interviewer", text: "Tell me about a production incident you handled." },
    { sequence: 2, speaker: "candidate", text: "I rolled back, checked metrics, and documented the root cause." },
  ],
  expected: { technicalFailure: false, evidenceSufficiency: "sufficient" },
  ...overrides,
});

describe("golden interview dataset", () => {
  it("preserves versioned synthetic fixtures in deterministic order", () => {
    const dataset = defineGoldenInterviewDataset({
      id: "golden-interviews",
      version: "1.0.0",
      fixtures: [
        fixture(),
        fixture({
          id: "interview-insufficient-01",
          category: "insufficient-evidence",
          transcript: [{ sequence: 1, speaker: "candidate", text: "I do not have an example." }],
          expected: { technicalFailure: false, evidenceSufficiency: "insufficient" },
        }),
      ],
    });

    expect(dataset.fixtures.map((item) => item.id)).toEqual([
      "interview-normal-01",
      "interview-insufficient-01",
    ]);
    expect(dataset.fixtures.every((item) => item.provenance === "synthetic" || item.provenance === "de-identified")).toBe(true);
  });

  it("rejects duplicate fixture ids", () => {
    expect(() =>
      defineGoldenInterviewDataset({
        id: "golden-interviews",
        version: "1.0.0",
        fixtures: [fixture(), fixture()],
      }),
    ).toThrow(/duplicate.*interview-normal-01/i);
  });

  it("rejects unsafe or malformed fixture evidence", () => {
    expect(() =>
      defineGoldenInterviewDataset({
        id: "golden-interviews",
        version: "1.0.0",
        fixtures: [fixture({ provenance: "production" as GoldenInterviewFixture["provenance"] })],
      }),
    ).toThrow(/provenance/i);

    expect(() =>
      defineGoldenInterviewDataset({
        id: "golden-interviews",
        version: "1.0.0",
        fixtures: [
          fixture({
            transcript: [
              { sequence: 1, speaker: "candidate", text: "first" },
              { sequence: 1, speaker: "interviewer", text: "duplicate sequence" },
            ],
          }),
        ],
      }),
    ).toThrow(/sequence/i);
  });

  it("represents interruption and boundary cases without converting technical failure into candidate evidence", () => {
    const dataset = defineGoldenInterviewDataset({
      id: "golden-interviews",
      version: "1.0.0",
      fixtures: [
        fixture({
          id: "interview-interruption-01",
          category: "interruption",
          expected: { technicalFailure: true, evidenceSufficiency: "insufficient" },
        }),
        fixture({
          id: "interview-boundary-01",
          category: "boundary",
          transcript: [{ sequence: 1, speaker: "candidate", text: "" }],
          expected: { technicalFailure: false, evidenceSufficiency: "insufficient" },
        }),
      ],
    });

    expect(dataset.fixtures[0]?.expected).toEqual({
      technicalFailure: true,
      evidenceSufficiency: "insufficient",
    });
    expect(dataset.fixtures[1]?.category).toBe("boundary");
  });
});
