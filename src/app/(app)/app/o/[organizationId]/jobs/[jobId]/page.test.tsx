import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { listCompetencies } from "@/lib/interviewer/competencies";
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
vi.mock("@/components/jobs/competency-section", () => ({
  CompetencySection: ({
    competencies,
    readOnly,
    rubricAction,
  }: {
    competencies: Array<{ name: string }>;
    readOnly?: boolean;
    rubricAction?: unknown;
  }) => (
    <div>
      Competencies: {competencies.map((competency) => competency.name).join(", ")} —{" "}
      {readOnly ? "read only" : "editable"} —{" "}
      {rubricAction ? "rubric save connected" : "rubric save disconnected"}
    </div>
  ),
}));
vi.mock("@/lib/jobs/jobs", () => ({ getJob: vi.fn() }));
vi.mock("@/lib/interviewer/competencies", () => ({ listCompetencies: vi.fn() }));
vi.mock("@/lib/organization/require-membership", () => ({
  requireOrganizationMembership: vi.fn(),
}));
vi.mock("../job-actions", () => ({ updateJobAction: vi.fn() }));
vi.mock("./competency-actions", () => ({
  createCompetencyAction: vi.fn(),
  saveCompetencyRubricAction: vi.fn(),
}));

const mockedGetJob = vi.mocked(getJob);
const mockedListCompetencies = vi.mocked(listCompetencies);
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
const competencies = [
  {
    id: "33333333-3333-4333-8333-333333333333",
    jobId,
    name: "Systems design",
    description: "Designs reliable job-relevant systems.",
    weight: 40,
    position: 0,
  },
];

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
    mockedListCompetencies.mockResolvedValue(competencies);
  });

  it("loads route-bound job and competencies as editable for a manager with rubric saving connected", async () => {
    mockedRequireMembership.mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "hiring_manager",
    });

    await renderPage();

    expect(mockedRequireMembership).toHaveBeenCalledWith(organizationId);
    expect(mockedGetJob).toHaveBeenCalledWith(organizationId, jobId);
    expect(mockedListCompetencies).toHaveBeenCalledWith(organizationId, jobId);
    expect(screen.getByText(/Senior Platform Engineer — editable/)).toBeInTheDocument();
    expect(
      screen.getByText(/Competencies: Systems design — editable — rubric save connected/),
    ).toBeInTheDocument();
  });

  it("renders the same tenant job and competencies read-only without rubric persistence for a reviewer", async () => {
    mockedRequireMembership.mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "reviewer",
    });

    await renderPage();

    expect(mockedGetJob).toHaveBeenCalledWith(organizationId, jobId);
    expect(mockedListCompetencies).toHaveBeenCalledWith(organizationId, jobId);
    expect(screen.getByText(/Senior Platform Engineer — read only/)).toBeInTheDocument();
    expect(
      screen.getByText(/Competencies: Systems design — read only — rubric save disconnected/),
    ).toBeInTheDocument();
  });
});
