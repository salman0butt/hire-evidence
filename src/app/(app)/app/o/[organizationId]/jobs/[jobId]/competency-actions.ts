"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { createCompetency } from "@/lib/interviewer/competencies";
import { validateCompetencyInput } from "@/lib/interviewer/competency-validation";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

export type CompetencyActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
}>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function errorState(message: string): CompetencyActionState {
  return { status: "error", message };
}

function jobPath(organizationId: string, jobId: string): string {
  return `/app/o/${organizationId}/jobs/${jobId}`;
}

function numericField(value: FormDataEntryValue | null): number {
  if (typeof value !== "string" || value.trim() === "") return Number.NaN;
  return Number(value);
}

export async function createCompetencyAction(
  organizationId: string,
  jobId: string,
  _previousState: CompetencyActionState,
  formData: FormData,
): Promise<CompetencyActionState> {
  if (!UUID_PATTERN.test(organizationId)) {
    return errorState("Choose a valid organization.");
  }
  if (!UUID_PATTERN.test(jobId)) {
    return errorState("Choose a valid job.");
  }

  const validation = validateCompetencyInput({
    name: formData.get("name"),
    description: formData.get("description"),
    weight: numericField(formData.get("weight")),
    position: numericField(formData.get("position")),
  });
  if (!validation.ok) return errorState(validation.message);

  await requireUser(jobPath(organizationId, jobId));
  const organization = await requireOrganizationMembership(organizationId);
  if (!hasOrganizationCapability(organization.role, "jobs:manage")) {
    return errorState("You do not have permission to manage competencies.");
  }

  try {
    await createCompetency(organizationId, jobId, validation.value);
  } catch {
    return errorState("We could not add the competency. Please try again.");
  }

  revalidatePath(jobPath(organizationId, jobId));
  return { status: "success", message: "Competency added." };
}
