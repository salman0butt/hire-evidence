import { beforeEach, describe, expect, it, vi } from "vitest";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { createJob, deleteJob, updateJob } from "@/lib/jobs/jobs";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import {
  createJobAction,
  deleteJobAction,
  updateJobAction,
} from "./job-actions";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth/require-user", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/organization/require-membership", () => ({
  requireOrganizationMembership: vi.fn(),
}));
vi.mock("@/lib/jobs/jobs", () => ({
  createJob: vi.fn(),
  updateJob: vi.fn(),
  deleteJob: vi.fn(),
}));

const organizationId = "11111111-1111-4111-8111-111111111111";
const attackerOrganizationId = "99999999-9999-4999-8999-999999999999";
const jobId = "22222222-2222-4222-8222-222222222222";
const idleState = { status: "idle" as const, message: null };

function formData() {
  const data = new FormData();
  data.set("organization_id", attackerOrganizationId);
  data.set("title", "  Senior Platform Engineer  ");
  data.set("department", " Engineering ");
  data.set("description", " Build reliable systems. ");
  data.set("responsibilities", " Own platform reliability. ");
  data.set("seniority", " Senior ");
  data.set("employment_type", " Full-time ");
  data.set("location", " Remote ");
  data.set("salary_range", " 80k-100k ");
  data.set("interview_instructions", " Use job-related evidence. ");
  data.set("must_have_requirements", " TypeScript \n PostgreSQL \n\n");
  data.set("nice_to_have_requirements", " Kubernetes \n");
  return data;
}

describe("job server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireUser).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Acme",
      role: "recruiter",
    });
  });

  it("creates against the route-bound organization and ignores forged form organization ids", async () => {
    vi.mocked(createJob).mockResolvedValue(jobId);

    await expect(
      createJobAction(organizationId, idleState, formData()),
    ).resolves.toEqual({ status: "success", message: "Job created." });

    expect(createJob).toHaveBeenCalledWith(organizationId, {
      title: "Senior Platform Engineer",
      department: "Engineering",
      description: "Build reliable systems.",
      responsibilities: "Own platform reliability.",
      seniority: "Senior",
      employmentType: "Full-time",
      location: "Remote",
      salaryRange: "80k-100k",
      interviewInstructions: "Use job-related evidence.",
      requirements: [
        { kind: "must_have", requirement: "TypeScript" },
        { kind: "must_have", requirement: "PostgreSQL" },
        { kind: "nice_to_have", requirement: "Kubernetes" },
      ],
    });
    expect(createJob).not.toHaveBeenCalledWith(
      attackerOrganizationId,
      expect.anything(),
    );
    expect(revalidatePath).toHaveBeenCalledWith(`/app/o/${organizationId}/jobs`);
  });

  it("requires jobs:manage before mutation", async () => {
    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Acme",
      role: "reviewer",
    });

    await expect(
      createJobAction(organizationId, idleState, formData()),
    ).resolves.toEqual({
      status: "error",
      message: "You do not have permission to manage jobs.",
    });
    expect(createJob).not.toHaveBeenCalled();
  });

  it("returns validation errors before calling persistence", async () => {
    const data = formData();
    data.set("title", "   ");

    await expect(createJobAction(organizationId, idleState, data)).resolves.toEqual({
      status: "error",
      message: "Job title is required.",
    });
    expect(createJob).not.toHaveBeenCalled();
  });

  it("updates and deletes only the route-bound job and organization", async () => {
    vi.mocked(updateJob).mockResolvedValue(undefined);
    vi.mocked(deleteJob).mockResolvedValue(undefined);

    await expect(
      updateJobAction(organizationId, jobId, idleState, formData()),
    ).resolves.toEqual({ status: "success", message: "Job updated." });
    await expect(
      deleteJobAction(organizationId, jobId, idleState, new FormData()),
    ).resolves.toEqual({ status: "success", message: "Job deleted." });

    expect(updateJob).toHaveBeenCalledWith(
      organizationId,
      jobId,
      expect.objectContaining({ title: "Senior Platform Engineer" }),
    );
    expect(deleteJob).toHaveBeenCalledWith(organizationId, jobId);
  });

  it("rejects malformed route identifiers without touching auth or persistence", async () => {
    await expect(
      createJobAction("not-a-uuid", idleState, formData()),
    ).resolves.toEqual({ status: "error", message: "Choose a valid organization." });
    await expect(
      updateJobAction(organizationId, "not-a-uuid", idleState, formData()),
    ).resolves.toEqual({ status: "error", message: "Choose a valid job." });

    expect(requireUser).not.toHaveBeenCalled();
    expect(createJob).not.toHaveBeenCalled();
    expect(updateJob).not.toHaveBeenCalled();
  });
});
