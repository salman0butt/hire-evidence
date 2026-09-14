import { describe, expect, it, vi } from "vitest";

import type { RealtimeSessionAuthorizationDeps } from "./session-authorization";
import { authorizeRealtimeSession } from "./session-authorization";

const interviewPlan = {
  versionId: "version-1",
  sections: [
    {
      id: "section-1",
      title: "Technical depth",
      questions: [
        {
          id: "question-1",
          prompt: "Describe a difficult production incident you resolved.",
          required: true,
          followUpLimit: 1,
        },
      ],
    },
  ],
} as const;

describe("realtime reconnect transcript bootstrap", () => {
  it("restores committed finalized turns for only the authoritative resumed attempt", async () => {
    const listFinalizedTurns = vi.fn().mockResolvedValue({
      status: "available",
      turns: [
        {
          id: "message-1",
          eventId: "event-1",
          sequence: 1,
          speaker: "interviewer",
          text: "Describe a production incident.",
          startedAt: null,
          endedAt: null,
          finalizedAt: "2026-09-14T19:00:00.000Z",
        },
        {
          id: "message-2",
          eventId: "event-2",
          sequence: 2,
          speaker: "candidate",
          text: "I restored service by rolling back the deploy.",
          startedAt: null,
          endedAt: null,
          finalizedAt: "2026-09-14T19:00:05.000Z",
        },
      ],
    });
    const dependencies = {
      resolveCandidateSession: vi.fn().mockResolvedValue({
        status: "available",
        invitationId: "invitation-1",
        candidateId: "candidate-1",
        interviewerVersionId: "version-1",
        durationSeconds: 1800,
        language: "en",
        hasCurrentConsent: true,
        lifecycle: "started",
        interviewPlan,
      }),
      getOrCreateAttempt: vi.fn().mockResolvedValue({
        status: "ready",
        attemptId: "attempt-1",
        resumeCheckpoint: {
          interviewerVersionId: "version-1",
          sectionIndex: 0,
          questionIndex: 0,
          followUpsUsed: {},
          processedEventIds: [],
        },
      }),
      listFinalizedTurns,
      issueProviderCredential: vi.fn().mockResolvedValue({
        credential: "provider-token",
        expiresAt: "2026-09-14T19:30:00.000Z",
      }),
    } as unknown as RealtimeSessionAuthorizationDeps;

    await expect(
      authorizeRealtimeSession("candidate-token", dependencies),
    ).resolves.toMatchObject({
      status: "authorized",
      attemptId: "attempt-1",
      transcriptTurns: [
        { id: "message-1", sequence: 1, speaker: "interviewer" },
        { id: "message-2", sequence: 2, speaker: "candidate" },
      ],
    });

    expect(listFinalizedTurns).toHaveBeenCalledTimes(1);
    expect(listFinalizedTurns).toHaveBeenCalledWith({
      rawToken: "candidate-token",
      attemptId: "attempt-1",
    });
  });

  it("fails closed instead of resuming when authoritative transcript bootstrap conflicts", async () => {
    const issueProviderCredential = vi.fn();
    const dependencies = {
      resolveCandidateSession: vi.fn().mockResolvedValue({
        status: "available",
        invitationId: "invitation-1",
        candidateId: "candidate-1",
        interviewerVersionId: "version-1",
        durationSeconds: 1800,
        language: "en",
        hasCurrentConsent: true,
        lifecycle: "started",
        interviewPlan,
      }),
      getOrCreateAttempt: vi.fn().mockResolvedValue({
        status: "ready",
        attemptId: "attempt-1",
      }),
      listFinalizedTurns: vi.fn().mockResolvedValue({ status: "conflict" }),
      issueProviderCredential,
    } as unknown as RealtimeSessionAuthorizationDeps;

    await expect(
      authorizeRealtimeSession("candidate-token", dependencies),
    ).resolves.toEqual({ status: "unavailable" });
    expect(issueProviderCredential).not.toHaveBeenCalled();
  });
});
