import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { listJobs } from "@/lib/jobs/jobs";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import JobsPage from "./page";

vi.mock("@/components/jobs/job-list", () => ({
  JobList: ({ canManage }: { canManage: boolean }) => (
    <div>Job list {canManage ? "manageable" : "read only"}</div>
  ),
}));
vi.mock("@/lib/jobs/jobs", () => ({ listJobs: vi.fn() }));
vi.mock("@/lib/organization/require-membership", () => ({
  requireOrganizationMembership: vi.fn(),
}));

const mockedListJobs = vi.mocked(listJobs);
const mockedRequireMembership = vi.mocked(requireOrganizationMembership);
const organizationId = "11111111-1111-4111-8111-111111111111";

async function renderPage() {
  render(
    await JobsPage({
      params: Promise.resolve({ organizationId }),
    }),
  );
}

describe("jobs page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedListJobs.mockResolvedValue([]);
  });

  it("loads tenant jobs and grants management UI to an authorized role", async () => {
    mockedRequireMembership.mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "recruiter",
    });

    await renderPage();

    expect(mockedRequireMembership).toHaveBeenCalledWith(organizationId);
    expect(mockedListJobs).toHaveBeenCalledWith(organizationId);
    expect(screen.getByText("Job list manageable")).toBeInTheDocument();
  });

  it("renders tenant jobs read-only for a reviewer", async () => {
    mockedRequireMembership.mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "reviewer",
    });

    await renderPage();

    expect(mockedListJobs).toHaveBeenCalledWith(organizationId);
    expect(screen.getByText("Job list read only")).toBeInTheDocument();
  });
});
