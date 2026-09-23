export type GoldenAssessmentProvenance = "synthetic" | "de-identified";

export type GoldenAssessmentRubricCriterion = {
  id: string;
  label: string;
  maxScore: number;
};

export type GoldenAssessmentEvidence = {
  id: string;
  rubricId: string;
  text: string;
};

export type GoldenAssessmentRubricOutcome = {
  rubricId: string;
  score: number | null;
};

export type GoldenAssessmentHumanCalibration = {
  reviewerCount: number;
  scoreRange: { min: number; max: number };
  consensus: "full" | "partial" | "none";
};

export type GoldenAssessmentFixture = {
  id: string;
  version: string;
  provenance: GoldenAssessmentProvenance;
  rubric: GoldenAssessmentRubricCriterion[];
  evidence: GoldenAssessmentEvidence[];
  expected: {
    evidenceSufficiency: "sufficient" | "insufficient";
    rubricOutcomes: GoldenAssessmentRubricOutcome[];
  };
  humanCalibration: GoldenAssessmentHumanCalibration;
};

export type GoldenAssessmentDataset = {
  id: string;
  version: string;
  fixtures: GoldenAssessmentFixture[];
};

function assertUniqueIds(items: { id: string }[], kind: string, fixtureId: string) {
  const ids = new Set<string>();
  for (const item of items) {
    if (ids.has(item.id)) {
      throw new Error(`Duplicate ${kind} id in golden assessment fixture ${fixtureId}: ${item.id}`);
    }
    ids.add(item.id);
  }
}

export function defineGoldenAssessmentDataset(
  dataset: GoldenAssessmentDataset,
): GoldenAssessmentDataset {
  const fixtureIds = new Set<string>();

  for (const fixture of dataset.fixtures) {
    if (fixtureIds.has(fixture.id)) {
      throw new Error(`Duplicate golden assessment fixture id: ${fixture.id}`);
    }
    fixtureIds.add(fixture.id);

    if (fixture.provenance !== "synthetic" && fixture.provenance !== "de-identified") {
      throw new Error(`Unsafe provenance for golden assessment fixture: ${fixture.id}`);
    }

    assertUniqueIds(fixture.rubric, "rubric", fixture.id);
    assertUniqueIds(fixture.evidence, "evidence", fixture.id);
    const rubricById = new Map(fixture.rubric.map((criterion) => [criterion.id, criterion]));

    for (const criterion of fixture.rubric) {
      if (!Number.isFinite(criterion.maxScore) || criterion.maxScore < 0) {
        throw new Error(`Invalid rubric score bound in golden assessment fixture: ${fixture.id}`);
      }
    }

    for (const evidence of fixture.evidence) {
      if (!rubricById.has(evidence.rubricId)) {
        throw new Error(`Evidence references unknown rubric criterion in golden assessment fixture: ${fixture.id}`);
      }
    }

    const outcomeRubricIds = new Set<string>();
    for (const outcome of fixture.expected.rubricOutcomes) {
      const criterion = rubricById.get(outcome.rubricId);
      if (!criterion) {
        throw new Error(`Outcome references unknown rubric criterion in golden assessment fixture: ${fixture.id}`);
      }
      if (outcomeRubricIds.has(outcome.rubricId)) {
        throw new Error(`Duplicate rubric outcome in golden assessment fixture: ${fixture.id}`);
      }
      outcomeRubricIds.add(outcome.rubricId);

      if (fixture.expected.evidenceSufficiency === "insufficient" && outcome.score !== null) {
        throw new Error(`Insufficient evidence must remain unscored in golden assessment fixture: ${fixture.id}`);
      }
      if (
        outcome.score !== null &&
        (!Number.isFinite(outcome.score) || outcome.score < 0 || outcome.score > criterion.maxScore)
      ) {
        throw new Error(`Outcome score exceeds rubric bounds in golden assessment fixture: ${fixture.id}`);
      }
    }

    const calibration = fixture.humanCalibration;
    if (
      !Number.isSafeInteger(calibration.reviewerCount) ||
      calibration.reviewerCount < 1 ||
      !Number.isFinite(calibration.scoreRange.min) ||
      !Number.isFinite(calibration.scoreRange.max) ||
      calibration.scoreRange.min < 0 ||
      calibration.scoreRange.max < calibration.scoreRange.min
    ) {
      throw new Error(`Invalid human calibration in golden assessment fixture: ${fixture.id}`);
    }
  }

  return {
    ...dataset,
    fixtures: dataset.fixtures.map((fixture) => ({
      ...fixture,
      rubric: fixture.rubric.map((criterion) => ({ ...criterion })),
      evidence: fixture.evidence.map((item) => ({ ...item })),
      expected: {
        ...fixture.expected,
        rubricOutcomes: fixture.expected.rubricOutcomes.map((outcome) => ({ ...outcome })),
      },
      humanCalibration: {
        ...fixture.humanCalibration,
        scoreRange: { ...fixture.humanCalibration.scoreRange },
      },
    })),
  };
}
