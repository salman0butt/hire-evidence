import { createClient } from "@/lib/supabase/server";

export type InterviewerPreview = Readonly<{
  mode: "preview";
  billable: false;
  persisted: false;
  platformPromptVersion: string;
  guardrailVersion: string;
  snapshot: Record<string, unknown>;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function previewInterviewerConfig(
  organizationId: string,
  jobId: string,
  configId: string,
): Promise<InterviewerPreview> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("preview_interviewer_config", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_config_id: configId,
  });

  if (
    error ||
    !isRecord(data) ||
    data.mode !== "preview" ||
    data.billable !== false ||
    data.persisted !== false ||
    typeof data.platform_prompt_version !== "string" ||
    typeof data.guardrail_version !== "string" ||
    !isRecord(data.snapshot)
  ) {
    throw new Error("Unable to preview interviewer configuration.");
  }

  return {
    mode: "preview",
    billable: false,
    persisted: false,
    platformPromptVersion: data.platform_prompt_version,
    guardrailVersion: data.guardrail_version,
    snapshot: data.snapshot,
  };
}
