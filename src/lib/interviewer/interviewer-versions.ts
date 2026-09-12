import { createClient } from "@/lib/supabase/server";

export type InterviewerVersion = Readonly<{
  id: string;
  interviewerConfigId: string;
  versionNumber: number;
  snapshot: Record<string, unknown>;
  platformPromptVersion: string;
  guardrailVersion: string;
  publishedAt: string;
}>;

type InterviewerVersionRow = Readonly<{
  id: string;
  interviewer_config_id: string;
  version_number: number;
  snapshot: Record<string, unknown>;
  platform_prompt_version: string;
  guardrail_version: string;
  published_at: string;
}>;

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

export async function getInterviewerVersion(
  organizationId: string,
  jobId: string,
  versionId: string,
): Promise<InterviewerVersion | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("interviewer_versions")
    .select(
      "id, interviewer_config_id, version_number, snapshot, platform_prompt_version, guardrail_version, published_at",
    )
    .eq("organization_id", organizationId)
    .eq("job_id", jobId)
    .eq("id", versionId)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load interviewer version.");
  }

  if (!data) return null;

  const row = data as InterviewerVersionRow;
  return {
    id: row.id,
    interviewerConfigId: row.interviewer_config_id,
    versionNumber: row.version_number,
    snapshot: row.snapshot,
    platformPromptVersion: row.platform_prompt_version,
    guardrailVersion: row.guardrail_version,
    publishedAt: row.published_at,
  };
}
