export type QuestionDifficulty = "easy" | "medium" | "hard";

export type QuestionInput = Readonly<{
  questionText: string;
  difficulty: string;
  expectedAreas: string[];
  followUpHints: string[];
  maxDurationSeconds: number;
  isRequired: boolean;
  position: number;
}>;

export type ValidatedQuestionInput = Readonly<{
  questionText: string;
  difficulty: QuestionDifficulty;
  expectedAreas: string[];
  followUpHints: string[];
  maxDurationSeconds: number;
  isRequired: boolean;
  position: number;
}>;

type ValidationResult =
  | Readonly<{ ok: true; value: ValidatedQuestionInput }>
  | Readonly<{ ok: false; message: string }>;

const DIFFICULTIES = new Set<QuestionDifficulty>(["easy", "medium", "hard"]);

function normalizeList(
  values: string[],
  label: "expected area" | "follow-up hint",
): { ok: true; value: string[] } | { ok: false; message: string } {
  const itemLabel = label === "expected area" ? "expected area" : "follow-up hint";
  const collectionLabel =
    label === "expected area" ? "Expected areas" : "Follow-up hints";

  if (values.length > 20) {
    return {
      ok: false,
      message: `${collectionLabel} cannot contain more than 20 items.`,
    };
  }

  const normalized = values.map((value) => value.trim());
  if (normalized.some((value) => value.length < 1 || value.length > 500)) {
    return {
      ok: false,
      message: `Each ${itemLabel} must be between 1 and 500 characters.`,
    };
  }

  return { ok: true, value: normalized };
}

export function validateQuestionInput(input: QuestionInput): ValidationResult {
  const questionText = input.questionText.trim();
  if (questionText.length < 1) {
    return { ok: false, message: "Question text is required." };
  }
  if (questionText.length > 4000) {
    return {
      ok: false,
      message: "Question text must be 4000 characters or fewer.",
    };
  }

  const difficulty = input.difficulty.trim().toLowerCase();
  if (!DIFFICULTIES.has(difficulty as QuestionDifficulty)) {
    return {
      ok: false,
      message: "Question difficulty must be easy, medium, or hard.",
    };
  }

  const expectedAreas = normalizeList(input.expectedAreas, "expected area");
  if (!expectedAreas.ok) return expectedAreas;

  const followUpHints = normalizeList(input.followUpHints, "follow-up hint");
  if (!followUpHints.ok) return followUpHints;

  if (
    !Number.isInteger(input.maxDurationSeconds) ||
    input.maxDurationSeconds < 1 ||
    input.maxDurationSeconds > 3600
  ) {
    return {
      ok: false,
      message: "Question duration must be an integer between 1 and 3600 seconds.",
    };
  }

  if (!Number.isInteger(input.position) || input.position < 0) {
    return {
      ok: false,
      message: "Question position must be a non-negative integer.",
    };
  }

  return {
    ok: true,
    value: {
      questionText,
      difficulty: difficulty as QuestionDifficulty,
      expectedAreas: expectedAreas.value,
      followUpHints: followUpHints.value,
      maxDurationSeconds: input.maxDurationSeconds,
      isRequired: input.isRequired,
      position: input.position,
    },
  };
}
