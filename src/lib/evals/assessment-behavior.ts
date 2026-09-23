export type AssessmentRubricCriterion = {
  id: string;
  maxScore: number;
};

export type AssessmentEvidence = {
  id: string;
  rubricId: string;
  text: string;
};

export type AssessmentOutcome = {
  rubricId: string;
  score: number | null;
  evidenceIds: string[];
};

export type AssessmentBehaviorInput = {
  rubric: AssessmentRubricCriterion[];
  evidence: AssessmentEvidence[];
  evidenceSufficiency: "sufficient" | "insufficient";
  outcomes: AssessmentOutcome[];
  technicalFailure: boolean;
};

export type AssessmentBehaviorViolation =
  | "unknown_rubric"
  | "score_out_of_bounds"
  | "invalid_evidence_citation"
  | "insufficient_evidence_scored";

export type AssessmentBehaviorResult = {
  passed: boolean;
  violations: AssessmentBehaviorViolation[];
  technicalFailure: boolean;
};

export function evaluateAssessmentBehavior(
  input: AssessmentBehaviorInput,
): AssessmentBehaviorResult {
  const violations = new Set<AssessmentBehaviorViolation>();
  const rubric = new Map(input.rubric.map((criterion) => [criterion.id, criterion]));
  const evidence = new Map(input.evidence.map((item) => [item.id, item]));

  for (const outcome of input.outcomes) {
    const criterion = rubric.get(outcome.rubricId);

    if (!criterion) {
      violations.add("unknown_rubric");
    } else if (
      outcome.score !== null &&
      (!Number.isFinite(outcome.score) || outcome.score < 0 || outcome.score > criterion.maxScore)
    ) {
      violations.add("score_out_of_bounds");
    }

    for (const evidenceId of outcome.evidenceIds) {
      const cited = evidence.get(evidenceId);
      if (!cited || cited.rubricId !== outcome.rubricId) {
        violations.add("invalid_evidence_citation");
      }
    }

    if (input.evidenceSufficiency === "insufficient" && outcome.score !== null) {
      violations.add("insufficient_evidence_scored");
    }
  }

  return {
    passed: violations.size === 0,
    violations: [...violations],
    technicalFailure: input.technicalFailure,
  };
}
