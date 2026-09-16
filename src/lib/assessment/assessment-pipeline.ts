import type { AssessmentInputSnapshot } from "./assessment-input";
import { validateAssessmentGuardrails } from "./assessment-guardrails";
import { parseInterviewAssessment, type InterviewAssessment } from "./assessment-schema";
import { validateAssessmentEvidence } from "./evidence-validator";
import { calculateStructuredRubricScore, validateRubricScores } from "./rubric-scoring";

export type AssessmentPipelineResult =
  | Readonly<{ ok: true; value: InterviewAssessment; rubricScore: number | null }>
  | Readonly<{ ok: false; message: string }>;

export function validateAssessmentPipeline(
  modelOutput: unknown,
  snapshot: AssessmentInputSnapshot,
): AssessmentPipelineResult {
  const parsed = parseInterviewAssessment(modelOutput);
  if (!parsed.ok) return parsed;

  const rubricCompetencies = snapshot.competencies.map((competency) => ({
    id: competency.id,
    weight: 1,
    rubric: competency.rubric,
  }));
  const rubric = validateRubricScores(parsed.value.competencies, rubricCompetencies);
  if (!rubric.ok) return rubric;

  const evidence = validateAssessmentEvidence(parsed.value, snapshot.transcript);
  if (!evidence.ok) return evidence;

  const guardrails = validateAssessmentGuardrails({
    summary: parsed.value.summary,
    strengths: parsed.value.strengths.filter((value): value is string => typeof value === "string"),
    concerns: parsed.value.concerns.filter((value): value is string => typeof value === "string"),
    rationales: parsed.value.competencies.map((competency) => competency.rationale),
    evidenceExcerpts: parsed.value.competencies.flatMap((competency) =>
      competency.evidence.map((citation) => citation.excerpt),
    ),
  });
  if (!guardrails.ok) return guardrails;

  const structuredScore = calculateStructuredRubricScore(
    parsed.value.competencies,
    rubricCompetencies,
  );

  return {
    ok: true,
    value: parsed.value,
    rubricScore: structuredScore.available ? structuredScore.score : null,
  };
}
