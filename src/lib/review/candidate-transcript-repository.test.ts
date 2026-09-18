import { describe, expect, it, vi } from "vitest";

import { createCandidateReviewTranscriptRepository } from "./candidate-transcript-repository";

const transcriptRows = [
  {
    message_id: "message-1",
    event_id: "event-1",
    sequence: 1,
    speaker: "interviewer",
    text: "Describe a difficult scaling problem.",
    started_at: null,
    ended_at: null,
    finalized_at: "2026-09-18T08:00:00.000Z",
  },
  {
    message_id: "message-2",
    event_id: "event-2",
    sequence: 2,
    speaker: "candidate",
    text: "I partitioned writes by tenant and made retries idempotent.",
    started_at: null,
    ended_at: null,
    finalized_at: "2026-09-18T08:00:05.000Z",
  },
];

describe("candidate review transcript repository", () => {
  it("loads the exact tenant/job/candidate/attempt transcript through the hiring-team RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: transcriptRows, error: null });
    const repository = createCandidateReviewTranscriptRepository({ rpc });

    await expect(
      repository.getCandidateTranscript(
        "org-1",
        "job-1",
        "candidate-1",
        "attempt-1",
      ),
    ).resolves.toEqual([
      {
        id: "message-1",
        eventId: "event-1",
        sequence: 1,
        speaker: "interviewer",
        text: "Describe a difficult scaling problem.",
        startedAt: null,
        endedAt: null,
        finalizedAt: "2026-09-18T08:00:00.000Z",
      },
      {
        id: "message-2",
        eventId: "event-2",
        sequence: 2,
        speaker: "candidate",
        text: "I partitioned writes by tenant and made retries idempotent.",
        startedAt: null,
        endedAt: null,
        finalizedAt: "2026-09-18T08:00:05.000Z",
      },
    ]);

    expect(rpc).toHaveBeenCalledWith("get_candidate_review_transcript", {
      p_organization_id: "org-1",
      p_job_id: "job-1",
      p_candidate_id: "candidate-1",
      p_attempt_id: "attempt-1",
    });
  });

  it("fails closed when the authoritative transcript RPC denies access", async () => {
    const repository = createCandidateReviewTranscriptRepository({
      rpc: vi.fn().mockResolvedValue({
        data: null,
        error: { message: "not authorized" },
      }),
    });

    await expect(
      repository.getCandidateTranscript(
        "org-1",
        "job-1",
        "candidate-1",
        "attempt-1",
      ),
    ).rejects.toThrow("candidate transcript unavailable");
  });

  it("fails closed for malformed, duplicated, or out-of-order transcript rows", async () => {
    const invalidPayloads = [
      [{ ...transcriptRows[0], speaker: "system" }],
      [transcriptRows[0], { ...transcriptRows[1], sequence: 3 }],
      [transcriptRows[0], { ...transcriptRows[1], event_id: "event-1" }],
      [transcriptRows[0], { ...transcriptRows[1], message_id: "message-1" }],
      [transcriptRows[0], { ...transcriptRows[1], finalized_at: "not-a-date" }],
    ];

    for (const data of invalidPayloads) {
      const repository = createCandidateReviewTranscriptRepository({
        rpc: vi.fn().mockResolvedValue({ data, error: null }),
      });

      await expect(
        repository.getCandidateTranscript(
          "org-1",
          "job-1",
          "candidate-1",
          "attempt-1",
        ),
      ).rejects.toThrow("candidate transcript unavailable");
    }
  });
});
