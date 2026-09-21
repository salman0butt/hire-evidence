"use client";

import { useMemo, useState } from "react";

type ReviewStatus = "awaiting_review" | "in_review" | "reviewed";

type CandidateDashboardItem = Readonly<{
  candidateId: string;
  candidateName: string;
  reviewStatus: ReviewStatus;
}>;

type JobCandidateDashboardProps = Readonly<{
  organizationId: string;
  jobId: string;
  candidates: readonly CandidateDashboardItem[];
}>;

const REVIEW_STATUS_ORDER: Record<ReviewStatus, number> = {
  awaiting_review: 0,
  in_review: 1,
  reviewed: 2,
};

function formatReviewStatus(status: ReviewStatus) {
  if (status === "awaiting_review") return "Awaiting review";
  if (status === "in_review") return "In review";
  return "Reviewed";
}

export function JobCandidateDashboard({
  organizationId,
  jobId,
  candidates,
}: JobCandidateDashboardProps) {
  const [statusFilter, setStatusFilter] = useState<"all" | ReviewStatus>("all");
  const [sortBy, setSortBy] = useState<"name" | "status">("name");

  const visibleCandidates = useMemo(() => {
    const filtered = statusFilter === "all"
      ? candidates
      : candidates.filter((candidate) => candidate.reviewStatus === statusFilter);

    return [...filtered].sort((left, right) => {
      if (sortBy === "status") {
        const statusDifference = REVIEW_STATUS_ORDER[left.reviewStatus] - REVIEW_STATUS_ORDER[right.reviewStatus];
        if (statusDifference !== 0) return statusDifference;
      }
      return left.candidateName.localeCompare(right.candidateName);
    });
  }, [candidates, sortBy, statusFilter]);

  return (
    <section aria-labelledby="candidate-review-title" className="space-y-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div className="space-y-1">
        <h2 id="candidate-review-title" className="text-2xl font-semibold tracking-tight">Candidate review</h2>
        <p className="text-sm leading-6 text-neutral-600">Review completed interviews by workflow status.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <label className="space-y-1 text-sm font-medium">
          <span>Filter by review status</span>
          <select
            aria-label="Filter by review status"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2"
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value as "all" | ReviewStatus)}
          >
            <option value="all">All review statuses</option>
            <option value="awaiting_review">Awaiting review</option>
            <option value="in_review">In review</option>
            <option value="reviewed">Reviewed</option>
          </select>
        </label>
        <label className="space-y-1 text-sm font-medium">
          <span>Sort candidates</span>
          <select
            aria-label="Sort candidates"
            className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as "name" | "status")}
          >
            <option value="name">Candidate name</option>
            <option value="status">Review status</option>
          </select>
        </label>
      </div>

      {candidates.length === 0 ? (
        <p className="text-sm text-neutral-600">No completed candidate interviews are ready for review.</p>
      ) : visibleCandidates.length === 0 ? (
        <p className="text-sm text-neutral-600">No candidates match this review status.</p>
      ) : (
        <ul className="divide-y divide-neutral-200" aria-label="Candidates ready for review">
          {visibleCandidates.map((candidate) => (
            <li key={candidate.candidateId} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold">{candidate.candidateName}</p>
                <p className="text-sm text-neutral-600">{formatReviewStatus(candidate.reviewStatus)}</p>
              </div>
              <a
                href={`/app/o/${organizationId}/jobs/${jobId}/candidates/${candidate.candidateId}`}
                className="text-sm font-semibold underline underline-offset-2"
              >
                Review {candidate.candidateName}
              </a>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
