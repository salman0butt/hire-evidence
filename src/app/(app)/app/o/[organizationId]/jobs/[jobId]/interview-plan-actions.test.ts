import { beforeEach, describe, expect, it, vi } from "vitest";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { listCompetencies } from "@/lib/interviewer/competencies";
import { saveInterviewPlan } from "@/lib/interviewer/interview-plans";
import { listQuestions } from "@/lib/interviewer/questions";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth/require-user", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/interviewer/competencies", () => ({ listCompetencies: vi.fn() }));
vi.mock("@/lib/interviewer/interview-plans", () => ({ saveInterviewPlan: vi.fn() }));
vi.mock("@/lib/interviewer/questions", () => ({ listQuestions: vi.fn() }));
vi.mock("@/lib/organization/require-membership", () => ({
  requireOrganizationMembership: vi.fn(),
}));

const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const competencyId = "33333333-3333-4333-8333-333333333333";
const questionId = "44444444-4444-4444-8444-444444444444";
const optionalQuestionId = "55555555-5555-4555-8555-555555555555";
const idleState = { status: "idle" as const, message: null };

const competencies = [
  {
    id: competencyId,
    jobId,
    name: "Systems design",
    description: "Designs reliable systems.",
    weight: 100,
    position: 0,
  },
];

const questions = [
  {
    id: questionId,
    jobId,
    competencyId,
    questionText: "Describe a production incident you owned.",
    difficulty: "hard" as const,
    expectedAreas: ["diagnosis"],
    followUpHints: [],
    maxDurationSeconds: 600,
    isRequired: true,
    position: 0,
  },
  {
    id: optionalQuestionId,
    jobId,
    competencyId,
    questionText: "What tradeoff would you revisit?",
    difficulty: "medium" as const,
    expectedAreas: ["tradeoffs"],
    followUpHints: [],
    maxDurationSeconds: 300,
    isRequired: false,
    position: 1,
  },
];

const validPlan = {
  totalDurationSeconds: 600,
  sections: [
    {
      purpose: "  Technical evidence  ",
      durationSeconds: 600,
      position: 0,
      questionIds: [questionId],
      competencyIds: [competencyId],
    },
  ],
};

async function interviewPlanActionsModule() {
  const modulePath = "./interview-plan-actions";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    saveInterviewPlanAction: (
      organizationId: string,
      jobId: string,
      previousState: typeof idleState,
      formData: FormData,
    ) => Promise<{ status: "idle" | "success" | "error"; message: string | null }>;
  }>;
}

function formData(plan: unknown = validPlan) {
  const data = new FormData();
  data.set("organization_id", "99999999-9999-4999-8999-999999999999");
  data.set("job_id", "88888888-8888-4888-8888-888888888888");
  data.set("plan_json", JSON.stringify(plan));
  return data;
}

describe("interview plan server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireUser).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "hiring_manager",
    });
    vi.mocked(listCompetencies).mockResolvedValue(competencies);
    vi.mocked(listQuestions).mockResolvedValue(questions);
    vi.mocked(saveInterviewPlan).mockResolvedValue("66666666-6666-4666-8666-666666666666");
  });

  it("saves only against route-bound ids using server-derived coverage sets", async () => {
    const { saveInterviewPlanAction } = await interviewPlanActionsModule();

    await expect(
      saveInterviewPlanAction(organizationId, jobId, idleState, formData()),
    ).resolves.toEqual({ status: "success", message: "Interview plan saved." });

    expect(listCompetencies).toHaveBeenCalledWith(organizationId, jobId);
    expect(listQuestions).toHaveBeenCalledWith(organizationId, jobId);
    expect(saveInterviewPlan).toHaveBeenCalledWith(organizationId, jobId, {
      totalDurationSeconds: 600,
      sections: [
        {
          purpose: "Technical evidence",
          durationSeconds: 600,
          position: 0,
          questionIds: [questionId],
          competencyIds: [competencyId],
        },
      ],
    });
    expect(revalidatePath).toHaveBeenCalledWith(`/app/o/${organizationId}/jobs/${jobId}`);
  });

  it("requires jobs:manage before loading configuration or persistence", async () => {
    const { saveInterviewPlanAction } = await interviewPlanActionsModule();
    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "reviewer",
    });

    await expect(
      saveInterviewPlanAction(organizationId, jobId, idleState, formData()),
    ).resolves.toEqual({
      status: "error",
      message: "You do not have permission to manage the interview plan.",
    });

    expect(listCompetencies).not.toHaveBeenCalled();
    expect(listQuestions).not.toHaveBeenCalled();
    expect(saveInterviewPlan).not.toHaveBeenCalled();
  });

  it("rejects malformed route ids and malformed plan payloads", async () => {
    const { saveInterviewPlanAction } = await interviewPlanActionsModule();

    await expect(
      saveInterviewPlanAction("not-a-uuid", jobId, idleState, formData()),
    ).resolves.toEqual({ status: "error", message: "Choose a valid organization." });
    await expect(
      saveInterviewPlanAction(organizationId, "not-a-uuid", idleState, formData()),
    ).resolves.toEqual({ status: "error", message: "Choose a valid job." });

    const malformed = new FormData();
    malformed.set("plan_json", "not-json");
    await expect(
      saveInterviewPlanAction(organizationId, jobId, idleState, malformed),
    ).resolves.toEqual({ status: "error", message: "Enter a valid interview plan." });

    expect(saveInterviewPlan).not.toHaveBeenCalled();
  });

  it("derives required coverage on the server and rejects missing required questions", async () => {
    const { saveInterviewPlanAction } = await interviewPlanActionsModule();
    const missingRequiredQuestion = {
      ...validPlan,
      sections: [
        {
          ...validPlan.sections[0],
          questionIds: [optionalQuestionId],
        },
      ],
    };

    await expect(
      saveInterviewPlanAction(
        organizationId,
        jobId,
        idleState,
        formData(missingRequiredQuestion),
      ),
    ).resolves.toEqual({
      status: "error",
      message: "Interview plan must cover every required question.",
    });
    expect(saveInterviewPlan).not.toHaveBeenCalled();
  });

  it("fails closed without leaking persistence internals", async () => {
    const { saveInterviewPlanAction } = await interviewPlanActionsModule();
    vi.mocked(saveInterviewPlan).mockRejectedValue(new Error("provider internals"));

    await expect(
      saveInterviewPlanAction(organizationId, jobId, idleState, formData()),
    ).resolves.toEqual({
      status: "error",
      message: "We could not save the interview plan. Please try again.",
    });
  });
});
