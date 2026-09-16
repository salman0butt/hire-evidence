import { describe, expect, it } from "vitest";

import type { InterviewAssessment } from "./assessment-schema";
import { validateAssessmentEvidence } from "./evidence-validator";
import type { AssessmentTranscriptTurn } from "./assessment-input";

function assessment(evidence: readonly { messageSequence: number; excerpt: string }[]): InterviewAssessment {
  return {
    summary: "Candidate explained a queue-based design.",
    competencies: [
      {
        competencyId: "system-design",
        score: 4,
        rationale: "The answer covered asynchronous processing.",
        evidence,
        evidenceSufficiency: "sufficient",
      },
    ],
    strengths: [],
    concerns: [],
    unansweredAreas: [],
    questionCoverage: [
      { questionId: "architecture", status: "answered", technicalInterruption: false },
    ],
    evidenceSufficiency: "high",
  };
}

const transcript: readonly AssessmentTranscriptTurn[] = [
  { sequence: 1, speaker: "interviewer", text: "How would you process work asynchronously?" },
  { sequence: 2, speaker: "candidate", text: "I would put the work on a queue and retry failed jobs." },
];

describe("validateAssessmentEvidence", () => {
  it("accepts candidate evidence from the sealed transcript", () => {
    const value = assessment([{ messageSequence: 2, excerpt: "work on a queue" }]);

    expect(validateAssessmentEvidence(value, transcript)).toEqual({ ok: true, value });
  });

  it("rejects a citation to a nonexistent transcript sequence", () => {
    expect(validateAssessmentEvidence(assessment([{ messageSequence: 99, excerpt: "queue" }]), transcript)).toEqual({
      ok: false,
      message: "Assessment evidence sequence does not exist in the transcript.",
    });
  });

  it("rejects interviewer text as evidence for a candidate-scored claim", () => {
    expect(
      validateAssessmentEvidence(
        assessment([{ messageSequence: 1, excerpt: "process work asynchronously" }]),
        transcript,
      ),
    ).toEqual({
      ok: false,
      message: "Candidate-scored assessment evidence must cite a candidate transcript turn.",
    });
  });

  it("rejects an excerpt that is absent from the cited candidate turn", () => {
    expect(validateAssessmentEvidence(assessment([{ messageSequence: 2, excerpt: "used Kafka" }]), transcript)).toEqual({
      ok: false,
      message: "Assessment evidence excerpt is not present in the cited transcript turn.",
    });
  });

  it("matches excerpts after harmless whitespace normalization", () => {
    expect(
      validateAssessmentEvidence(
        assessment([{ messageSequence: 2, excerpt: "work   on\n a queue" }]),
        transcript,
      ).ok,
    ).toBe(true);
  });

  it("rejects duplicate transcript sequences because evidence would be ambiguous", () => {
    expect(
      validateAssessmentEvidence(assessment([{ messageSequence: 2, excerpt: "queue" }]), [
        ...transcript,
        { sequence: 2, speaker: "candidate", text: "A conflicting durable turn." },
      ]),
    ).toEqual({
      ok: false,
      message: "Transcript cannot contain duplicate sequences.",
    });
  });

  it("fails the whole assessment when fabricated evidence is mixed with valid evidence", () => {
    expect(
      validateAssessmentEvidence(
        assessment([
          { messageSequence: 2, excerpt: "queue" },
          { messageSequence: 77, excerpt: "fabricated evidence" },
        ]),
        transcript,
      ),
    ).toEqual({
      ok: false,
      message: "Assessment evidence sequence does not exist in the transcript.",
    });
  });
});
