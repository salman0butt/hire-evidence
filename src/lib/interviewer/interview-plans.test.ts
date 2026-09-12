import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const planId = "55555555-5555-4555-8555-555555555555";

const input = {
  totalDurationSeconds: 900,
  sections: [
    {
      purpose: "Technical fundamentals",
      durationSeconds: 300,
      position: 0,
      questionIds: ["33333333-3333-4333-8333-333333333333"],
      competencyIds: ["44444444-4444-4444-8444-444444444444"],
    },
    {
      purpose: "Problem solving",
      durationSeconds: 600,
      position: 1,
      questionIds: ["66666666-6666-4666-8666-666666666666"],
      competencyIds: ["77777777-7777-4777-8777-777777777777"],
    },
  ],
};

type InterviewPlanFixture = typeof input;

async function interviewPlansModule() {
  const modulePath = "./interview-plans";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    saveInterviewPlan: (
      organizationId: string,
      jobId: string,
      planInput: InterviewPlanFixture,
    ) => Promise<string>;
    getInterviewPlan: (
      organizationId: string,
      jobId: string,
    ) => Promise<InterviewPlanFixture | null>;
  }>;
}

function readClient(result: { data: unknown; error: unknown }) {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const limit = vi.fn(() => ({ maybeSingle }));
  const order = vi.fn(() => ({ limit }));
  const secondEq = vi.fn(() => ({ order }));
  const firstEq = vi.fn(() => ({ eq: secondEq }));
  const select = vi.fn(() => ({ eq: firstEq }));
  const from = vi.fn(() => ({ select }));
  return { from, select, firstEq, secondEq, order, limit, maybeSingle };
}

describe("interview plan repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves the validated deterministic plan through the tenant- and job-bound RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: planId, error: null });
    mockedCreateClient.mockResolvedValue({ rpc } as never);
    const { saveInterviewPlan } = await interviewPlansModule();

    await expect(saveInterviewPlan(organizationId, jobId, input)).resolves.toBe(planId);

    expect(rpc).toHaveBeenCalledWith("save_interview_plan", {
      p_organization_id: organizationId,
      p_job_id: jobId,
      p_total_duration_seconds: 900,
      p_sections: input.sections,
    });
  });

  it("loads the latest tenant- and job-bound plan with ordered links", async () => {
    const query = readClient({
      data: {
        total_duration_seconds: 900,
        interview_plan_sections: [
          {
            purpose: "Technical fundamentals",
            duration_seconds: 300,
            position: 0,
            interview_plan_section_questions: [
              {
                question_id: "33333333-3333-4333-8333-333333333333",
                question_position: 0,
              },
            ],
            interview_plan_section_competencies: [
              { competency_id: "44444444-4444-4444-8444-444444444444" },
            ],
          },
          {
            purpose: "Problem solving",
            duration_seconds: 600,
            position: 1,
            interview_plan_section_questions: [
              {
                question_id: "66666666-6666-4666-8666-666666666666",
                question_position: 0,
              },
            ],
            interview_plan_section_competencies: [
              { competency_id: "77777777-7777-4777-8777-777777777777" },
            ],
          },
        ],
      },
      error: null,
    });
    mockedCreateClient.mockResolvedValue({ from: query.from } as never);
    const { getInterviewPlan } = await interviewPlansModule();

    await expect(getInterviewPlan(organizationId, jobId)).resolves.toEqual(input);

    expect(query.from).toHaveBeenCalledWith("interview_plans");
    expect(query.firstEq).toHaveBeenCalledWith("organization_id", organizationId);
    expect(query.secondEq).toHaveBeenCalledWith("job_id", jobId);
    expect(query.order).toHaveBeenCalledWith("updated_at", { ascending: false });
    expect(query.limit).toHaveBeenCalledWith(1);
  });

  it("returns null when no plan exists", async () => {
    const query = readClient({ data: null, error: null });
    mockedCreateClient.mockResolvedValue({ from: query.from } as never);
    const { getInterviewPlan } = await interviewPlansModule();

    await expect(getInterviewPlan(organizationId, jobId)).resolves.toBeNull();
  });

  it("fails closed without leaking provider errors", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "database internals" },
    });
    mockedCreateClient.mockResolvedValue({ rpc } as never);
    const { saveInterviewPlan } = await interviewPlansModule();

    await expect(saveInterviewPlan(organizationId, jobId, input)).rejects.toThrow(
      "Unable to save interview plan.",
    );

    const query = readClient({ data: null, error: { message: "database internals" } });
    mockedCreateClient.mockResolvedValue({ from: query.from } as never);
    const { getInterviewPlan } = await interviewPlansModule();
    await expect(getInterviewPlan(organizationId, jobId)).rejects.toThrow(
      "Unable to load interview plan.",
    );
  });
});
