import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import NewJobPage from "./page";

const { redirectMock } = vi.hoisted(() => ({
  redirectMock: vi.fn((href: string) => {
    throw new Error(`REDIRECT:${href}`);
  }),
}));

vi.mock("next/navigation", () => ({ redirect: redirectMock }));
vi.mock("@/components/jobs/job-form", () => ({
  JobForm: () => <div>Create job form</div>,
}));
vi.mock("@/lib/organization/require-membership", () => ({
  requireOrganizationMembership: vi.fn(),
}));
vi.mock("../job-actions", () => ({ createJobAction: vi.fn() }));

const mockedRequireMembership = vi.mocked(requireOrganizationMembership);
const organizationId = "11111111-1111-4111-8111-111111111111";

describe("new job page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the create form for a role with job management capability", async () => {
    mockedRequireMembership.mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "recruiter",
    });

    render(
      await NewJobPage({
        params: Promise.resolve({ organizationId }),
      }),
    );

    expect(mockedRequireMembership).toHaveBeenCalledWith(organizationId);
    expect(screen.getByText("Create job form")).toBeInTheDocument();
    expect(redirectMock).not.toHaveBeenCalled();
  });

  it("does not expose the create form to a reviewer", async () => {
    mockedRequireMembership.mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "reviewer",
    });

    await expect(
      NewJobPage({ params: Promise.resolve({ organizationId }) }),
    ).rejects.toThrow(`REDIRECT:/app/o/${organizationId}/jobs`);
    expect(redirectMock).toHaveBeenCalledWith(`/app/o/${organizationId}/jobs`);
  });
});
