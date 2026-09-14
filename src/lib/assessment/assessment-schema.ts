export type AssessmentScore = 1 | 2 | 3 | 4 | 5 | null;

export type AssessmentEvidence = Readonly<{
  messageSequence: number;
  excerpt: string;
}>;

export type CompetencyAssessment = Readonly<{
  competencyId: string;
  score: AssessmentScore;
  rationale: string;
  evidence: readonly AssessmentEvidence[];
  evidenceSufficiency: "insufficient" | "partial" | "sufficient";
}>;

export type InterviewAssessment = Readonly<{
  summary: string;
  competencies: readonly CompetencyAssessment[];
  strengths: readonly unknown[];
  concerns: readonly unknown[];
  unansweredAreas: readonly string[];
  questionCoverage: readonly unknown[];
  evidenceSufficiency: "low" | "medium" | "high";
}>;

export type AssessmentValidationResult =
  | Readonly<{ ok: true; value: InterviewAssessment }>
  | Readonly<{ ok: false; message: string }>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isAssessmentScore(value: unknown): value is AssessmentScore {
  return (
    value === null ||
    (typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 5)
  );
}

export function parseInterviewAssessment(value: unknown): AssessmentValidationResult {
  if (!isRecord(value) || !Array.isArray(value.competencies)) {
    return { ok: false, message: "Assessment must include competencies." };
  }

  for (const competency of value.competencies) {
    if (!isRecord(competency) || !isAssessmentScore(competency.score)) {
      return {
        ok: false,
        message: "Competency score must be an integer from 1 to 5 or null.",
      };
    }

    if (
      competency.evidenceSufficiency === "insufficient" &&
      competency.score !== null
    ) {
      return {
        ok: false,
        message: "Insufficient competency evidence cannot have a score.",
      };
    }
  }

  return { ok: true, value: value as InterviewAssessment };
}
