import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { createCandidateResultRepository } from "@/lib/review/candidate-result-repository";
import { createCandidateReviewTranscriptRepository } from "@/lib/review/candidate-transcript-repository";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

import CandidateResultPage from "./page";

vi.mock("@/lib/review/candidate-result-repository", () => ({ createCandidateResultRepository: vi.fn() }));
vi.mock("@/lib/review/candidate-transcript-repository", () => ({ createCandidateReviewTranscriptRepository: vi.fn() }));
vi.mock("@/lib/organization/require-membership", () => ({ requireOrganizationMembership: vi.fn() }));
vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));
vi.mock("next/navigation", () => ({ notFound: vi.fn(() => { throw new Error("NEXT_NOT_FOUND"); }) }));

const mockedCreateCandidateResultRepository = vi.mocked(createCandidateResultRepository);
const mockedCreateCandidateReviewTranscriptRepository = vi.mocked(createCandidateReviewTranscriptRepository);
const mockedRequireOrganizationMembership = vi.mocked(requireOrganizationMembership);
const mockedCreateClient = vi.mocked(createClient);
const mockedNotFound = vi.mocked(notFound);

const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const candidateId = "33333333-3333-4333-8333-333333333333";
const attemptId = "44444444-4444-4444-8444-444444444444";

const candidateResult = {
  organization_id: organizationId, job_id: jobId, candidate_id: candidateId, attempt_id: attemptId,
  candidate_name: "Ada Candidate", job_title: "Senior Platform Engineer", interview_status: "completed",
  review_status: "awaiting_review", generation_number: 2, assessment_status: "completed",
  assessment: { summary: "The assessment is grounded in the completed interview evidence.", competencies: [], strengths: [], concerns: [], unansweredAreas: [], questionCoverage: [], evidenceSufficiency: "medium" },
  competency_catalog: [{ id: "competency-system-design", name: "System Design" }, { id: "competency-communication", name: "Technical Communication" }],
  review_competencies: [
    { competencyId: "competency-system-design", name: "System Design", score: 4, rationale: "The candidate explained concrete scaling trade-offs.", evidenceSufficiency: "sufficient", evidence: [{ messageSequence: 2, excerpt: "I partitioned writes by tenant and made retries idempotent." }] },
    { competencyId: "competency-communication", name: "Technical Communication", score: null, rationale: "The interview did not collect enough evidence to score this competency.", evidenceSufficiency: "insufficient", evidence: [] },
  ],
};

const transcript = [
  { id: "message-1", eventId: "event-1", sequence: 1, speaker: "interviewer" as const, text: "Describe a difficult scaling problem.", startedAt: null, endedAt: null, finalizedAt: "2026-09-18T08:00:00.000Z" },
  { id: "message-2", eventId: "event-2", sequence: 2, speaker: "candidate" as const, text: "I partitioned writes by tenant and made retries idempotent.", startedAt: null, endedAt: null, finalizedAt: "2026-09-18T08:00:05.000Z" },
];

async function renderPage() {
  render(await CandidateResultPage({ params: Promise.resolve({ organizationId, jobId, candidateId }) }));
}

describe("candidate result page", () => {
  const getCandidateResult = vi.fn();
  const getCandidateTranscript = vi.fn();
  const client = { rpc: vi.fn() };

  beforeEach(() => {
    vi.clearAllMocks();
    mockedRequireOrganizationMembership.mockResolvedValue({ organizationId, organizationName: "Evidence Co", role: "reviewer" });
    mockedCreateClient.mockResolvedValue(client as never);
    getCandidateResult.mockResolvedValue(candidateResult);
    getCandidateTranscript.mockResolvedValue(transcript);
    mockedCreateCandidateResultRepository.mockReturnValue({ getCandidateResult });
    mockedCreateCandidateReviewTranscriptRepository.mockReturnValue({ getCandidateTranscript });
  });

  it("renders an authorized candidate result from the exact tenant/job/candidate scope", async () => {
    await renderPage();
    expect(mockedRequireOrganizationMembership).toHaveBeenCalledWith(organizationId);
    expect(mockedCreateCandidateResultRepository).toHaveBeenCalledWith(client);
    expect(getCandidateResult).toHaveBeenCalledWith(organizationId, jobId, candidateId);
    expect(screen.getByRole("heading", { level: 1, name: "Ada Candidate" })).toBeInTheDocument();
    expect(screen.getByText("Senior Platform Engineer")).toBeInTheDocument();
    expect(screen.getByText("Interview status")).toBeInTheDocument();
    expect(screen.getByText("Review status")).toBeInTheDocument();
    expect(screen.getByText("Assessment generation")).toBeInTheDocument();
    expect(screen.getByText("AI assessment supports independent human review; it is not a hiring decision.")).toBeInTheDocument();
  });

  it("loads and renders the transcript from the server-derived reviewed attempt", async () => {
    await renderPage();
    expect(mockedCreateCandidateReviewTranscriptRepository).toHaveBeenCalledWith(client);
    expect(getCandidateTranscript).toHaveBeenCalledWith(organizationId, jobId, candidateId, attemptId);
    expect(screen.getByRole("heading", { level: 2, name: "Interview transcript" })).toBeInTheDocument();
    expect(screen.getByText("Describe a difficult scaling problem.")).toBeInTheDocument();
    expect(screen.getAllByText("I partitioned writes by tenant and made retries idempotent.")).toHaveLength(2);
  });

  it("renders the validated assessment summary before competency review", async () => {
    await renderPage();
    expect(screen.getByRole("heading", { level: 2, name: "Assessment summary" })).toBeInTheDocument();
    expect(screen.getByText("The assessment is grounded in the completed interview evidence.")).toBeInTheDocument();
  });

  it("renders evidence-grounded competency cards with explicit insufficient evidence", async () => {
    await renderPage();
    expect(screen.getByRole("heading", { level: 2, name: "Competency review" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "System Design" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 3, name: "Technical Communication" })).toBeInTheDocument();
    expect(screen.getByText("4 / 5")).toBeInTheDocument();
    expect(screen.getByText("Insufficient evidence")).toBeInTheDocument();
    expect(screen.getByText("The candidate explained concrete scaling trade-offs.")).toBeInTheDocument();
    expect(screen.getByText("The interview did not collect enough evidence to score this competency.")).toBeInTheDocument();
    expect(screen.getAllByText("Turn 2")).toHaveLength(2);
    expect(screen.getAllByText("I partitioned writes by tenant and made retries idempotent.")).toHaveLength(2);
  });

  it("fails closed when the scoped result cannot be loaded", async () => {
    getCandidateResult.mockRejectedValue(new Error("candidate result unavailable"));
    await expect(CandidateResultPage({ params: Promise.resolve({ organizationId, jobId, candidateId }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockedNotFound).toHaveBeenCalledOnce();
  });

  it("fails closed when assessment evidence does not resolve to the reviewed transcript", async () => {
    getCandidateResult.mockResolvedValue({
      ...candidateResult,
      review_competencies: candidateResult.review_competencies.map((competency, index) => index === 0 ? { ...competency, evidence: competency.evidence.map((citation) => ({ ...citation, messageSequence: 7 })) } : competency),
    });
    await expect(CandidateResultPage({ params: Promise.resolve({ organizationId, jobId, candidateId }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockedNotFound).toHaveBeenCalledOnce();
  });

  it("fails closed when the exact reviewed transcript cannot be loaded", async () => {
    getCandidateTranscript.mockRejectedValue(new Error("candidate transcript unavailable"));
    await expect(CandidateResultPage({ params: Promise.resolve({ organizationId, jobId, candidateId }) })).rejects.toThrow("NEXT_NOT_FOUND");
    expect(mockedNotFound).toHaveBeenCalledOnce();
  });
});
