import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const competencyId = "33333333-3333-4333-8333-333333333333";
const questionId = "44444444-4444-4444-8444-444444444444";

const input = {
  questionText: "Describe a production incident you owned.",
  difficulty: "hard" as const,
  expectedAreas: ["diagnosis", "remediation"],
  followUpHints: ["Ask about verification."],
  maxDurationSeconds: 600,
  isRequired: true,
  position: 1,
};

async function questionsModule() {
  const modulePath = "./questions";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    createQuestion: (
      organizationId: string,
      jobId: string,
      competencyId: string,
      input: typeof input,
    ) => Promise<string>;
    listQuestions: (organizationId: string, jobId: string) => Promise<unknown[]>;
  }>;
}

function rpcClient(result: { data: unknown; error: unknown }) {
  const rpc = vi.fn().mockResolvedValue(result);
  mockedCreateClient.mockResolvedValue({ rpc } as never);
  return rpc;
}

function queryClient(result: { data: unknown; error: unknown }) {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    order: vi.fn(),
  };
  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.order
    .mockReturnValueOnce(query)
    .mockResolvedValueOnce(result as never);

  const from = vi.fn().mockReturnValue(query);
  mockedCreateClient.mockResolvedValue({ from } as never);
  return { from, query };
}

describe("question repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates questions through the tenant-, job-, and competency-bound RPC", async () => {
    const { createQuestion } = await questionsModule();
    const rpc = rpcClient({ data: questionId, error: null });

    await expect(
      createQuestion(organizationId, jobId, competencyId, input),
    ).resolves.toBe(questionId);

    expect(rpc).toHaveBeenCalledWith("create_question", {
      p_organization_id: organizationId,
      p_job_id: jobId,
      p_competency_id: competencyId,
      p_question_text: input.questionText,
      p_difficulty: input.difficulty,
      p_expected_areas: input.expectedAreas,
      p_follow_up_hints: input.followUpHints,
      p_max_duration_seconds: input.maxDurationSeconds,
      p_is_required: input.isRequired,
      p_position: input.position,
    });
  });

  it("lists route-bound questions in deterministic position order", async () => {
    const { listQuestions } = await questionsModule();
    const { from, query } = queryClient({
      data: [
        {
          id: questionId,
          job_id: jobId,
          competency_id: competencyId,
          question_text: input.questionText,
          difficulty: input.difficulty,
          expected_areas: input.expectedAreas,
          follow_up_hints: input.followUpHints,
          max_duration_seconds: input.maxDurationSeconds,
          is_required: input.isRequired,
          position: input.position,
        },
      ],
      error: null,
    });

    await expect(listQuestions(organizationId, jobId)).resolves.toEqual([
      { id: questionId, jobId, competencyId, ...input },
    ]);

    expect(from).toHaveBeenCalledWith("questions");
    expect(query.eq).toHaveBeenNthCalledWith(1, "organization_id", organizationId);
    expect(query.eq).toHaveBeenNthCalledWith(2, "job_id", jobId);
    expect(query.order).toHaveBeenNthCalledWith(1, "position", { ascending: true });
    expect(query.order).toHaveBeenNthCalledWith(2, "id", { ascending: true });
  });

  it("fails closed without leaking provider errors", async () => {
    const { createQuestion } = await questionsModule();
    rpcClient({ data: null, error: { message: "database internals" } });

    await expect(
      createQuestion(organizationId, jobId, competencyId, input),
    ).rejects.toThrow("Unable to create question.");
  });
});
