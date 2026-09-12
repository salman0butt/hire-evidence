export type GuardrailViolationCode =
  | "protected_class"
  | "medical_disability"
  | "family_pregnancy"
  | "biometric_emotion"
  | "deception_detection"
  | "accent_language_bias"
  | "personality_proxy"
  | "autonomous_hiring_decision"
  | "policy_override";

export type GuardrailViolation = Readonly<{
  code: GuardrailViolationCode;
  message: string;
}>;

export type GuardrailValidationInput = Readonly<{
  jobText: string;
  guidelines: string;
  candidateInstructions: string;
}>;

export type GuardrailValidationResult = Readonly<{
  safe: boolean;
  violations: GuardrailViolation[];
}>;

type Rule = Readonly<{
  code: GuardrailViolationCode;
  message: string;
  patterns: readonly RegExp[];
}>;

const RULES: readonly Rule[] = [
  {
    code: "protected_class",
    message: "Hiring criteria cannot use protected-class characteristics.",
    patterns: [
      /\b(?:race|racial|religion|religious|gender|sex|sexual orientation|ethnicity|ethnic|nationality|national origin|age)\b/i,
    ],
  },
  {
    code: "medical_disability",
    message: "Interview criteria cannot rely on medical or disability information.",
    patterns: [
      /\b(?:disability|disabled|medical condition|medical history|health condition|mental health|diagnosis)\b/i,
    ],
  },
  {
    code: "family_pregnancy",
    message: "Interview criteria cannot rely on pregnancy or family-status information.",
    patterns: [
      /\b(?:pregnan(?:t|cy)|marital status|married|children|childcare|family status|family plans)\b/i,
    ],
  },
  {
    code: "biometric_emotion",
    message: "Biometric, appearance, or emotion inference cannot be used as hiring evidence.",
    patterns: [
      /\b(?:facial expression|face analysis|facial analysis|emotion detection|emotion recognition|biometric|appearance|looks attractive)\b/i,
    ],
  },
  {
    code: "deception_detection",
    message: "Deception or lie detection cannot be used as hiring evidence.",
    patterns: [
      /\b(?:lie detection|lie detector|detect lies|deception detection|detect deception|judge honesty from)\b/i,
    ],
  },
  {
    code: "accent_language_bias",
    message: "Accent or native-sounding speech cannot be used as a hiring criterion.",
    patterns: [
      /\b(?:accent|native sounding|native-sounding|sounds native|sound native)\b/i,
    ],
  },
  {
    code: "personality_proxy",
    message: "Personality labels cannot be used as a proxy for job-related evidence.",
    patterns: [
      /\b(?:introvert|extrovert|personality type|personality test|personality fit)\b/i,
    ],
  },
  {
    code: "autonomous_hiring_decision",
    message: "The interviewer cannot autonomously make hire or reject decisions.",
    patterns: [
      /\b(?:automatically|autonomously|without human review)\b.{0,40}\b(?:reject|hire|decline|disqualify)\b/i,
      /\b(?:reject|hire|decline|disqualify)\b.{0,40}\b(?:automatically|autonomously|without human review)\b/i,
    ],
  },
  {
    code: "policy_override",
    message: "Organization-authored text cannot override platform safety or fairness policy.",
    patterns: [
      /\bignore\b.{0,40}\b(?:platform|safety|fairness)\b.{0,20}\b(?:rule|rules|policy|policies|restriction|restrictions)\b/i,
      /\b(?:override|bypass|disable)\b.{0,30}\b(?:platform|safety|fairness)\b.{0,20}\b(?:rule|rules|policy|policies|guardrail|guardrails)\b/i,
    ],
  },
];

function normalizedText(input: GuardrailValidationInput): string {
  return [input.jobText, input.guidelines, input.candidateInstructions]
    .map((value) => value.trim())
    .filter(Boolean)
    .join("\n");
}

export function validateInterviewerGuardrails(
  input: GuardrailValidationInput,
): GuardrailValidationResult {
  const text = normalizedText(input);
  const violations = RULES.filter((rule) =>
    rule.patterns.some((pattern) => pattern.test(text)),
  ).map(({ code, message }) => ({ code, message }));

  return {
    safe: violations.length === 0,
    violations,
  };
}
