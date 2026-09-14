import { describe, expect, it, vi } from "vitest";

import { hashInvitationToken } from "@/lib/candidates/invitation-token";
import { createRealtimeSessionRepository } from "./session-repository";

describe("realtime session repository", () => {
  it("resolves a candidate session through the hashed invitation capability with its immutable runtime plan", async () => {
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
          interview_plan: {
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
          },
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
      interviewPlan: {
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
      },
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

  it("returns the server-authoritative resume checkpoint for the same attempt", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          attempt_id: "attempt-1",
          interviewer_version_id: "version-1",
          resume_section_index: 1,
          resume_question_index: 0,
          resume_follow_ups_used: { "question-1": 1 },
          processed_event_ids: ["event-1"],
        },
      ],
      error: null,
    });
    const repository = createRealtimeSessionRepository(rpc);

    await expect(
      repository.getOrCreateAttempt({
        rawToken: "capability-secret",
        invitationId: "invitation-1",
        candidateId: "candidate-1",
        interviewerVersionId: "version-1",
      }),
    ).resolves.toEqual({
      status: "ready",
      attemptId: "attempt-1",
      resumeCheckpoint: {
        interviewerVersionId: "version-1",
        sectionIndex: 1,
        questionIndex: 0,
        followUpsUsed: { "question-1": 1 },
        processedEventIds: ["event-1"],
      },
    });
  });

  it("persists question progression and returns the authoritative attempt version", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          attempt_state: "active",
          interviewer_version_id: "version-server",
          resume_section_index: 0,
          resume_question_index: 1,
          resume_follow_ups_used: { "question-1": 1 },
          processed_event_ids: ["event-1"],
        },
      ],
      error: null,
    });
    const repository = createRealtimeSessionRepository(rpc);

    await expect(
      repository.advanceAttemptProgress({
        rawToken: "capability-secret",
        attemptId: "attempt-1",
        eventId: "event-1",
        questionId: "question-1",
      }),
    ).resolves.toEqual({
      status: "active",
      checkpoint: {
        interviewerVersionId: "version-server",
        sectionIndex: 0,
        questionIndex: 1,
        followUpsUsed: { "question-1": 1 },
        processedEventIds: ["event-1"],
      },
    });

    expect(rpc).toHaveBeenCalledWith("advance_realtime_interview_session", {
      p_token_hash: hashInvitationToken("capability-secret"),
      p_attempt_id: "attempt-1",
      p_event_id: "event-1",
      p_question_id: "question-1",
    });
  });

  it("fails closed when the authoritative attempt RPC fails or returns no opaque id", async () => {
    for (const response of [
      { data: null, error: null },
      { data: "", error: null },
      { data: [], error: null },
      { data: [{ attempt_id: "attempt-1" }], error: null },
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