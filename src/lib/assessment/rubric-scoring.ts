import type { CompetencyAssessment } from "./assessment-schema";

type RubricLevel = Readonly<{
  score: number;
  description: string;
}>;

type ConfiguredCompetency = Readonly<{
  id: string;
  weight: number;
  rubric: readonly RubricLevel[];
}>;

type ValidationResult = Readonly<{ ok: true }> | Readonly<{ ok: false; message: string }>;

export function validateRubricScores(
  assessments: readonly CompetencyAssessment[],
  configuredCompetencies: readonly ConfiguredCompetency[],
): ValidationResult {
  const configuredById = new Map(configuredCompetencies.map((competency) => [competency.id, competency]));
  const assessedIds = new Set<string>();

  for (const assessment of assessments) {
    const configured = configuredById.get(assessment.competencyId);
    if (!configured) {
      return { ok: false, message: "Assessment contains an unknown competency ID." };
    }
    assessedIds.add(assessment.competencyId);

    if (assessment.evidenceSufficiency === "insufficient" && assessment.score !== null) {
      return { ok: false, message: "Insufficient evidence cannot produce a competency score." };
    }

    if (
      assessment.score !== null &&
      !configured.rubric.some((level) => level.score === assessment.score)
    ) {
      return { ok: false, message: "Competency score does not have a configured rubric level." };
    }
  }

  if (configuredCompetencies.some((competency) => !assessedIds.has(competency.id))) {
    return { ok: false, message: "Assessment is missing a configured competency." };
  }

  return { ok: true };
}

export function calculateStructuredRubricScore(
  assessments: readonly CompetencyAssessment[],
  configuredCompetencies: readonly ConfiguredCompetency[],
): Readonly<{ available: boolean; score: number | null }> {
  if (!validateRubricScores(assessments, configuredCompetencies).ok) {
    return { available: false, score: null };
  }

  if (assessments.some((assessment) => assessment.score === null)) {
    return { available: false, score: null };
  }

  const assessmentById = new Map(assessments.map((assessment) => [assessment.competencyId, assessment]));
  const totalWeight = configuredCompetencies.reduce((sum, competency) => sum + competency.weight, 0);
  if (totalWeight <= 0) {
    return { available: false, score: null };
  }

  const weightedScore = configuredCompetencies.reduce((sum, competency) => {
    const score = assessmentById.get(competency.id)?.score;
    return sum + (score ?? 0) * competency.weight;
  }, 0);

  return { available: true, score: weightedScore / totalWeight };
}
