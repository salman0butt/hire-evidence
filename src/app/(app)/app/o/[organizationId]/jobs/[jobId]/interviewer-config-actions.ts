"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { validateInterviewerGuardrails } from "@/lib/interviewer/guardrail-validation";
import {
  type InterviewerConfigInput,
  validateInterviewerConfigInput,
} from "@/lib/interviewer/interviewer-config-validation";
import { saveInterviewerConfig } from "@/lib/interviewer/interviewer-configs";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

export type InterviewerConfigActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
}>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function errorState(message: string): InterviewerConfigActionState {
  return { status: "error", message };
}

function jobPath(organizationId: string, jobId: string): string {
  return `/app/o/${organizationId}/jobs/${jobId}`;
}

function formString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function formInteger(formData: FormData, key: string): number {
  const value = formString(formData, key).trim();
  if (!/^-?\d+$/.test(value)) return Number.NaN;
  return Number(value);
}

function parseInput(formData: FormData): InterviewerConfigInput {
  return {
    name: formString(formData, "name"),
    interviewType: formString(formData, "interview_type"),
    persona: formString(formData, "persona"),
    language: formString(formData, "language"),
    durationSeconds: formInteger(formData, "duration_seconds"),
    difficulty: formString(formData, "difficulty"),
    questionMode: formString(formData, "question_mode"),
    guidelines: formString(formData, "guidelines"),
    candidateInstructions: formString(formData, "candidate_instructions"),
    followUpPolicy: {
      maxFollowUpsPerQuestion: formInteger(formData, "max_follow_ups_per_question"),
      allowedReasons: formData
        .getAll("follow_up_reasons")
        .filter((value): value is string => typeof value === "string"),
    },
  };
}

export async function saveInterviewerConfigAction(
  organizationId: string,
  jobId: string,
  _previousState: InterviewerConfigActionState,
  formData: FormData,
): Promise<InterviewerConfigActionState> {
  if (!UUID_PATTERN.test(organizationId)) {
    return errorState("Choose a valid organization.");
  }
  if (!UUID_PATTERN.test(jobId)) {
    return errorState("Choose a valid job.");
  }

  const planId = formString(formData, "plan_id").trim();
  if (!UUID_PATTERN.test(planId)) {
    return errorState("Choose a valid interview plan.");
  }

  const rawConfigId = formString(formData, "config_id").trim();
  const configId = rawConfigId || null;
  if (configId && !UUID_PATTERN.test(configId)) {
    return errorState("Choose a valid interviewer configuration.");
  }

  const validation = validateInterviewerConfigInput(parseInput(formData));
  if (!validation.ok) return errorState(validation.message);

  await requireUser(jobPath(organizationId, jobId));
  const organization = await requireOrganizationMembership(organizationId);
  if (!hasOrganizationCapability(organization.role, "jobs:manage")) {
    return errorState("You do not have permission to manage interviewer configuration.");
  }

  const guardrailValidation = validateInterviewerGuardrails({
    jobText: "",
    guidelines: validation.value.guidelines,
    candidateInstructions: validation.value.candidateInstructions,
  });
  if (!guardrailValidation.safe) {
    return errorState("Interviewer configuration conflicts with platform hiring-safety rules.");
  }

  try {
    await saveInterviewerConfig(
      organizationId,
      jobId,
      planId,
      validation.value,
      configId,
    );
  } catch {
    return errorState("We could not save interviewer configuration. Please try again.");
  }

  revalidatePath(jobPath(organizationId, jobId));
  return { status: "success", message: "Interviewer configuration saved." };
}