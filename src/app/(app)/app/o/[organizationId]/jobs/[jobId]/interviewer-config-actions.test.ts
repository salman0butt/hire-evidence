import { beforeEach, describe, expect, it, vi } from "vitest";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { saveInterviewerConfig } from "@/lib/interviewer/interviewer-configs";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth/require-user", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/interviewer/interviewer-configs", () => ({ saveInterviewerConfig: vi.fn() }));
vi.mock("@/lib/organization/require-membership", () => ({
  requireOrganizationMembership: vi.fn(),
}));

const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const planId = "33333333-3333-4333-8333-333333333333";
const configId = "44444444-4444-4444-8444-444444444444";
const idleState = { status: "idle" as const, message: null };

async function interviewerConfigActionsModule() {
  const modulePath = "./interviewer-config-actions";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    saveInterviewerConfigAction: (
      organizationId: string,
      jobId: string,
      previousState: typeof idleState,
      formData: FormData,
    ) => Promise<{ status: "idle" | "success" | "error"; message: string | null }>;
  }>;
}

function validFormData() {
  const data = new FormData();
  data.set("organization_id", "99999999-9999-4999-8999-999999999999");
  data.set("job_id", "88888888-8888-4888-8888-888888888888");
  data.set("plan_id", planId);
  data.set("config_id", configId);
  data.set("name", "  Technical interviewer  ");
  data.set("interview_type", " TECHNICAL ");
  data.set("persona", " Professional ");
  data.set("language", " English ");
  data.set("duration_seconds", "1800");
  data.set("difficulty", " HARD ");
  data.set("question_mode", " SEMI_ADAPTIVE ");
  data.set("guidelines", "  Ask for concrete evidence.  ");
  data.set("candidate_instructions", "  Explain your reasoning.  ");
  data.set("max_follow_ups_per_question", "2");
  data.set("follow_up_reasons", "clarify_ambiguity");
  data.append("follow_up_reasons", "explore_reasoning");
  return data;
}

describe("interviewer configuration server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireUser).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "hiring_manager",
    });
    vi.mocked(saveInterviewerConfig).mockResolvedValue(configId);
  });

  it("saves normalized configuration against route-bound organization and job ids", async () => {
    const { saveInterviewerConfigAction } = await interviewerConfigActionsModule();

    await expect(
      saveInterviewerConfigAction(organizationId, jobId, idleState, validFormData()),
    ).resolves.toEqual({ status: "success", message: "Interviewer configuration saved." });

    expect(saveInterviewerConfig).toHaveBeenCalledWith(
      organizationId,
      jobId,
      planId,
      {
        name: "Technical interviewer",
        interviewType: "technical",
        persona: "professional",
        language: "English",
        durationSeconds: 1800,
        difficulty: "hard",
        questionMode: "semi_adaptive",
        guidelines: "Ask for concrete evidence.",
        candidateInstructions: "Explain your reasoning.",
        followUpPolicy: {
          maxFollowUpsPerQuestion: 2,
          allowedReasons: ["clarify_ambiguity", "explore_reasoning"],
        },
      },
      configId,
    );
    expect(revalidatePath).toHaveBeenCalledWith(`/app/o/${organizationId}/jobs/${jobId}`);
  });

  it("requires jobs:manage before persistence", async () => {
    const { saveInterviewerConfigAction } = await interviewerConfigActionsModule();
    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "reviewer",
    });

    await expect(
      saveInterviewerConfigAction(organizationId, jobId, idleState, validFormData()),
    ).resolves.toEqual({
      status: "error",
      message: "You do not have permission to manage interviewer configuration.",
    });
    expect(saveInterviewerConfig).not.toHaveBeenCalled();
  });

  it("rejects malformed route and persistence ids", async () => {
    const { saveInterviewerConfigAction } = await interviewerConfigActionsModule();

    await expect(
      saveInterviewerConfigAction("not-a-uuid", jobId, idleState, validFormData()),
    ).resolves.toEqual({ status: "error", message: "Choose a valid organization." });
    await expect(
      saveInterviewerConfigAction(organizationId, "not-a-uuid", idleState, validFormData()),
    ).resolves.toEqual({ status: "error", message: "Choose a valid job." });

    const badPlan = validFormData();
    badPlan.set("plan_id", "not-a-uuid");
    await expect(
      saveInterviewerConfigAction(organizationId, jobId, idleState, badPlan),
    ).resolves.toEqual({ status: "error", message: "Choose a valid interview plan." });

    const badConfig = validFormData();
    badConfig.set("config_id", "not-a-uuid");
    await expect(
      saveInterviewerConfigAction(organizationId, jobId, idleState, badConfig),
    ).resolves.toEqual({ status: "error", message: "Choose a valid interviewer configuration." });
    expect(saveInterviewerConfig).not.toHaveBeenCalled();
  });

  it("rejects invalid configuration fields before persistence", async () => {
    const { saveInterviewerConfigAction } = await interviewerConfigActionsModule();
    const data = validFormData();
    data.set("duration_seconds", "600");

    await expect(
      saveInterviewerConfigAction(organizationId, jobId, idleState, data),
    ).resolves.toEqual({
      status: "error",
      message: "Interview duration must be a whole number between 900 and 3600 seconds.",
    });
    expect(saveInterviewerConfig).not.toHaveBeenCalled();
  });

  it("fails closed without leaking persistence internals", async () => {
    const { saveInterviewerConfigAction } = await interviewerConfigActionsModule();
    vi.mocked(saveInterviewerConfig).mockRejectedValue(new Error("provider internals"));

    await expect(
      saveInterviewerConfigAction(organizationId, jobId, idleState, validFormData()),
    ).resolves.toEqual({
      status: "error",
      message: "We could not save interviewer configuration. Please try again.",
    });
  });
});
