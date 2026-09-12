import type { ValidatedInterviewerConfigInput } from "@/lib/interviewer/interviewer-config-validation";
import { createClient } from "@/lib/supabase/server";

export type InterviewerConfig = ValidatedInterviewerConfigInput & {
  id: string;
  planId: string;
  status: "draft" | "published";
  publishedAt: string | null;
};

type InterviewerConfigRow = Readonly<{
  id: string;
  plan_id: string;
  name: string;
  interview_type: ValidatedInterviewerConfigInput["interviewType"];
  persona: ValidatedInterviewerConfigInput["persona"];
  language: string;
  duration_seconds: number;
  difficulty: ValidatedInterviewerConfigInput["difficulty"];
  question_mode: ValidatedInterviewerConfigInput["questionMode"];
  guidelines: string;
  candidate_instructions: string;
  max_follow_ups_per_question: number;
  follow_up_reasons: ValidatedInterviewerConfigInput["followUpPolicy"]["allowedReasons"];
  status: "draft" | "published";
  published_at: string | null;
}>;

export async function saveInterviewerConfig(
  organizationId: string,
  jobId: string,
  planId: string,
  input: ValidatedInterviewerConfigInput,
  configId: string | null = null,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("save_interviewer_config", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_plan_id: planId,
    p_name: input.name,
    p_interview_type: input.interviewType,
    p_persona: input.persona,
    p_language: input.language,
    p_duration_seconds: input.durationSeconds,
    p_difficulty: input.difficulty,
    p_question_mode: input.questionMode,
    p_guidelines: input.guidelines,
    p_candidate_instructions: input.candidateInstructions,
    p_max_follow_ups_per_question: input.followUpPolicy.maxFollowUpsPerQuestion,
    p_follow_up_reasons: input.followUpPolicy.allowedReasons,
    p_config_id: configId,
  });

  if (error || typeof data !== "string") {
    throw new Error("Unable to save interviewer configuration.");
  }

  return data;
}

export async function publishInterviewerConfig(
  organizationId: string,
  jobId: string,
  configId: string,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("publish_interviewer_config", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_config_id: configId,
  });

  if (error || typeof data !== "string") {
    throw new Error("Unable to publish interviewer configuration.");
  }

  return data;
}

export async function getLatestInterviewerConfig(
  organizationId: string,
  jobId: string,
): Promise<InterviewerConfig | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interviewer_configs")
    .select(
      "id, plan_id, name, interview_type, persona, language, duration_seconds, difficulty, question_mode, guidelines, candidate_instructions, max_follow_ups_per_question, follow_up_reasons, status, published_at",
    )
    .eq("organization_id", organizationId)
    .eq("job_id", jobId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load interviewer configuration.");
  }

  if (!data) return null;

  const row = data as InterviewerConfigRow;
  return {
    id: row.id,
    planId: row.plan_id,
    name: row.name,
    interviewType: row.interview_type,
    persona: row.persona,
    language: row.language,
    durationSeconds: row.duration_seconds,
    difficulty: row.difficulty,
    questionMode: row.question_mode,
    guidelines: row.guidelines,
    candidateInstructions: row.candidate_instructions,
    followUpPolicy: {
      maxFollowUpsPerQuestion: row.max_follow_ups_per_question,
      allowedReasons: row.follow_up_reasons,
    },
    status: row.status,
    publishedAt: row.published_at,
  };
}
