export type InterviewType =
  | "screening"
  | "behavioral"
  | "technical"
  | "role_specific"
  | "leadership"
  | "case_study"
  | "system_design"
  | "values"
  | "custom";

export type InterviewerPersona =
  | "professional"
  | "friendly"
  | "direct"
  | "technical"
  | "conversational";

export type InterviewDifficulty = "easy" | "medium" | "hard";
export type QuestionMode = "fixed" | "semi_adaptive" | "adaptive";
export type FollowUpReason =
  | "clarify_ambiguity"
  | "request_example"
  | "explore_reasoning"
  | "missing_required_dimension";

export type InterviewerConfigInput = Readonly<{
  name: string;
  interviewType: string;
  persona: string;
  language: string;
  durationSeconds: number;
  difficulty: string;
  questionMode: string;
  guidelines: string;
  candidateInstructions: string;
  followUpPolicy: Readonly<{
    maxFollowUpsPerQuestion: number;
    allowedReasons: string[];
  }>;
}>;

export type ValidatedInterviewerConfigInput = Readonly<{
  name: string;
  interviewType: InterviewType;
  persona: InterviewerPersona;
  language: string;
  durationSeconds: number;
  difficulty: InterviewDifficulty;
  questionMode: QuestionMode;
  guidelines: string;
  candidateInstructions: string;
  followUpPolicy: Readonly<{
    maxFollowUpsPerQuestion: number;
    allowedReasons: FollowUpReason[];
  }>;
}>;

type ValidationResult =
  | Readonly<{ ok: true; value: ValidatedInterviewerConfigInput }>
  | Readonly<{ ok: false; message: string }>;

const INTERVIEW_TYPES = new Set<InterviewType>([
  "screening",
  "behavioral",
  "technical",
  "role_specific",
  "leadership",
  "case_study",
  "system_design",
  "values",
  "custom",
]);
const PERSONAS = new Set<InterviewerPersona>([
  "professional",
  "friendly",
  "direct",
  "technical",
  "conversational",
]);
const DIFFICULTIES = new Set<InterviewDifficulty>(["easy", "medium", "hard"]);
const QUESTION_MODES = new Set<QuestionMode>([
  "fixed",
  "semi_adaptive",
  "adaptive",
]);
const FOLLOW_UP_REASONS = new Set<FollowUpReason>([
  "clarify_ambiguity",
  "request_example",
  "explore_reasoning",
  "missing_required_dimension",
]);

function normalizeEnum(value: string): string {
  return value.trim().toLowerCase();
}

export function validateInterviewerConfigInput(
  input: InterviewerConfigInput,
): ValidationResult {
  const name = input.name.trim();
  if (!name) return { ok: false, message: "Interviewer name is required." };
  if (name.length > 200) {
    return {
      ok: false,
      message: "Interviewer name must be 200 characters or fewer.",
    };
  }

  const interviewType = normalizeEnum(input.interviewType);
  if (!INTERVIEW_TYPES.has(interviewType as InterviewType)) {
    return { ok: false, message: "Choose a supported interview type." };
  }

  const persona = normalizeEnum(input.persona);
  if (!PERSONAS.has(persona as InterviewerPersona)) {
    return { ok: false, message: "Choose a supported interviewer persona." };
  }

  const language = input.language.trim();
  if (!language || language.length > 35) {
    return {
      ok: false,
      message: "Interview language must be between 1 and 35 characters.",
    };
  }

  if (
    !Number.isInteger(input.durationSeconds) ||
    input.durationSeconds < 900 ||
    input.durationSeconds > 3600
  ) {
    return {
      ok: false,
      message: "Interview duration must be a whole number between 900 and 3600 seconds.",
    };
  }

  const difficulty = normalizeEnum(input.difficulty);
  if (!DIFFICULTIES.has(difficulty as InterviewDifficulty)) {
    return {
      ok: false,
      message: "Choose an interview difficulty of easy, medium, or hard.",
    };
  }

  const questionMode = normalizeEnum(input.questionMode);
  if (!QUESTION_MODES.has(questionMode as QuestionMode)) {
    return { ok: false, message: "Choose a supported question strategy." };
  }

  const guidelines = input.guidelines.trim();
  if (guidelines.length > 8000) {
    return {
      ok: false,
      message: "Interview guidelines must be 8000 characters or fewer.",
    };
  }

  const candidateInstructions = input.candidateInstructions.trim();
  if (candidateInstructions.length > 4000) {
    return {
      ok: false,
      message: "Candidate instructions must be 4000 characters or fewer.",
    };
  }

  if (
    !Number.isInteger(input.followUpPolicy.maxFollowUpsPerQuestion) ||
    input.followUpPolicy.maxFollowUpsPerQuestion < 0 ||
    input.followUpPolicy.maxFollowUpsPerQuestion > 2
  ) {
    return {
      ok: false,
      message: "Follow-up policy allows at most 2 follow-ups per question.",
    };
  }

  const allowedReasons = input.followUpPolicy.allowedReasons.map(normalizeEnum);
  if (
    allowedReasons.length > FOLLOW_UP_REASONS.size ||
    allowedReasons.some(
      (reason) => !FOLLOW_UP_REASONS.has(reason as FollowUpReason),
    )
  ) {
    return {
      ok: false,
      message: "Follow-up policy contains an unsupported reason.",
    };
  }

  return {
    ok: true,
    value: {
      name,
      interviewType: interviewType as InterviewType,
      persona: persona as InterviewerPersona,
      language,
      durationSeconds: input.durationSeconds,
      difficulty: difficulty as InterviewDifficulty,
      questionMode: questionMode as QuestionMode,
      guidelines,
      candidateInstructions,
      followUpPolicy: {
        maxFollowUpsPerQuestion: input.followUpPolicy.maxFollowUpsPerQuestion,
        allowedReasons: allowedReasons as FollowUpReason[],
      },
    },
  };
}
