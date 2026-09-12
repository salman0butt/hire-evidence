import { createClient } from "@/lib/supabase/server";

import type { InterviewPlanInput } from "./interview-plan-validation";

type InterviewPlanRow = Readonly<{
  total_duration_seconds: number;
  interview_plan_sections: Array<
    Readonly<{
      purpose: string;
      duration_seconds: number;
      position: number;
      interview_plan_section_questions: Array<
        Readonly<{
          question_id: string;
          question_position: number;
        }>
      >;
      interview_plan_section_competencies: Array<
        Readonly<{
          competency_id: string;
        }>
      >;
    }>
  >;
}>;

export async function saveInterviewPlan(
  organizationId: string,
  jobId: string,
  input: InterviewPlanInput,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("save_interview_plan", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_total_duration_seconds: input.totalDurationSeconds,
    p_sections: input.sections,
  });

  if (error || typeof data !== "string" || !data) {
    throw new Error("Unable to save interview plan.");
  }

  return data;
}

export async function getInterviewPlan(
  organizationId: string,
  jobId: string,
): Promise<InterviewPlanInput | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interview_plans")
    .select(
      "total_duration_seconds, interview_plan_sections(purpose, duration_seconds, position, interview_plan_section_questions(question_id, question_position), interview_plan_section_competencies(competency_id))",
    )
    .eq("organization_id", organizationId)
    .eq("job_id", jobId)
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load interview plan.");
  }

  if (!data) {
    return null;
  }

  const plan = data as InterviewPlanRow;

  return {
    totalDurationSeconds: plan.total_duration_seconds,
    sections: [...plan.interview_plan_sections]
      .sort((left, right) => left.position - right.position)
      .map((section) => ({
        purpose: section.purpose,
        durationSeconds: section.duration_seconds,
        position: section.position,
        questionIds: [...section.interview_plan_section_questions]
          .sort(
            (left, right) => left.question_position - right.question_position,
          )
          .map((link) => link.question_id),
        competencyIds: section.interview_plan_section_competencies.map(
          (link) => link.competency_id,
        ),
      })),
  };
}
