export type AssessmentGuardrailInput = {
  summary: string;
  strengths: string[];
  concerns: string[];
  evidenceExcerpts?: string[];
};

export type AssessmentGuardrailResult =
  | { ok: true }
  | { ok: false; message: string };

const prohibitedPatterns: ReadonlyArray<{ pattern: RegExp; reason: string }> = [
  { pattern: /\bstrong\s+hire\b/i, reason: "autonomous hiring recommendation" },
  { pattern: /\breject\s+(?:this|the)\s+candidate\b/i, reason: "autonomous rejection recommendation" },
  { pattern: /\b\d+(?:\.\d+)?%\s+probability\b/i, reason: "candidate success probability" },
  { pattern: /\baccent\b/i, reason: "accent inference" },
  { pattern: /\b(?:facial\s+expression|appearance)\b/i, reason: "appearance or biometric inference" },
  { pattern: /\bdeception\b/i, reason: "deception inference" },
  { pattern: /\bemotion(?:al|ally)?\b/i, reason: "emotion inference" },
  { pattern: /\bpersonality\b/i, reason: "personality inference" },
  { pattern: /\bculture\s+fit\b/i, reason: "culture-fit inference" },
  { pattern: /\bhealth\s+condition\b/i, reason: "health inference" },
  { pattern: /\bpolitical\s+(?:beliefs?|views?|affiliation)\b/i, reason: "political inference" },
  { pattern: /\bunion\s+membership\b/i, reason: "union-membership inference" },
];

export function validateAssessmentGuardrails(
  assessment: AssessmentGuardrailInput,
): AssessmentGuardrailResult {
  // Evidence excerpts are intentionally excluded: transcript evidence is untrusted
  // candidate data and must never be interpreted as model rationale or instructions.
  const evaluativeText = [assessment.summary, ...assessment.strengths, ...assessment.concerns];

  for (const text of evaluativeText) {
    for (const prohibited of prohibitedPatterns) {
      if (prohibited.pattern.test(text)) {
        return {
          ok: false,
          message: `Assessment contains prohibited ${prohibited.reason}.`,
        };
      }
    }
  }

  return { ok: true };
}
