import { describe, expect, it } from "vitest";

import {
  defineGoldenAssessmentDataset,
  type GoldenAssessmentFixture,
} from "./golden-assessments";

const fixture = (overrides: Partial<GoldenAssessmentFixture> = {}): GoldenAssessmentFixture => ({
  id: "assessment-grounded-01",
  version: "1.0.0",
  provenance: "synthetic",
  rubric: [
    { id: "incident-response", label: "Incident response", maxScore: 4 },
  ],
  evidence: [
    { id: "evidence-1", rubricId: "incident-response", text: "Candidate described rollback, metrics checks, and root-cause documentation." },
  ],
  expected: {
    evidenceSufficiency: "sufficient",
    rubricOutcomes: [{ rubricId: "incident-response", score: 3 }],
  },
  humanCalibration: {
    reviewerCount: 2,
    scoreRange: { min: 2, max: 3 },
    consensus: "partial",
  },
  ...overrides,
});

describe("golden assessment dataset", () => {
  it("preserves deterministic versioned fixtures and explicit human calibration uncertainty", () => {
    const dataset = defineGoldenAssessmentDataset({
      id: "golden-assessments",
      version: "1.0.0",
      fixtures: [fixture(), fixture({ id: "assessment-insufficient-01", expected: { evidenceSufficiency: "insufficient", rubricOutcomes: [{ rubricId: "incident-response", score: null }] } })],
    });

    expect(dataset.fixtures.map((item) => item.id)).toEqual(["assessment-grounded-01", "assessment-insufficient-01"]);
    expect(dataset.fixtures[0]?.humanCalibration).toEqual({ reviewerCount: 2, scoreRange: { min: 2, max: 3 }, consensus: "partial" });
  });

  it("rejects duplicate fixture, rubric, and evidence ids", () => {
    expect(() => defineGoldenAssessmentDataset({ id: "golden-assessments", version: "1.0.0", fixtures: [fixture(), fixture()] })).toThrow(/duplicate.*assessment-grounded-01/i);
    expect(() => defineGoldenAssessmentDataset({ id: "golden-assessments", version: "1.0.0", fixtures: [fixture({ rubric: [{ id: "same", label: "A", maxScore: 4 }, { id: "same", label: "B", maxScore: 4 }] })] })).toThrow(/rubric/i);
    expect(() => defineGoldenAssessmentDataset({ id: "golden-assessments", version: "1.0.0", fixtures: [fixture({ evidence: [{ id: "same", rubricId: "incident-response", text: "a" }, { id: "same", rubricId: "incident-response", text: "b" }] })] })).toThrow(/evidence/i);
  });

  it("rejects evidence and outcomes that reference unknown rubric criteria", () => {
    expect(() => defineGoldenAssessmentDataset({ id: "golden-assessments", version: "1.0.0", fixtures: [fixture({ evidence: [{ id: "evidence-1", rubricId: "missing", text: "unsupported" }] })] })).toThrow(/rubric/i);
    expect(() => defineGoldenAssessmentDataset({ id: "golden-assessments", version: "1.0.0", fixtures: [fixture({ expected: { evidenceSufficiency: "sufficient", rubricOutcomes: [{ rubricId: "missing", score: 3 }] } })] })).toThrow(/rubric/i);
  });

  it("requires insufficient evidence to remain unscored and calibration to stay bounded", () => {
    expect(() => defineGoldenAssessmentDataset({ id: "golden-assessments", version: "1.0.0", fixtures: [fixture({ expected: { evidenceSufficiency: "insufficient", rubricOutcomes: [{ rubricId: "incident-response", score: 2 }] } })] })).toThrow(/insufficient/i);
    expect(() => defineGoldenAssessmentDataset({ id: "golden-assessments", version: "1.0.0", fixtures: [fixture({ humanCalibration: { reviewerCount: 1, scoreRange: { min: 5, max: 2 }, consensus: "none" } })] })).toThrow(/calibration/i);
  });
});
