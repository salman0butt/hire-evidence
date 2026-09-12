"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { publishInterviewerConfig } from "@/lib/interviewer/interviewer-configs";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

export type InterviewerPublishActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
  versionId: string | null;
}>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function errorState(message: string): InterviewerPublishActionState {
  return { status: "error", message, versionId: null };
}

function jobPath(organizationId: string, jobId: string): string {
  return `/app/o/${organizationId}/jobs/${jobId}`;
}

export async function publishInterviewerConfigAction(
  organizationId: string,
  jobId: string,
  configId: string,
  _previousState: InterviewerPublishActionState,
  _formData: FormData,
): Promise<InterviewerPublishActionState> {
  if (!UUID_PATTERN.test(organizationId)) {
    return errorState("Choose a valid organization.");
  }
  if (!UUID_PATTERN.test(jobId)) {
    return errorState("Choose a valid job.");
  }
  if (!UUID_PATTERN.test(configId)) {
    return errorState("Choose a valid interviewer configuration.");
  }

  const path = jobPath(organizationId, jobId);
  await requireUser(path);
  const organization = await requireOrganizationMembership(organizationId);
  if (!hasOrganizationCapability(organization.role, "jobs:manage")) {
    return errorState("You do not have permission to publish interviewer configuration.");
  }

  try {
    const versionId = await publishInterviewerConfig(
      organizationId,
      jobId,
      configId,
    );
    revalidatePath(path);
    return {
      status: "success",
      message: "Interviewer configuration published.",
      versionId,
    };
  } catch {
    return errorState("We could not publish interviewer configuration. Please try again.");
  }
}
