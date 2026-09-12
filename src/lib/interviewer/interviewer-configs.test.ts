import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const planId = "33333333-3333-4333-8333-333333333333";
const configId = "44444444-4444-4444-8444-444444444444";

const input = {
  name: "Senior Backend Engineering Interviewer",
  interviewType: "technical",
  persona: "professional",
  language: "en",
  durationSeconds: 1800,
  difficulty: "medium",
  questionMode: "semi_adaptive",
  guidelines: "Ask one question at a time and use neutral follow-ups.",
  candidateInstructions: "Answer with concrete examples from your experience.",
  followUpPolicy: {
    maxFollowUpsPerQuestion: 2,
    allowedReasons: [
      "clarify_ambiguity",
      "request_example",
      "explore_reasoning",
      "missing_required_dimension",
    ],
  },
};

type InterviewerConfigFixture = typeof input;

async function interviewerConfigsModule() {
  const modulePath = "./interviewer-configs";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    saveInterviewerConfig: (
      organizationId: string,
      jobId: string,
      planId: string,
      configInput: InterviewerConfigFixture,
      configId?: string | null,
    ) => Promise<string>;
    getLatestInterviewerConfig: (
      organizationId: string,
      jobId: string,
    ) => Promise<
      | (InterviewerConfigFixture & {
          id: string;
          planId: string;
        })
      | null
    >;
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

describe("interviewer configuration repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("saves a validated tenant/job/plan-bound draft through the fixed-role RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: configId, error: null });
    mockedCreateClient.mockResolvedValue({ rpc } as never);
    const { saveInterviewerConfig } = await interviewerConfigsModule();

    await expect(
      saveInterviewerConfig(organizationId, jobId, planId, input),
    ).resolves.toBe(configId);

    expect(rpc).toHaveBeenCalledWith("save_interviewer_config", {
      p_organization_id: organizationId,
      p_job_id: jobId,
      p_plan_id: planId,
      p_name: input.name,
      p_interview_type: input.interviewType,
      p_persona: input.persona,
      p_language: input.language,
      p_duration_seconds: input.durationSeconds,
      p_difficulty: input.difficulty,
      p_question_mode: input.questionMode,
      p_guidelines: input.guidelines,
      p_candidate_instructions: input.candidateInstructions,
      p_max_follow_ups_per_question: input.followUpPolicy.maxFollowUpsPerQuestion,
      p_follow_up_reasons: input.followUpPolicy.allowedReasons,
      p_config_id: null,
    });
  });

  it("updates an existing draft only by explicit configuration id", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: configId, error: null });
    mockedCreateClient.mockResolvedValue({ rpc } as never);
    const { saveInterviewerConfig } = await interviewerConfigsModule();

    await expect(
      saveInterviewerConfig(organizationId, jobId, planId, input, configId),
    ).resolves.toBe(configId);

    expect(rpc).toHaveBeenCalledWith(
      "save_interviewer_config",
      expect.objectContaining({ p_config_id: configId }),
    );
  });

  it("loads the latest tenant/job-bound configuration without widening scope", async () => {
    const query = readClient({
      data: {
        id: configId,
        plan_id: planId,
        name: input.name,
        interview_type: input.interviewType,
        persona: input.persona,
        language: input.language,
        duration_seconds: input.durationSeconds,
        difficulty: input.difficulty,
        question_mode: input.questionMode,
        guidelines: input.guidelines,
        candidate_instructions: input.candidateInstructions,
        max_follow_ups_per_question: input.followUpPolicy.maxFollowUpsPerQuestion,
        follow_up_reasons: input.followUpPolicy.allowedReasons,
      },
      error: null,
    });
    mockedCreateClient.mockResolvedValue({ from: query.from } as never);
    const { getLatestInterviewerConfig } = await interviewerConfigsModule();

    await expect(
      getLatestInterviewerConfig(organizationId, jobId),
    ).resolves.toEqual({ id: configId, planId, ...input });

    expect(query.from).toHaveBeenCalledWith("interviewer_configs");
    expect(query.firstEq).toHaveBeenCalledWith("organization_id", organizationId);
    expect(query.secondEq).toHaveBeenCalledWith("job_id", jobId);
    expect(query.order).toHaveBeenCalledWith("updated_at", { ascending: false });
    expect(query.limit).toHaveBeenCalledWith(1);
  });

  it("returns null when no configuration exists and fails closed on provider errors", async () => {
    const emptyQuery = readClient({ data: null, error: null });
    mockedCreateClient.mockResolvedValue({ from: emptyQuery.from } as never);
    const { getLatestInterviewerConfig, saveInterviewerConfig } =
      await interviewerConfigsModule();

    await expect(
      getLatestInterviewerConfig(organizationId, jobId),
    ).resolves.toBeNull();

    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "database internals" },
    });
    mockedCreateClient.mockResolvedValue({ rpc } as never);
    await expect(
      saveInterviewerConfig(organizationId, jobId, planId, input),
    ).rejects.toThrow("Unable to save interviewer configuration.");

    const failedQuery = readClient({
      data: null,
      error: { message: "database internals" },
    });
    mockedCreateClient.mockResolvedValue({ from: failedQuery.from } as never);
    await expect(
      getLatestInterviewerConfig(organizationId, jobId),
    ).rejects.toThrow("Unable to load interviewer configuration.");
  });
});
