import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { listCompetencies } from "@/lib/interviewer/competencies";
import { getLatestInterviewerConfig } from "@/lib/interviewer/interviewer-configs";
import { getInterviewPlan, getLatestInterviewPlanId } from "@/lib/interviewer/interview-plans";
import { listQuestions } from "@/lib/interviewer/questions";
import { getJob } from "@/lib/jobs/jobs";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import JobPage from "./page";

vi.mock("@/components/jobs/job-form", () => ({
  JobForm: ({ initialJob, readOnly }: { initialJob: { title: string }; readOnly: boolean }) => (
    <div>{initialJob.title} — {readOnly ? "read only" : "editable"}</div>
  ),
}));
vi.mock("@/components/jobs/competency-section", () => ({
  CompetencySection: ({ competencies, readOnly, rubricAction }: {
    competencies: Array<{ name: string }>;
    readOnly?: boolean;
    rubricAction?: unknown;
  }) => (
    <div>
      Competencies: {competencies.map((competency) => competency.name).join(", ")} —{" "}
      {readOnly ? "read only" : "editable"} — {rubricAction ? "rubric save connected" : "rubric save disconnected"}
    </div>
  ),
}));
vi.mock("@/components/jobs/question-section", () => ({
  QuestionSection: ({ questions, readOnly, action }: {
    questions: Array<{ questionText: string }>;
    readOnly?: boolean;
    action?: unknown;
  }) => (
    <div>
      Questions: {questions.map((question) => question.questionText).join(", ")} —{" "}
      {readOnly ? "read only" : "editable"} — {action ? "question create connected" : "question create disconnected"}
    </div>
  ),
}));
vi.mock("@/components/jobs/interview-plan-section", () => ({
  InterviewPlanSection: ({ initialPlan, readOnly, action }: {
    initialPlan?: { totalDurationSeconds: number } | null;
    readOnly?: boolean;
    action?: unknown;
  }) => (
    <div>
      Interview plan: {initialPlan?.totalDurationSeconds ?? 0}s — {readOnly ? "read only" : "editable"} —{" "}
      {action ? "plan save connected" : "plan save disconnected"}
    </div>
  ),
}));
vi.mock("@/components/jobs/interviewer-config-section", () => ({
  InterviewerConfigSection: ({ planId, initialConfig, readOnly, action }: {
    planId: string | null;
    initialConfig?: { name: string } | null;
    readOnly?: boolean;
    action?: unknown;
  }) => (
    <div>
      Interviewer config: {initialConfig?.name ?? "none"} — plan {planId ?? "none"} —{" "}
      {readOnly ? "read only" : "editable"} — {action ? "config save connected" : "config save disconnected"}
    </div>
  ),
}));
vi.mock("@/lib/jobs/jobs", () => ({ getJob: vi.fn() }));
vi.mock("@/lib/interviewer/competencies", () => ({ listCompetencies: vi.fn() }));
vi.mock("@/lib/interviewer/interviewer-configs", () => ({ getLatestInterviewerConfig: vi.fn() }));
vi.mock("@/lib/interviewer/interview-plans", () => ({
  getInterviewPlan: vi.fn(),
  getLatestInterviewPlanId: vi.fn(),
}));
vi.mock("@/lib/interviewer/questions", () => ({ listQuestions: vi.fn() }));
vi.mock("@/lib/organization/require-membership", () => ({ requireOrganizationMembership: vi.fn() }));
vi.mock("../job-actions", () => ({ updateJobAction: vi.fn() }));
vi.mock("./competency-actions", () => ({
  createCompetencyAction: vi.fn(),
  saveCompetencyRubricAction: vi.fn(),
}));
vi.mock("./question-actions", () => ({ createQuestionAction: vi.fn() }));
vi.mock("./interview-plan-actions", () => ({ saveInterviewPlanAction: vi.fn() }));
vi.mock("./interviewer-config-actions", () => ({ saveInterviewerConfigAction: vi.fn() }));

const mockedGetJob = vi.mocked(getJob);
const mockedListCompetencies = vi.mocked(listCompetencies);
const mockedGetInterviewPlan = vi.mocked(getInterviewPlan);
const mockedGetLatestInterviewPlanId = vi.mocked(getLatestInterviewPlanId);
const mockedGetLatestInterviewerConfig = vi.mocked(getLatestInterviewerConfig);
const mockedListQuestions = vi.mocked(listQuestions);
const mockedRequireMembership = vi.mocked(requireOrganizationMembership);
const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const competencyId = "33333333-3333-4333-8333-333333333333";
const questionId = "44444444-4444-4444-8444-444444444444";
const planId = "55555555-5555-4555-8555-555555555555";
const configId = "66666666-6666-4666-8666-666666666666";
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
const competencies = [{
  id: competencyId,
  jobId,
  name: "Systems design",
  description: "Designs reliable job-relevant systems.",
  weight: 40,
  position: 0,
}];
const questions = [{
  id: questionId,
  jobId,
  competencyId,
  questionText: "Describe a production incident you owned.",
  difficulty: "hard" as const,
  expectedAreas: ["diagnosis"],
  followUpHints: ["Ask about verification."],
  maxDurationSeconds: 600,
  isRequired: true,
  position: 0,
}];
const interviewPlan = {
  totalDurationSeconds: 600,
  sections: [{
    purpose: "Technical evidence",
    durationSeconds: 600,
    position: 0,
    questionIds: [questionId],
    competencyIds: [competencyId],
  }],
};
const interviewerConfig = {
  id: configId,
  planId,
  name: "Technical interviewer",
  interviewType: "technical" as const,
  persona: "professional" as const,
  language: "English",
  durationSeconds: 1800,
  difficulty: "hard" as const,
  questionMode: "semi_adaptive" as const,
  guidelines: "Ask for job-related evidence.",
  candidateInstructions: "Explain your reasoning.",
  followUpPolicy: {
    maxFollowUpsPerQuestion: 1,
    allowedReasons: ["clarify_ambiguity" as const],
  },
  status: "draft" as const,
  publishedAt: null,
};

async function renderPage() {
  render(await JobPage({ params: Promise.resolve({ organizationId, jobId }) }));
}

describe("job detail page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedGetJob.mockResolvedValue(job);
    mockedListCompetencies.mockResolvedValue(competencies);
    mockedListQuestions.mockResolvedValue(questions);
    mockedGetInterviewPlan.mockResolvedValue(interviewPlan);
    mockedGetLatestInterviewPlanId.mockResolvedValue(planId);
    mockedGetLatestInterviewerConfig.mockResolvedValue(interviewerConfig);
  });

  it("loads route-bound builder data as editable for a manager", async () => {
    mockedRequireMembership.mockResolvedValue({ organizationId, organizationName: "Evidence Co", role: "hiring_manager" });

    await renderPage();

    expect(mockedRequireMembership).toHaveBeenCalledWith(organizationId);
    expect(mockedGetJob).toHaveBeenCalledWith(organizationId, jobId);
    expect(mockedListCompetencies).toHaveBeenCalledWith(organizationId, jobId);
    expect(mockedListQuestions).toHaveBeenCalledWith(organizationId, jobId);
    expect(mockedGetInterviewPlan).toHaveBeenCalledWith(organizationId, jobId);
    expect(mockedGetLatestInterviewPlanId).toHaveBeenCalledWith(organizationId, jobId);
    expect(mockedGetLatestInterviewerConfig).toHaveBeenCalledWith(organizationId, jobId);
    expect(screen.getByText(/Senior Platform Engineer — editable/)).toBeInTheDocument();
    expect(screen.getByText(/Competencies: Systems design — editable — rubric save connected/)).toBeInTheDocument();
    expect(screen.getByText(/Questions: Describe a production incident you owned. — editable — question create connected/)).toBeInTheDocument();
    expect(screen.getByText(/Interview plan: 600s — editable — plan save connected/)).toBeInTheDocument();
    expect(screen.getByText(/Interviewer config: Technical interviewer — plan 55555555-5555-4555-8555-555555555555 — editable — config save connected/)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Publish interviewer configuration" })).toBeInTheDocument();
  });

  it("renders a published interviewer configuration read-only for a manager", async () => {
    mockedRequireMembership.mockResolvedValue({ organizationId, organizationName: "Evidence Co", role: "hiring_manager" });
    mockedGetLatestInterviewerConfig.mockResolvedValue({
      ...interviewerConfig,
      status: "published",
      publishedAt: "2026-09-12T05:00:00.000Z",
    });

    await renderPage();

    expect(screen.getByText(/Interviewer config: Technical interviewer — plan 55555555-5555-4555-8555-555555555555 — read only — config save disconnected/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Publish interviewer configuration" })).not.toBeInTheDocument();
  });

  it("renders the same tenant builder data read-only for a reviewer", async () => {
    mockedRequireMembership.mockResolvedValue({ organizationId, organizationName: "Evidence Co", role: "reviewer" });

    await renderPage();

    expect(mockedGetJob).toHaveBeenCalledWith(organizationId, jobId);
    expect(mockedListCompetencies).toHaveBeenCalledWith(organizationId, jobId);
    expect(mockedListQuestions).toHaveBeenCalledWith(organizationId, jobId);
    expect(mockedGetInterviewPlan).toHaveBeenCalledWith(organizationId, jobId);
    expect(mockedGetLatestInterviewPlanId).toHaveBeenCalledWith(organizationId, jobId);
    expect(mockedGetLatestInterviewerConfig).toHaveBeenCalledWith(organizationId, jobId);
    expect(screen.getByText(/Senior Platform Engineer — read only/)).toBeInTheDocument();
    expect(screen.getByText(/Competencies: Systems design — read only — rubric save disconnected/)).toBeInTheDocument();
    expect(screen.getByText(/Questions: Describe a production incident you owned. — read only — question create disconnected/)).toBeInTheDocument();
    expect(screen.getByText(/Interview plan: 600s — read only — plan save disconnected/)).toBeInTheDocument();
    expect(screen.getByText(/Interviewer config: Technical interviewer — plan 55555555-5555-4555-8555-555555555555 — read only — config save disconnected/)).toBeInTheDocument();
  });
});