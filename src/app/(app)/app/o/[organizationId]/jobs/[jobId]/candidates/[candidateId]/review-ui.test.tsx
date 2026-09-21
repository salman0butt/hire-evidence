import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createCandidateResultRepository } from "@/lib/review/candidate-result-repository";
import { createCandidateReviewTranscriptRepository } from "@/lib/review/candidate-transcript-repository";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";
import { createClient } from "@/lib/supabase/server";
import CandidateResultPage from "./page";

vi.mock("@/lib/review/candidate-result-repository", () => ({ createCandidateResultRepository: vi.fn() }));
vi.mock("@/lib/review/candidate-transcript-repository", () => ({ createCandidateReviewTranscriptRepository: vi.fn() }));
vi.mock("@/lib/review/candidate-score-override-repository", () => ({ createCandidateScoreOverrideRepository: vi.fn() }));
vi.mock("@/lib/organization/require-membership", () => ({ requireOrganizationMembership: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("next/navigation", () => ({ notFound: vi.fn(() => { throw new Error("NEXT_NOT_FOUND"); }) }));

const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const candidateId = "33333333-3333-4333-8333-333333333333";
const attemptId = "44444444-4444-4444-8444-444444444444";
const assessmentGenerationId = "55555555-5555-4555-8555-555555555555";

const result = {
  organization_id: organizationId,
  job_id: jobId,
  candidate_id: candidateId,
  attempt_id: attemptId,
  assessment_generation_id: assessmentGenerationId,
  candidate_name: "Ada Candidate",
  job_title: "Senior Platform Engineer",
  interview_status: "completed",
  review_status: "awaiting_review",
  generation_number: 1,
  assessment_status: "completed",
  assessment: { summary: "Grounded assessment.", competencies: [], strengths: [], concerns: [], unansweredAreas: [], questionCoverage: [], evidenceSufficiency: "medium" },
  competency_catalog: [],
  review_competencies: [],
};

describe("candidate reviewer notes and lifecycle UI", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireOrganizationMembership).mockResolvedValue({ organizationId, organizationName: "Evidence Co", role: "reviewer" });
    vi.mocked(createClient).mockResolvedValue({ rpc: vi.fn() } as never);
    vi.mocked(createCandidateResultRepository).mockReturnValue({ getCandidateResult: vi.fn().mockResolvedValue(result) });
    vi.mocked(createCandidateReviewTranscriptRepository).mockReturnValue({ getCandidateTranscript: vi.fn().mockResolvedValue([]) });
  });

  it("lets an authorized reviewer record bounded notes and advance the explicit review lifecycle", async () => {
    render(await CandidateResultPage({ params: Promise.resolve({ organizationId, jobId, candidateId }) }));

    expect(screen.getByRole("heading", { level: 2, name: "Human review" })).toBeInTheDocument();
    expect(screen.getByLabelText("Reviewer notes")).toHaveAttribute("maxLength", "4000");
    expect(screen.getByLabelText("Review status")).toHaveValue("awaiting_review");
    expect(screen.getByRole("option", { name: "Awaiting review" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "In review" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "Reviewed" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save review" })).toBeInTheDocument();
  });
});
