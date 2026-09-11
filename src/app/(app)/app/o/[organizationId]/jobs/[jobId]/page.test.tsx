import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { getJob } from "@/lib/jobs/jobs";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import JobPage from "./page";

vi.mock("@/components/jobs/job-form", () => ({
  JobForm: ({
    initialJob,
    readOnly,
  }: {
    initialJob: { title: string };
    readOnly: boolean;
  }) => (
    <div>
      {initialJob.title} — {readOnly ? "read only" : "editable"}
    </div>
  ),
}));
vi.mock("@/lib/jobs/jobs", () => ({ getJob: vi.fn() }));
vi.mock("@/lib/organization/require-membership", () => ({
  requireOrganizationMembership: vi.fn(),
}));
vi.mock("../job-actions", () => ({ updateJobAction: vi.fn() }));

const mockedGetJob = vi.mocked(getJob);
const mockedRequireMembership = vi.mocked(requireOrganizationMembership);
const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const job = {
  id: jobId,
  title: "Senior Platform Engineer",
  department: "Engineering",
  description: "Build reliable systems.",
  responsibilities: "Own platform reliability.",
  seniority: "Senior",
  employmentType: "Full-time",
  location: "Remote",
  salaryRange: "80k-100k",
  interviewInstructions: "Use job-related evidence.",
  requirements: [{ kind: "must_have" as const, requirement: "TypeScript" }],
};

async function renderPage() {
  render(
    await JobPage({
      params: Promise.resolve({ organizationId, jobId }),
    }),
  );
}

describe("job detail page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetJob.mockResolvedValue(job);
  });

  it("loads the route-bound tenant job as editable for a manager", async () => {
    mockedRequireMembership.mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "hiring_manager",
    });

    await renderPage();

    expect(mockedRequireMembership).toHaveBeenCalledWith(organizationId);
    expect(mockedGetJob).toHaveBeenCalledWith(organizationId, jobId);
    expect(screen.getByText(/Senior Platform Engineer — editable/)).toBeInTheDocument();
  });

  it("renders the same tenant job read-only for a reviewer", async () => {
    mockedRequireMembership.mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "reviewer",
    });

    await renderPage();

    expect(mockedGetJob).toHaveBeenCalledWith(organizationId, jobId);
    expect(screen.getByText(/Senior Platform Engineer — read only/)).toBeInTheDocument();
  });
});
