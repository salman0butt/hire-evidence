import { describe, expect, it, vi } from "vitest";
import type { InterviewPlanInput } from "./plan-runner";
import {
  authorizeRealtimeSession,
  type RealtimeSessionAuthorizationDeps,
} from "./session-authorization";

const interviewPlan: InterviewPlanInput = {
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
};

function availableCandidate(
  overrides: Partial<{
    hasCurrentConsent: boolean;
    interviewerVersionId: string | null;
    lifecycle: "sent" | "opened" | "started" | "completed";
    interviewPlan: InterviewPlanInput;
  }> = {},
) {
  return {
    status: "available" as const,
    invitationId: "invitation-1",
    candidateId: "candidate-1",
    interviewerVersionId: "version-1" as string | null,
    durationSeconds: 1800,
    language: "en",
    hasCurrentConsent: true,
    lifecycle: "opened" as const,
    interviewPlan,
    ...overrides,
  };
}

function deps(
  overrides: Partial<RealtimeSessionAuthorizationDeps> = {},
): RealtimeSessionAuthorizationDeps {
  return {
    resolveCandidateSession: vi.fn().mockResolvedValue(availableCandidate()),
    getOrCreateAttempt: vi.fn().mockResolvedValue({
      status: "ready",
      attemptId: "attempt-1",
    }),
    issueProviderCredential: vi.fn().mockResolvedValue({
      credential: "short-lived-provider-token",
      expiresAt: "2026-09-12T12:30:00.000Z",
    }),
    ...overrides,
  };
}

describe("authorizeRealtimeSession", () => {
  it("does not mint a provider credential for an unusable invitation capability", async () => {
    const issueProviderCredential = vi.fn();
    const dependencies = deps({
      resolveCandidateSession: vi.fn().mockResolvedValue({ status: "unavailable" }),
      issueProviderCredential,
    });

    await expect(
      authorizeRealtimeSession("invalid-or-unusable-token", dependencies),
    ).resolves.toEqual({ status: "unavailable" });
    expect(issueProviderCredential).not.toHaveBeenCalled();
  });

  it("requires current candidate disclosure consent before minting a provider credential", async () => {
    const issueProviderCredential = vi.fn();
    const dependencies = deps({
      resolveCandidateSession: vi
        .fn()
        .mockResolvedValue(availableCandidate({ hasCurrentConsent: false })),
      issueProviderCredential,
    });

    await expect(
      authorizeRealtimeSession("candidate-token", dependencies),
    ).resolves.toEqual({ status: "unavailable" });
    expect(issueProviderCredential).not.toHaveBeenCalled();
  });

  it("requires an immutable published interviewer version before minting a provider credential", async () => {
    const issueProviderCredential = vi.fn();
    const dependencies = deps({
      resolveCandidateSession: vi
        .fn()
        .mockResolvedValue(availableCandidate({ interviewerVersionId: null })),
      issueProviderCredential,
    });

    await expect(
      authorizeRealtimeSession("candidate-token", dependencies),
    ).resolves.toEqual({ status: "unavailable" });
    expect(issueProviderCredential).not.toHaveBeenCalled();
  });

  it("rejects a runtime plan that is not bound to the authoritative interviewer version", async () => {
    const issueProviderCredential = vi.fn();
    const dependencies = deps({
      resolveCandidateSession: vi.fn().mockResolvedValue(
        availableCandidate({
          interviewPlan: {
            ...interviewPlan,
            versionId: "different-version",
          },
        }),
      ),
      issueProviderCredential,
    });

    await expect(
      authorizeRealtimeSession("candidate-token", dependencies),
    ).resolves.toEqual({ status: "unavailable" });
    expect(issueProviderCredential).not.toHaveBeenCalled();
  });

  it("does not mint a credential when an authoritative attempt cannot be safely created or resumed", async () => {
    const issueProviderCredential = vi.fn();
    const dependencies = deps({
      getOrCreateAttempt: vi.fn().mockResolvedValue({ status: "conflict" }),
      issueProviderCredential,
    });

    await expect(
      authorizeRealtimeSession("candidate-token", dependencies),
    ).resolves.toEqual({ status: "unavailable" });
    expect(issueProviderCredential).not.toHaveBeenCalled();
  });

  it("returns the authoritative checkpoint when resuming the same attempt", async () => {
    const resumeCheckpoint = {
      interviewerVersionId: "version-1",
      sectionIndex: 1,
      questionIndex: 0,
      followUpsUsed: { "question-1": 1 },
      processedEventIds: ["event-1"],
    } as const;
    const dependencies = deps({
      getOrCreateAttempt: vi.fn().mockResolvedValue({
        status: "ready",
        attemptId: "attempt-1",
        resumeCheckpoint,
      }),
    });

    await expect(
      authorizeRealtimeSession("candidate-token", dependencies),
    ).resolves.toMatchObject({
      status: "authorized",
      attemptId: "attempt-1",
      interviewerVersionId: "version-1",
      interviewPlan,
      resumeCheckpoint,
    });
  });

  it("authorizes a consented sent invitation before the server-owned start transition", async () => {
    const getOrCreateAttempt = vi.fn().mockResolvedValue({
      status: "ready",
      attemptId: "attempt-1",
    });
    const issueProviderCredential = vi.fn().mockResolvedValue({
      credential: "short-lived-provider-token",
      expiresAt: "2026-09-12T12:30:00.000Z",
    });
    const dependencies = deps({
      resolveCandidateSession: vi
        .fn()
        .mockResolvedValue(availableCandidate({ lifecycle: "sent" })),
      getOrCreateAttempt,
      issueProviderCredential,
    });

    await expect(
      authorizeRealtimeSession("candidate-token", dependencies),
    ).resolves.toEqual({
      status: "authorized",
      attemptId: "attempt-1",
      interviewerVersionId: "version-1",
      durationSeconds: 1800,
      language: "en",
      interviewPlan,
      providerCredential: {
        credential: "short-lived-provider-token",
        expiresAt: "2026-09-12T12:30:00.000Z",
      },
    });

    expect(getOrCreateAttempt).toHaveBeenCalledWith({
      rawToken: "candidate-token",
      invitationId: "invitation-1",
      candidateId: "candidate-1",
      interviewerVersionId: "version-1",
    });
    expect(issueProviderCredential).toHaveBeenCalledTimes(1);
  });
});