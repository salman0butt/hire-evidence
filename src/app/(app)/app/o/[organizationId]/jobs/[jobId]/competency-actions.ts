"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { createCompetency } from "@/lib/interviewer/competencies";
import { validateCompetencyInput } from "@/lib/interviewer/competency-validation";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";
import { createClient } from "@/lib/supabase/server";

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

function textField(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
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

export async function saveCompetencyRubricAction(
  organizationId: string,
  jobId: string,
  competencyId: string,
  _previousState: CompetencyActionState,
  formData: FormData,
): Promise<CompetencyActionState> {
  if (!UUID_PATTERN.test(organizationId)) {
    return errorState("Choose a valid organization.");
  }
  if (!UUID_PATTERN.test(jobId)) {
    return errorState("Choose a valid job.");
  }
  if (!UUID_PATTERN.test(competencyId)) {
    return errorState("Choose a valid competency.");
  }

  await requireUser(jobPath(organizationId, jobId));
  const organization = await requireOrganizationMembership(organizationId);
  if (!hasOrganizationCapability(organization.role, "jobs:manage")) {
    return errorState("You do not have permission to manage competency rubrics.");
  }

  const supabase = await createClient();
  const { error } = await supabase.rpc("save_competency_rubric", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_competency_id: competencyId,
    p_level_1: textField(formData, "level_1"),
    p_level_2: textField(formData, "level_2"),
    p_level_3: textField(formData, "level_3"),
    p_level_4: textField(formData, "level_4"),
    p_level_5: textField(formData, "level_5"),
  });

  if (error) {
    return errorState("We could not save the rubric. Please try again.");
  }

  revalidatePath(jobPath(organizationId, jobId));
  return { status: "success", message: "Rubric saved." };
}
