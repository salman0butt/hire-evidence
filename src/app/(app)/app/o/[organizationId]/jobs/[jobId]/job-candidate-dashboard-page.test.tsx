import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createJobCandidateDashboardRepository } from "@/lib/review/job-candidate-dashboard-repository";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import JobPage from "./page";

vi.mock("@/components/jobs/job-form", () => ({ JobForm: () => null }));
vi.mock("@/components/jobs/competency-section", () => ({ CompetencySection: () => null }));
vi.mock("@/components/jobs/question-section", () => ({ QuestionSection: () => null }));
vi.mock("@/components/jobs/interview-plan-section", () => ({ InterviewPlanSection: () => null }));
vi.mock("@/components/jobs/interviewer-config-section", () => ({ InterviewerConfigSection: () => null }));
vi.mock("@/components/jobs/interviewer-publication-section", () => ({ InterviewerPublicationSection: () => null }));
vi.mock("@/components/jobs/interviewer-preview-section", () => ({ InterviewerPreviewSection: () => null }));
vi.mock("@/lib/jobs/jobs", () => ({ getJob: vi.fn().mockResolvedValue({ id: "job", title: "Platform Engineer" }) }));
vi.mock("@/lib/interviewer/competencies", () => ({ listCompetencies: vi.fn().mockResolvedValue([]) }));
vi.mock("@/lib/interviewer/questions", () => ({ listQuestions: vi.fn().mockResolvedValue([]) }));
vi.mock("@/lib/interviewer/interview-plans", () => ({ getInterviewPlan: vi.fn().mockResolvedValue(null), getLatestInterviewPlanId: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/interviewer/interviewer-configs", () => ({ getLatestInterviewerConfig: vi.fn().mockResolvedValue(null) }));
vi.mock("@/lib/organization/require-membership", () => ({ requireOrganizationMembership: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn().mockResolvedValue({}) }));
vi.mock("@/lib/review/job-candidate-dashboard-repository", () => ({ createJobCandidateDashboardRepository: vi.fn() }));
vi.mock("../job-actions", () => ({ updateJobAction: vi.fn() }));
vi.mock("./competency-actions", () => ({ createCompetencyAction: vi.fn(), saveCompetencyRubricAction: vi.fn() }));
vi.mock("./question-actions", () => ({ createQuestionAction: vi.fn() }));
vi.mock("./interview-plan-actions", () => ({ saveInterviewPlanAction: vi.fn() }));
vi.mock("./interviewer-config-actions", () => ({ saveInterviewerConfigAction: vi.fn() }));
vi.mock("./interviewer-publish-actions", () => ({ publishInterviewerConfigAction: vi.fn() }));
vi.mock("./interviewer-preview-actions", () => ({ previewInterviewerConfigAction: vi.fn() }));

const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const getJobCandidateDashboard = vi.fn();

describe("job candidate review dashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireOrganizationMembership).mockResolvedValue({ organizationId, organizationName: "Evidence Co", role: "reviewer" });
    getJobCandidateDashboard.mockResolvedValue([
      {
        candidateId: "33333333-3333-4333-8333-333333333333",
        candidateName: "Ada Candidate",
        attemptId: "44444444-4444-4444-8444-444444444444",
        interviewStatus: "completed",
        assessmentGenerationId: "55555555-5555-4555-8555-555555555555",
        generationNumber: 2,
        reviewStatus: "in_review",
        reviewUpdatedAt: "2026-09-21T09:00:00.000Z",
      },
    ]);
    vi.mocked(createJobCandidateDashboardRepository).mockReturnValue({ getJobCandidateDashboard });
  });

  it("shows neutral workflow state and links to human review without AI ranking", async () => {
    render(await JobPage({ params: Promise.resolve({ organizationId, jobId }) }));

    expect(getJobCandidateDashboard).toHaveBeenCalledWith(organizationId, jobId);
    expect(screen.getByRole("heading", { name: "Candidate review" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Review Ada Candidate" })).toHaveAttribute(
      "href",
      `/app/o/${organizationId}/jobs/${jobId}/candidates/33333333-3333-4333-8333-333333333333`,
    );
    expect(screen.getByText("In review")).toBeInTheDocument();
    expect(screen.queryByText(/rank|recommended|best candidate/i)).not.toBeInTheDocument();
  });

  it("offers accessible filtering and sorting using neutral workflow metadata only", async () => {
    render(await JobPage({ params: Promise.resolve({ organizationId, jobId }) }));

    expect(screen.getByRole("combobox", { name: "Filter by review status" })).toBeInTheDocument();
    expect(screen.getByRole("combobox", { name: "Sort candidates" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "All review statuses" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Awaiting review" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "In review" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Reviewed" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Candidate name" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Review status" })).toBeInTheDocument();
    expect(screen.queryByRole("option", { name: /score|rank|recommend/i })).not.toBeInTheDocument();
  });
});
