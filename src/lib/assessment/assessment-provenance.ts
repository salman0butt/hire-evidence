export type AssessmentProvenance = Readonly<{
  attemptId: string;
  generationId: string;
  provider: string;
  model: string;
  promptVersion: string;
  guardrailVersion: string;
  interviewerVersionId: string;
  rubricVersionId: string;
  configVersionId: string;
  transcriptSeal: string;
  transcriptVersion: string;
}>;

const provenanceFields = [
  "attemptId",
  "generationId",
  "provider",
  "model",
  "promptVersion",
  "guardrailVersion",
  "interviewerVersionId",
  "rubricVersionId",
  "configVersionId",
  "transcriptSeal",
  "transcriptVersion",
] as const satisfies readonly (keyof AssessmentProvenance)[];

export function createAssessmentProvenance(
  trusted: AssessmentProvenance,
  _modelOutput?: unknown,
): AssessmentProvenance {
  for (const field of provenanceFields) {
    if (trusted[field].trim().length === 0) {
      throw new Error(`Assessment provenance ${field} must not be blank`);
    }
  }

  return Object.freeze({ ...trusted });
}
