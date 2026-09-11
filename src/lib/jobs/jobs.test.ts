import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

import {
  createJob,
  deleteJob,
  getJob,
  listJobs,
  updateJob,
} from "./jobs";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";

const jobInput = {
  title: "Senior Platform Engineer",
  department: "Engineering",
  description: "Build reliable systems.",
  responsibilities: "Own platform reliability.",
  seniority: "Senior",
  employmentType: "Full-time",
  location: "Remote",
  salaryRange: "80k-100k",
  interviewInstructions: "Focus on job-related evidence.",
  requirements: [
    { kind: "must_have" as const, requirement: "TypeScript" },
    { kind: "nice_to_have" as const, requirement: "Kubernetes" },
  ],
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
    maybeSingle: vi.fn(),
  };

  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.order.mockReturnValue(query);
  query.maybeSingle.mockResolvedValue(result as never);

  const from = vi.fn().mockReturnValue(query);
  mockedCreateClient.mockResolvedValue({ from } as never);
  return { from, query };
}

describe("job repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates jobs through the tenant-bound authoritative RPC", async () => {
    const rpc = rpcClient({ data: jobId, error: null });

    await expect(createJob(organizationId, jobInput)).resolves.toBe(jobId);

    expect(rpc).toHaveBeenCalledWith("create_job", {
      p_organization_id: organizationId,
      p_title: jobInput.title,
      p_department: jobInput.department,
      p_description: jobInput.description,
      p_responsibilities: jobInput.responsibilities,
      p_seniority: jobInput.seniority,
      p_employment_type: jobInput.employmentType,
      p_location: jobInput.location,
      p_salary_range: jobInput.salaryRange,
      p_interview_instructions: jobInput.interviewInstructions,
      p_requirements: jobInput.requirements,
    });
  });

  it("updates and deletes only through route-bound organization RPC arguments", async () => {
    const rpc = rpcClient({ data: null, error: null });

    await updateJob(organizationId, jobId, jobInput);
    await deleteJob(organizationId, jobId);

    expect(rpc).toHaveBeenNthCalledWith(1, "update_job", {
      p_organization_id: organizationId,
      p_job_id: jobId,
      p_title: jobInput.title,
      p_department: jobInput.department,
      p_description: jobInput.description,
      p_responsibilities: jobInput.responsibilities,
      p_seniority: jobInput.seniority,
      p_employment_type: jobInput.employmentType,
      p_location: jobInput.location,
      p_salary_range: jobInput.salaryRange,
      p_interview_instructions: jobInput.interviewInstructions,
      p_requirements: jobInput.requirements,
    });
    expect(rpc).toHaveBeenNthCalledWith(2, "delete_job", {
      p_organization_id: organizationId,
      p_job_id: jobId,
    });
  });

  it("loads one route-bound job and maps requirements deterministically", async () => {
    const { from, query } = queryClient({
      data: {
        id: jobId,
        title: jobInput.title,
        department: jobInput.department,
        description: jobInput.description,
        responsibilities: jobInput.responsibilities,
        seniority: jobInput.seniority,
        employment_type: jobInput.employmentType,
        location: jobInput.location,
        salary_range: jobInput.salaryRange,
        interview_instructions: jobInput.interviewInstructions,
        job_requirements: [
          { kind: "nice_to_have", requirement: "Kubernetes", position: 1 },
          { kind: "must_have", requirement: "TypeScript", position: 0 },
        ],
      },
      error: null,
    });

    await expect(getJob(organizationId, jobId)).resolves.toEqual({
      id: jobId,
      ...jobInput,
    });

    expect(from).toHaveBeenCalledWith("jobs");
    expect(query.eq).toHaveBeenNthCalledWith(1, "organization_id", organizationId);
    expect(query.eq).toHaveBeenNthCalledWith(2, "id", jobId);
  });

  it("lists only route-bound jobs in deterministic order", async () => {
    const { from, query } = queryClient({
      data: [],
      error: null,
    });
    query.order
      .mockReturnValueOnce(query)
      .mockResolvedValueOnce({ data: [], error: null } as never);

    await expect(listJobs(organizationId)).resolves.toEqual([]);

    expect(from).toHaveBeenCalledWith("jobs");
    expect(query.eq).toHaveBeenCalledWith("organization_id", organizationId);
    expect(query.order).toHaveBeenNthCalledWith(1, "title", { ascending: true });
    expect(query.order).toHaveBeenNthCalledWith(2, "id", { ascending: true });
  });

  it("fails closed without leaking provider errors", async () => {
    rpcClient({ data: null, error: { message: "database internals" } });

    await expect(createJob(organizationId, jobInput)).rejects.toThrow(
      "Unable to create job.",
    );
  });
});
