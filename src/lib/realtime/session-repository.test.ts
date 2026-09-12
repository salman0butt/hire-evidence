import { describe, expect, it, vi } from "vitest";

import { hashInvitationToken } from "@/lib/candidates/invitation-token";
import { createRealtimeSessionRepository } from "./session-repository";

describe("realtime session repository", () => {
  it("resolves a candidate session through the hashed invitation capability", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          invitation_id: "invitation-1",
          candidate_id: "candidate-1",
          interviewer_version_id: "version-1",
          duration_seconds: 1800,
          language: "en",
          lifecycle: "opened",
          has_current_consent: true,
        },
      ],
      error: null,
    });
    const repository = createRealtimeSessionRepository(rpc);

    await expect(
      repository.resolveCandidateSession("capability-secret"),
    ).resolves.toEqual({
      status: "available",
      invitationId: "invitation-1",
      candidateId: "candidate-1",
      interviewerVersionId: "version-1",
      durationSeconds: 1800,
      language: "en",
      lifecycle: "opened",
      hasCurrentConsent: true,
    });

    expect(rpc).toHaveBeenCalledWith("resolve_realtime_candidate_session", {
      p_token_hash: hashInvitationToken("capability-secret"),
    });
  });

  it("fails closed when the candidate-session projection is missing or malformed", async () => {
    for (const response of [
      { data: [], error: null },
      { data: [{ invitation_id: "invitation-1" }], error: null },
      { data: null, error: { message: "database failure" } },
    ]) {
      const repository = createRealtimeSessionRepository(
        vi.fn().mockResolvedValue(response),
      );

      await expect(repository.resolveCandidateSession("token")).resolves.toEqual({
        status: "unavailable",
      });
    }
  });

  it("creates or resumes an attempt by revalidating the raw invitation capability", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: "attempt-1", error: null });
    const repository = createRealtimeSessionRepository(rpc);

    await expect(
      repository.getOrCreateAttempt({
        rawToken: "capability-secret",
        invitationId: "invitation-1",
        candidateId: "candidate-1",
        interviewerVersionId: "version-1",
      }),
    ).resolves.toEqual({ status: "ready", attemptId: "attempt-1" });

    expect(rpc).toHaveBeenCalledWith("authorize_realtime_interview_session", {
      p_token_hash: hashInvitationToken("capability-secret"),
    });
  });

  it("fails closed when the authoritative attempt RPC fails or returns no opaque id", async () => {
    for (const response of [
      { data: null, error: null },
      { data: "", error: null },
      { data: null, error: { message: "database failure" } },
    ]) {
      const repository = createRealtimeSessionRepository(
        vi.fn().mockResolvedValue(response),
      );

      await expect(
        repository.getOrCreateAttempt({
          rawToken: "token",
          invitationId: "invitation-1",
          candidateId: "candidate-1",
          interviewerVersionId: "version-1",
        }),
      ).resolves.toEqual({ status: "conflict" });
    }
  });
});
