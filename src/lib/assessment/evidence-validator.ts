import type { InterviewAssessment } from "./assessment-schema";
import type { AssessmentTranscriptTurn } from "./assessment-input";

export type AssessmentEvidenceValidationResult =
  | Readonly<{ ok: true; value: InterviewAssessment }>
  | Readonly<{ ok: false; message: string }>;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

export function validateAssessmentEvidence(
  assessment: InterviewAssessment,
  transcript: readonly AssessmentTranscriptTurn[],
): AssessmentEvidenceValidationResult {
  const transcriptBySequence = new Map<number, AssessmentTranscriptTurn>();

  for (const turn of transcript) {
    if (transcriptBySequence.has(turn.sequence)) {
      return { ok: false, message: "Transcript cannot contain duplicate sequences." };
    }
    transcriptBySequence.set(turn.sequence, turn);
  }

  for (const competency of assessment.competencies) {
    for (const citation of competency.evidence) {
      const turn = transcriptBySequence.get(citation.messageSequence);
      if (!turn) {
        return { ok: false, message: "Assessment evidence sequence does not exist in the transcript." };
      }
      if (turn.speaker !== "candidate") {
        return {
          ok: false,
          message: "Candidate-scored assessment evidence must cite a candidate transcript turn.",
        };
      }
      if (!normalizeWhitespace(turn.text).includes(normalizeWhitespace(citation.excerpt))) {
        return {
          ok: false,
          message: "Assessment evidence excerpt is not present in the cited transcript turn.",
        };
      }
    }
  }

  return { ok: true, value: assessment };
}
