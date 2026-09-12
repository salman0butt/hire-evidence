"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { listCompetencies } from "@/lib/interviewer/competencies";
import {
  type InterviewPlanInput,
  validateInterviewPlanInput,
} from "@/lib/interviewer/interview-plan-validation";
import { saveInterviewPlan } from "@/lib/interviewer/interview-plans";
import { listQuestions } from "@/lib/interviewer/questions";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

export type InterviewPlanActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
}>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const MAX_TOTAL_DURATION_SECONDS = 3600;

function errorState(message: string): InterviewPlanActionState {
  return { status: "error", message };
}

function jobPath(organizationId: string, jobId: string): string {
  return `/app/o/${organizationId}/jobs/${jobId}`;
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isInterviewPlanInput(value: unknown): value is InterviewPlanInput {
  if (typeof value !== "object" || value === null) return false;

  const input = value as Record<string, unknown>;
  if (typeof input.totalDurationSeconds !== "number" || !Array.isArray(input.sections)) {
    return false;
  }

  return input.sections.every((section) => {
    if (typeof section !== "object" || section === null) return false;
    const candidate = section as Record<string, unknown>;
    return (
      typeof candidate.purpose === "string" &&
      typeof candidate.durationSeconds === "number" &&
      typeof candidate.position === "number" &&
      isStringArray(candidate.questionIds) &&
      isStringArray(candidate.competencyIds)
    );
  });
}

function parsePlan(formData: FormData): InterviewPlanInput | null {
  const raw = formData.get("plan_json");
  if (typeof raw !== "string" || !raw.trim()) return null;

  try {
    const parsed: unknown = JSON.parse(raw);
    return isInterviewPlanInput(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

export async function saveInterviewPlanAction(
  organizationId: string,
  jobId: string,
  _previousState: InterviewPlanActionState,
  formData: FormData,
): Promise<InterviewPlanActionState> {
  if (!UUID_PATTERN.test(organizationId)) {
    return errorState("Choose a valid organization.");
  }
  if (!UUID_PATTERN.test(jobId)) {
    return errorState("Choose a valid job.");
  }

  const input = parsePlan(formData);
  if (!input) {
    return errorState("Enter a valid interview plan.");
  }

  await requireUser(jobPath(organizationId, jobId));
  const organization = await requireOrganizationMembership(organizationId);
  if (!hasOrganizationCapability(organization.role, "jobs:manage")) {
    return errorState("You do not have permission to manage the interview plan.");
  }

  const [competencies, questions] = await Promise.all([
    listCompetencies(organizationId, jobId),
    listQuestions(organizationId, jobId),
  ]);
  const validation = validateInterviewPlanInput(input, {
    maxTotalDurationSeconds: MAX_TOTAL_DURATION_SECONDS,
    allowedQuestionIds: questions.map((question) => question.id),
    allowedCompetencyIds: competencies.map((competency) => competency.id),
    requiredQuestionIds: questions
      .filter((question) => question.isRequired)
      .map((question) => question.id),
    requiredCompetencyIds: competencies.map((competency) => competency.id),
  });
  if (!validation.ok) return errorState(validation.message);

  try {
    await saveInterviewPlan(organizationId, jobId, validation.value);
  } catch {
    return errorState("We could not save the interview plan. Please try again.");
  }

  revalidatePath(jobPath(organizationId, jobId));
  return { status: "success", message: "Interview plan saved." };
}
