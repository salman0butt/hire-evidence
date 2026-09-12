"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { createJob, deleteJob, updateJob } from "@/lib/jobs/jobs";
import { validateJobInput } from "@/lib/jobs/job-validation";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

export type JobActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
}>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function errorState(message: string): JobActionState {
  return { status: "error", message };
}

function jobsPath(organizationId: string): string {
  return `/app/o/${organizationId}/jobs`;
}

function requirementsFromText(
  value: FormDataEntryValue | null,
  kind: "must_have" | "nice_to_have",
) {
  if (typeof value !== "string") return value;

  return value
    .split(/\r?\n/)
    .map((requirement) => requirement.trim())
    .filter(Boolean)
    .map((requirement) => ({ kind, requirement }));
}

function validateForm(formData: FormData) {
  const mustHave = requirementsFromText(
    formData.get("must_have_requirements"),
    "must_have",
  );
  const niceToHave = requirementsFromText(
    formData.get("nice_to_have_requirements"),
    "nice_to_have",
  );

  return validateJobInput({
    title: formData.get("title"),
    department: formData.get("department"),
    description: formData.get("description"),
    responsibilities: formData.get("responsibilities"),
    seniority: formData.get("seniority"),
    employmentType: formData.get("employment_type"),
    location: formData.get("location"),
    salaryRange: formData.get("salary_range"),
    interviewInstructions: formData.get("interview_instructions"),
    requirements:
      Array.isArray(mustHave) && Array.isArray(niceToHave)
        ? [...mustHave, ...niceToHave]
        : null,
  });
}

async function requireJobManager(organizationId: string) {
  await requireUser(jobsPath(organizationId));
  const organization = await requireOrganizationMembership(organizationId);
  return hasOrganizationCapability(organization.role, "jobs:manage");
}

export async function createJobAction(
  organizationId: string,
  _previousState: JobActionState,
  formData: FormData,
): Promise<JobActionState> {
  if (!UUID_PATTERN.test(organizationId)) {
    return errorState("Choose a valid organization.");
  }

  const validation = validateForm(formData);
  if (!validation.ok) return errorState(validation.message);

  if (!(await requireJobManager(organizationId))) {
    return errorState("You do not have permission to manage jobs.");
  }

  try {
    await createJob(organizationId, validation.value);
  } catch {
    return errorState("We could not create the job. Please try again.");
  }

  revalidatePath(jobsPath(organizationId));
  return { status: "success", message: "Job created." };
}

export async function updateJobAction(
  organizationId: string,
  jobId: string,
  _previousState: JobActionState,
  formData: FormData,
): Promise<JobActionState> {
  if (!UUID_PATTERN.test(organizationId)) {
    return errorState("Choose a valid organization.");
  }
  if (!UUID_PATTERN.test(jobId)) {
    return errorState("Choose a valid job.");
  }

  const validation = validateForm(formData);
  if (!validation.ok) return errorState(validation.message);

  if (!(await requireJobManager(organizationId))) {
    return errorState("You do not have permission to manage jobs.");
  }

  try {
    await updateJob(organizationId, jobId, validation.value);
  } catch {
    return errorState("We could not update the job. Please try again.");
  }

  revalidatePath(jobsPath(organizationId));
  revalidatePath(`${jobsPath(organizationId)}/${jobId}`);
  return { status: "success", message: "Job updated." };
}

export async function deleteJobAction(
  organizationId: string,
  jobId: string,
  _previousState: JobActionState,
  _formData: FormData,
): Promise<JobActionState> {
  if (!UUID_PATTERN.test(organizationId)) {
    return errorState("Choose a valid organization.");
  }
  if (!UUID_PATTERN.test(jobId)) {
    return errorState("Choose a valid job.");
  }

  if (!(await requireJobManager(organizationId))) {
    return errorState("You do not have permission to manage jobs.");
  }

  try {
    await deleteJob(organizationId, jobId);
  } catch {
    return errorState("We could not delete the job. Please try again.");
  }

  revalidatePath(jobsPath(organizationId));
  return { status: "success", message: "Job deleted." };
}
