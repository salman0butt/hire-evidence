import { createClient } from "@/lib/supabase/server";

import type { InterviewPlanInput } from "./interview-plan-validation";

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
