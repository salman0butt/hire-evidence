import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

import { createCompetency, listCompetencies } from "./competencies";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const competencyId = "33333333-3333-4333-8333-333333333333";

const input = {
  name: "Systems design",
  description: "Designs reliable job-relevant systems.",
  weight: 40,
  position: 1,
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

describe("competency repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates competencies through the tenant- and job-bound authoritative RPC", async () => {
    const rpc = rpcClient({ data: competencyId, error: null });

    await expect(
      createCompetency(organizationId, jobId, input),
    ).resolves.toBe(competencyId);

    expect(rpc).toHaveBeenCalledWith("create_competency", {
      p_organization_id: organizationId,
      p_job_id: jobId,
      p_name: input.name,
      p_description: input.description,
      p_weight: input.weight,
      p_position: input.position,
    });
  });

  it("lists route-bound competencies in deterministic position order", async () => {
    const { from, query } = queryClient({
      data: [
        {
          id: competencyId,
          job_id: jobId,
          name: input.name,
          description: input.description,
          weight: input.weight,
          position: input.position,
        },
      ],
      error: null,
    });

    await expect(listCompetencies(organizationId, jobId)).resolves.toEqual([
      {
        id: competencyId,
        jobId,
        ...input,
      },
    ]);

    expect(from).toHaveBeenCalledWith("competencies");
    expect(query.eq).toHaveBeenNthCalledWith(1, "organization_id", organizationId);
    expect(query.eq).toHaveBeenNthCalledWith(2, "job_id", jobId);
    expect(query.order).toHaveBeenNthCalledWith(1, "position", { ascending: true });
    expect(query.order).toHaveBeenNthCalledWith(2, "id", { ascending: true });
  });

  it("fails closed without leaking provider errors", async () => {
    rpcClient({ data: null, error: { message: "database internals" } });

    await expect(createCompetency(organizationId, jobId, input)).rejects.toThrow(
      "Unable to create competency.",
    );
  });
});
