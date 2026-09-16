import { describe, expect, it } from "vitest";

import { createAssessmentProvenance } from "./assessment-provenance";

const trusted = {
  attemptId: "attempt-1",
  generationId: "generation-1",
  provider: "gemini",
  model: "gemini-2.5-pro",
  promptVersion: "assessment-prompt-v1",
  guardrailVersion: "assessment-guardrails-v1",
  interviewerVersionId: "interviewer-version-1",
  rubricVersionId: "rubric-version-1",
  configVersionId: "config-version-1",
  transcriptSeal: "sha256:sealed-transcript",
  transcriptVersion: "transcript-v1",
} as const;

describe("createAssessmentProvenance", () => {
  it("constructs immutable application-owned provenance", () => {
    const provenance = createAssessmentProvenance(trusted);

    expect(provenance).toEqual(trusted);
    expect(Object.isFrozen(provenance)).toBe(true);
  });

  it.each([
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
  ] as const)("rejects blank %s", (field) => {
    expect(() => createAssessmentProvenance({ ...trusted, [field]: "   " })).toThrow(
      /provenance/i,
    );
  });

  it("does not accept model output as a provenance source", () => {
    const modelOutput = {
      provenance: {
        provider: "attacker-controlled-provider",
        model: "attacker-controlled-model",
        promptVersion: "forged",
      },
    };

    const provenance = createAssessmentProvenance(trusted, modelOutput);

    expect(provenance.provider).toBe(trusted.provider);
    expect(provenance.model).toBe(trusted.model);
    expect(provenance.promptVersion).toBe(trusted.promptVersion);
    expect(provenance).not.toHaveProperty("provenance");
  });
});
