import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

import { createCandidate, listCandidates } from "./candidates";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const candidateId = "33333333-3333-4333-8333-333333333333";

const candidateInput = {
  fullName: "Ada Lovelace",
  email: "ada@example.com",
};

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

describe("candidate repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates candidates only through the tenant- and job-bound authoritative RPC", async () => {
    const rpc = rpcClient({ data: candidateId, error: null });

    await expect(
      createCandidate(organizationId, jobId, candidateInput),
    ).resolves.toBe(candidateId);

    expect(rpc).toHaveBeenCalledWith("create_candidate", {
      p_organization_id: organizationId,
      p_job_id: jobId,
      p_full_name: candidateInput.fullName,
      p_email: candidateInput.email,
    });
  });

  it("lists only candidates bound to the requested organization and job", async () => {
    const { from, query } = queryClient({
      data: [
        {
          id: candidateId,
          job_id: jobId,
          full_name: candidateInput.fullName,
          email: candidateInput.email,
          created_at: "2026-09-12T06:00:00.000Z",
        },
      ],
      error: null,
    });

    await expect(listCandidates(organizationId, jobId)).resolves.toEqual([
      {
        id: candidateId,
        jobId,
        fullName: candidateInput.fullName,
        email: candidateInput.email,
        createdAt: "2026-09-12T06:00:00.000Z",
      },
    ]);

    expect(from).toHaveBeenCalledWith("candidates");
    expect(query.eq).toHaveBeenNthCalledWith(1, "organization_id", organizationId);
    expect(query.eq).toHaveBeenNthCalledWith(2, "job_id", jobId);
    expect(query.order).toHaveBeenNthCalledWith(1, "created_at", { ascending: true });
    expect(query.order).toHaveBeenNthCalledWith(2, "id", { ascending: true });
  });

  it("fails closed without exposing provider errors", async () => {
    rpcClient({ data: null, error: { message: "database internals" } });

    await expect(
      createCandidate(organizationId, jobId, candidateInput),
    ).rejects.toThrow("Unable to create candidate.");
  });
});
