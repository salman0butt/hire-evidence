import { createClient } from "@/lib/supabase/server";

import type {
  QuestionDifficulty,
  ValidatedQuestionInput,
} from "./question-validation";

export type Question = ValidatedQuestionInput &
  Readonly<{
    id: string;
    jobId: string;
    competencyId: string;
  }>;

type QuestionRow = Readonly<{
  id: unknown;
  job_id: unknown;
  competency_id: unknown;
  question_text: unknown;
  difficulty: unknown;
  expected_areas: unknown;
  follow_up_hints: unknown;
  max_duration_seconds: unknown;
  is_required: unknown;
  position: unknown;
}>;

function isQuestionDifficulty(value: unknown): value is QuestionDifficulty {
  return value === "easy" || value === "medium" || value === "hard";
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function parseQuestion(row: QuestionRow): Question | null {
  if (
    typeof row.id !== "string" ||
    typeof row.job_id !== "string" ||
    typeof row.competency_id !== "string" ||
    typeof row.question_text !== "string" ||
    !isQuestionDifficulty(row.difficulty) ||
    !isStringArray(row.expected_areas) ||
    !isStringArray(row.follow_up_hints) ||
    typeof row.max_duration_seconds !== "number" ||
    !Number.isInteger(row.max_duration_seconds) ||
    typeof row.is_required !== "boolean" ||
    typeof row.position !== "number" ||
    !Number.isInteger(row.position)
  ) {
    return null;
  }

  return {
    id: row.id,
    jobId: row.job_id,
    competencyId: row.competency_id,
    questionText: row.question_text,
    difficulty: row.difficulty,
    expectedAreas: row.expected_areas,
    followUpHints: row.follow_up_hints,
    maxDurationSeconds: row.max_duration_seconds,
    isRequired: row.is_required,
    position: row.position,
  };
}

export async function createQuestion(
  organizationId: string,
  jobId: string,
  competencyId: string,
  input: ValidatedQuestionInput,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_question", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_competency_id: competencyId,
    p_question_text: input.questionText,
    p_difficulty: input.difficulty,
    p_expected_areas: input.expectedAreas,
    p_follow_up_hints: input.followUpHints,
    p_max_duration_seconds: input.maxDurationSeconds,
    p_is_required: input.isRequired,
    p_position: input.position,
  });

  if (error || typeof data !== "string" || !data) {
    throw new Error("Unable to create question.");
  }

  return data;
}

export async function listQuestions(
  organizationId: string,
  jobId: string,
): Promise<Question[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("questions")
    .select(
      "id,job_id,competency_id,question_text,difficulty,expected_areas,follow_up_hints,max_duration_seconds,is_required,position",
    )
    .eq("organization_id", organizationId)
    .eq("job_id", jobId)
    .order("position", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw new Error("Unable to load questions.");

  const questions: Question[] = [];
  for (const row of data ?? []) {
    const question = parseQuestion(row as QuestionRow);
    if (!question) throw new Error("Invalid question data.");
    questions.push(question);
  }

  return questions;
}
