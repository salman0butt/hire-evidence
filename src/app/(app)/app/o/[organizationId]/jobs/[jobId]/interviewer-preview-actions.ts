"use server";

import { requireUser } from "@/lib/auth/require-user";
import { previewInterviewerConfig } from "@/lib/interviewer/interviewer-preview";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

export type InterviewerPreviewSummary = Readonly<{
  interviewerName: string;
  jobTitle: string;
  questionCount: number;
  sectionCount: number;
  billable: false;
  persisted: false;
}>;

export type InterviewerPreviewActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
  preview: InterviewerPreviewSummary | null;
}>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function errorState(message: string): InterviewerPreviewActionState {
  return { status: "error", message, preview: null };
}

function jobPath(organizationId: string, jobId: string): string {
  return `/app/o/${organizationId}/jobs/${jobId}`;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function summarizePreview(snapshot: Record<string, unknown>): InterviewerPreviewSummary | null {
  const job = snapshot.job;
  const interviewerConfig = snapshot.interviewer_config;
  const interviewPlan = snapshot.interview_plan;
  const questions = snapshot.questions;

  if (
    !isRecord(job) ||
    typeof job.title !== "string" ||
    !isRecord(interviewerConfig) ||
    typeof interviewerConfig.name !== "string" ||
    !Array.isArray(questions) ||
    !isRecord(interviewPlan) ||
    !Array.isArray(interviewPlan.sections)
  ) {
    return null;
  }

  return {
    interviewerName: interviewerConfig.name,
    jobTitle: job.title,
    questionCount: questions.length,
    sectionCount: interviewPlan.sections.length,
    billable: false,
    persisted: false,
  };
}

export async function previewInterviewerConfigAction(
  organizationId: string,
  jobId: string,
  configId: string,
  _previousState: InterviewerPreviewActionState,
  _formData: FormData,
): Promise<InterviewerPreviewActionState> {
  if (!UUID_PATTERN.test(organizationId)) {
    return errorState("Choose a valid organization.");
  }
  if (!UUID_PATTERN.test(jobId)) {
    return errorState("Choose a valid job.");
  }
  if (!UUID_PATTERN.test(configId)) {
    return errorState("Choose a valid interviewer configuration.");
  }

  await requireUser(jobPath(organizationId, jobId));
  const organization = await requireOrganizationMembership(organizationId);
  if (!hasOrganizationCapability(organization.role, "jobs:manage")) {
    return errorState("You do not have permission to preview interviewer configuration.");
  }

  try {
    const preview = await previewInterviewerConfig(organizationId, jobId, configId);
    const summary = summarizePreview(preview.snapshot);
    if (!summary) {
      return errorState("We could not generate the interviewer preview. Please try again.");
    }

    return {
      status: "success",
      message: "Preview generated. No candidate interview or billable usage was created.",
      preview: summary,
    };
  } catch {
    return errorState("We could not generate the interviewer preview. Please try again.");
  }
}
