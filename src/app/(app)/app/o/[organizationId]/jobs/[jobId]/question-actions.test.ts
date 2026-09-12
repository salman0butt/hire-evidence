import { beforeEach, describe, expect, it, vi } from "vitest";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { createQuestion } from "@/lib/interviewer/questions";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth/require-user", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/interviewer/questions", () => ({ createQuestion: vi.fn() }));
vi.mock("@/lib/organization/require-membership", () => ({
  requireOrganizationMembership: vi.fn(),
}));

const organizationId = "11111111-1111-4111-8111-111111111111";
const attackerOrganizationId = "99999999-9999-4999-8999-999999999999";
const jobId = "22222222-2222-4222-8222-222222222222";
const attackerJobId = "88888888-8888-4888-8888-888888888888";
const competencyId = "33333333-3333-4333-8333-333333333333";
const questionId = "44444444-4444-4444-8444-444444444444";
const idleState = { status: "idle" as const, message: null };

async function questionActionsModule() {
  const modulePath = "./question-actions";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    createQuestionAction: (
      organizationId: string,
      jobId: string,
      previousState: typeof idleState,
      formData: FormData,
    ) => Promise<{ status: "idle" | "success" | "error"; message: string | null }>;
  }>;
}

function formData() {
  const data = new FormData();
  data.set("organization_id", attackerOrganizationId);
  data.set("job_id", attackerJobId);
  data.set("competency_id", competencyId);
  data.set("question_text", "  Describe a production incident you owned.  ");
  data.set("difficulty", "hard");
  data.set("expected_areas", " diagnosis\nremediation ");
  data.set("follow_up_hints", " Ask about verification. ");
  data.set("max_duration_seconds", "600");
  data.set("is_required", "on");
  data.set("position", "2");
  return data;
}

describe("question server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireUser).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "hiring_manager",
    });
  });

  it("creates only against route-bound organization and job ids", async () => {
    const { createQuestionAction } = await questionActionsModule();
    vi.mocked(createQuestion).mockResolvedValue(questionId);

    await expect(
      createQuestionAction(organizationId, jobId, idleState, formData()),
    ).resolves.toEqual({ status: "success", message: "Question added." });

    expect(createQuestion).toHaveBeenCalledWith(organizationId, jobId, competencyId, {
      questionText: "Describe a production incident you owned.",
      difficulty: "hard",
      expectedAreas: ["diagnosis", "remediation"],
      followUpHints: ["Ask about verification."],
      maxDurationSeconds: 600,
      isRequired: true,
      position: 2,
    });
    expect(createQuestion).not.toHaveBeenCalledWith(
      attackerOrganizationId,
      attackerJobId,
      expect.anything(),
      expect.anything(),
    );
    expect(revalidatePath).toHaveBeenCalledWith(`/app/o/${organizationId}/jobs/${jobId}`);
  });

  it("requires jobs:manage before persistence", async () => {
    const { createQuestionAction } = await questionActionsModule();
    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "reviewer",
    });

    await expect(
      createQuestionAction(organizationId, jobId, idleState, formData()),
    ).resolves.toEqual({
      status: "error",
      message: "You do not have permission to manage questions.",
    });
    expect(createQuestion).not.toHaveBeenCalled();
  });

  it("rejects malformed route and competency ids before auth or persistence", async () => {
    const { createQuestionAction } = await questionActionsModule();

    await expect(
      createQuestionAction("not-a-uuid", jobId, idleState, formData()),
    ).resolves.toEqual({ status: "error", message: "Choose a valid organization." });
    await expect(
      createQuestionAction(organizationId, "not-a-uuid", idleState, formData()),
    ).resolves.toEqual({ status: "error", message: "Choose a valid job." });

    const invalidCompetency = formData();
    invalidCompetency.set("competency_id", "not-a-uuid");
    await expect(
      createQuestionAction(organizationId, jobId, idleState, invalidCompetency),
    ).resolves.toEqual({ status: "error", message: "Choose a valid competency." });

    expect(requireUser).not.toHaveBeenCalled();
    expect(createQuestion).not.toHaveBeenCalled();
  });

  it("returns validation errors before persistence", async () => {
    const { createQuestionAction } = await questionActionsModule();
    const data = formData();
    data.set("question_text", "   ");

    await expect(
      createQuestionAction(organizationId, jobId, idleState, data),
    ).resolves.toEqual({ status: "error", message: "Question text is required." });
    expect(createQuestion).not.toHaveBeenCalled();
  });

  it("fails closed with a generic persistence error", async () => {
    const { createQuestionAction } = await questionActionsModule();
    vi.mocked(createQuestion).mockRejectedValue(new Error("provider internals"));

    await expect(
      createQuestionAction(organizationId, jobId, idleState, formData()),
    ).resolves.toEqual({
      status: "error",
      message: "We could not add the question. Please try again.",
    });
  });
});
