import { describe, expect, it, vi } from "vitest";
import {
  authorizeRealtimeSession,
  type RealtimeSessionAuthorizationDeps,
} from "./session-authorization";

function availableCandidate(
  overrides: Partial<{
    hasCurrentConsent: boolean;
    interviewerVersionId: string | null;
    lifecycle: "sent" | "opened" | "started" | "completed";
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
