"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { validateQuestionInput } from "@/lib/interviewer/question-validation";
import { createQuestion } from "@/lib/interviewer/questions";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

export type QuestionActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
}>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function errorState(message: string): QuestionActionState {
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
  return typeof value === "string" ? value : "";
}

function lineList(formData: FormData, name: string): string[] {
  const value = textField(formData, name);
  if (!value.trim()) return [];
  return value.split(/\r?\n/);
}

export async function createQuestionAction(
  organizationId: string,
  jobId: string,
  _previousState: QuestionActionState,
  formData: FormData,
): Promise<QuestionActionState> {
  if (!UUID_PATTERN.test(organizationId)) {
    return errorState("Choose a valid organization.");
  }
  if (!UUID_PATTERN.test(jobId)) {
    return errorState("Choose a valid job.");
  }

  const competencyId = textField(formData, "competency_id").trim();
  if (!UUID_PATTERN.test(competencyId)) {
    return errorState("Choose a valid competency.");
  }

  const validation = validateQuestionInput({
    questionText: textField(formData, "question_text"),
    difficulty: textField(formData, "difficulty"),
    expectedAreas: lineList(formData, "expected_areas"),
    followUpHints: lineList(formData, "follow_up_hints"),
    maxDurationSeconds: numericField(formData.get("max_duration_seconds")),
    isRequired: formData.get("is_required") === "on",
    position: numericField(formData.get("position")),
  });
  if (!validation.ok) return errorState(validation.message);

  await requireUser(jobPath(organizationId, jobId));
  const organization = await requireOrganizationMembership(organizationId);
  if (!hasOrganizationCapability(organization.role, "jobs:manage")) {
    return errorState("You do not have permission to manage questions.");
  }

  try {
    await createQuestion(organizationId, jobId, competencyId, validation.value);
  } catch {
    return errorState("We could not add the question. Please try again.");
  }

  revalidatePath(jobPath(organizationId, jobId));
  return { status: "success", message: "Question added." };
}
