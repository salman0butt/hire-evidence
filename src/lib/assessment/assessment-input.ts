export type AssessmentRubricLevel = Readonly<{
  score: number;
  description: string;
}>;

export type AssessmentCompetencyInput = Readonly<{
  id: string;
  name: string;
  rubric: readonly AssessmentRubricLevel[];
}>;

export type AssessmentQuestionInput = Readonly<{
  id: string;
  text: string;
}>;

export type AssessmentTranscriptTurn = Readonly<{
  sequence: number;
  speaker: "candidate" | "interviewer";
  text: string;
}>;

export type AssessmentTechnicalInterruption = Readonly<Record<string, unknown>>;

export type AssessmentInputSnapshot = Readonly<{
  organizationId: string;
  attemptId: string;
  jobId: string;
  interviewerVersionId: string;
  competencies: readonly AssessmentCompetencyInput[];
  questions: readonly AssessmentQuestionInput[];
  transcript: readonly AssessmentTranscriptTurn[];
  technicalInterruptions: readonly AssessmentTechnicalInterruption[];
  promptVersion: string;
  guardrailVersion: string;
  modelVersion: string;
}>;

type AssessmentInputSource = AssessmentInputSnapshot & Readonly<Record<string, unknown>>;

function freezeArray<T extends object>(items: readonly T[]): readonly Readonly<T>[] {
  return Object.freeze(items.map((item) => Object.freeze({ ...item })));
}

export function createAssessmentInputSnapshot(input: AssessmentInputSource): AssessmentInputSnapshot {
  const competencies = Object.freeze(
    input.competencies.map((competency) =>
      Object.freeze({
        id: competency.id,
        name: competency.name,
        rubric: freezeArray(competency.rubric),
      }),
    ),
  );

  return Object.freeze({
    organizationId: input.organizationId,
    attemptId: input.attemptId,
    jobId: input.jobId,
    interviewerVersionId: input.interviewerVersionId,
    competencies,
    questions: freezeArray(input.questions),
    transcript: freezeArray(input.transcript),
    technicalInterruptions: freezeArray(input.technicalInterruptions),
    promptVersion: input.promptVersion,
    guardrailVersion: input.guardrailVersion,
    modelVersion: input.modelVersion,
  });
}
