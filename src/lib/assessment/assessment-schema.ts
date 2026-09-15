export type AssessmentScore = 1 | 2 | 3 | 4 | 5 | null;
export type EvidenceSufficiency = "insufficient" | "partial" | "sufficient";
export type OverallEvidenceSufficiency = "low" | "medium" | "high";
export type QuestionCoverageStatus = "answered" | "partially_answered" | "skipped";

export type AssessmentEvidence = Readonly<{
  messageSequence: number;
  excerpt: string;
}>;

export type CompetencyAssessment = Readonly<{
  competencyId: string;
  score: AssessmentScore;
  rationale: string;
  evidence: readonly AssessmentEvidence[];
  evidenceSufficiency: EvidenceSufficiency;
}>;

export type QuestionCoverage = Readonly<{
  questionId: string;
  status: QuestionCoverageStatus;
  technicalInterruption: boolean;
}>;

export type InterviewAssessment = Readonly<{
  summary: string;
  competencies: readonly CompetencyAssessment[];
  strengths: readonly unknown[];
  concerns: readonly unknown[];
  unansweredAreas: readonly string[];
  questionCoverage: readonly QuestionCoverage[];
  evidenceSufficiency: OverallEvidenceSufficiency;
}>;

export type AssessmentValidationResult =
  | Readonly<{ ok: true; value: InterviewAssessment }>
  | Readonly<{ ok: false; message: string }>;

const DECISION_FIELDS = new Set([
  "decision",
  "hiringDecision",
  "recommendation",
  "outcome",
  "successProbability",
]);
const EVIDENCE_SUFFICIENCY = new Set(["insufficient", "partial", "sufficient"]);
const OVERALL_EVIDENCE_SUFFICIENCY = new Set(["low", "medium", "high"]);
const QUESTION_COVERAGE_STATUS = new Set(["answered", "partially_answered", "skipped"]);
const MAX_EVIDENCE_EXCERPT_LENGTH = 500;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
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

  if (Object.keys(value).some((key) => DECISION_FIELDS.has(key))) {
    return { ok: false, message: "Assessment cannot include autonomous hiring decision fields." };
  }

  if (!isNonEmptyString(value.summary)) {
    return { ok: false, message: "Assessment summary must be a non-empty string." };
  }

  if (!OVERALL_EVIDENCE_SUFFICIENCY.has(value.evidenceSufficiency as string)) {
    return { ok: false, message: "Overall evidence sufficiency is invalid." };
  }

  const competencyIds = new Set<string>();
  for (const competency of value.competencies) {
    if (!isRecord(competency) || !isAssessmentScore(competency.score)) {
      return { ok: false, message: "Competency score must be an integer from 1 to 5 or null." };
    }
    if (!isNonEmptyString(competency.competencyId)) {
      return { ok: false, message: "Competency ID must be a non-empty string." };
    }
    if (competencyIds.has(competency.competencyId)) {
      return { ok: false, message: "Assessment cannot contain duplicate competency IDs." };
    }
    competencyIds.add(competency.competencyId);
    if (!isNonEmptyString(competency.rationale)) {
      return { ok: false, message: "Competency rationale must be a non-empty string." };
    }
    if (!EVIDENCE_SUFFICIENCY.has(competency.evidenceSufficiency as string)) {
      return { ok: false, message: "Competency evidence sufficiency is invalid." };
    }
    if (competency.evidenceSufficiency === "insufficient" && competency.score !== null) {
      return { ok: false, message: "Insufficient competency evidence cannot have a score." };
    }
    if (!Array.isArray(competency.evidence)) {
      return { ok: false, message: "Competency evidence must be an array." };
    }
    const citationKeys = new Set<string>();
    for (const citation of competency.evidence) {
      if (
        !isRecord(citation) ||
        typeof citation.messageSequence !== "number" ||
        !Number.isInteger(citation.messageSequence) ||
        citation.messageSequence <= 0
      ) {
        return { ok: false, message: "Assessment evidence sequence must be a positive integer." };
      }
      if (
        !isNonEmptyString(citation.excerpt) ||
        citation.excerpt.length > MAX_EVIDENCE_EXCERPT_LENGTH
      ) {
        return { ok: false, message: "Assessment evidence excerpt must be non-empty and bounded." };
      }
      const citationKey = `${citation.messageSequence}\u0000${citation.excerpt}`;
      if (citationKeys.has(citationKey)) {
        return { ok: false, message: "Assessment evidence citations must be unique." };
      }
      citationKeys.add(citationKey);
    }
    if (
      competency.score !== null &&
      competency.evidenceSufficiency === "sufficient" &&
      competency.evidence.length === 0
    ) {
      return { ok: false, message: "A scored competency with sufficient evidence must cite evidence." };
    }
  }

  if (!Array.isArray(value.questionCoverage)) {
    return { ok: false, message: "Assessment must include question coverage." };
  }

  const questionIds = new Set<string>();
  for (const question of value.questionCoverage) {
    if (!isRecord(question) || !isNonEmptyString(question.questionId)) {
      return { ok: false, message: "Question ID must be a non-empty string." };
    }
    if (questionIds.has(question.questionId)) {
      return { ok: false, message: "Assessment cannot contain duplicate question IDs." };
    }
    questionIds.add(question.questionId);
    if (!QUESTION_COVERAGE_STATUS.has(question.status as string)) {
      return { ok: false, message: "Question coverage status is invalid." };
    }
    if (typeof question.technicalInterruption !== "boolean") {
      return { ok: false, message: "Question technical interruption flag must be boolean." };
    }
  }

  return { ok: true, value: value as InterviewAssessment };
}
