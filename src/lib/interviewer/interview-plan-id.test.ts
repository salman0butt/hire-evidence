import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const planId = "55555555-5555-4555-8555-555555555555";

async function interviewPlansModule() {
  const modulePath = "./interview-plans";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    getLatestInterviewPlanId: (
      organizationId: string,
      jobId: string,
    ) => Promise<string | null>;
  }>;
}

function query(result: { data: unknown; error: unknown }) {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const limit = vi.fn(() => ({ maybeSingle }));
  const order = vi.fn(() => ({ limit }));
  const secondEq = vi.fn(() => ({ order }));
  const firstEq = vi.fn(() => ({ eq: secondEq }));
  const select = vi.fn(() => ({ eq: firstEq }));
  const from = vi.fn(() => ({ select }));
  return { from, select, firstEq, secondEq, order, limit, maybeSingle };
}

describe("latest interview plan id", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads the latest plan id through tenant- and job-bound predicates", async () => {
    const chain = query({ data: { id: planId }, error: null });
    mockedCreateClient.mockResolvedValue({ from: chain.from } as never);
    const { getLatestInterviewPlanId } = await interviewPlansModule();

    await expect(getLatestInterviewPlanId(organizationId, jobId)).resolves.toBe(planId);
    expect(chain.from).toHaveBeenCalledWith("interview_plans");
    expect(chain.select).toHaveBeenCalledWith("id");
    expect(chain.firstEq).toHaveBeenCalledWith("organization_id", organizationId);
    expect(chain.secondEq).toHaveBeenCalledWith("job_id", jobId);
    expect(chain.order).toHaveBeenCalledWith("updated_at", { ascending: false });
    expect(chain.limit).toHaveBeenCalledWith(1);
  });

  it("returns null when no plan exists and fails closed on provider errors", async () => {
    const empty = query({ data: null, error: null });
    mockedCreateClient.mockResolvedValue({ from: empty.from } as never);
    const { getLatestInterviewPlanId } = await interviewPlansModule();
    await expect(getLatestInterviewPlanId(organizationId, jobId)).resolves.toBeNull();

    const failed = query({ data: null, error: { message: "provider internals" } });
    mockedCreateClient.mockResolvedValue({ from: failed.from } as never);
    await expect(getLatestInterviewPlanId(organizationId, jobId)).rejects.toThrow(
      "Unable to load interview plan.",
    );
  });
});
