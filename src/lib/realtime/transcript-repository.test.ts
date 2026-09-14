import { describe, expect, it, vi } from "vitest";

import { hashInvitationToken } from "@/lib/candidates/invitation-token";
import { createTranscriptRepository } from "./transcript-repository";

describe("interview transcript repository", () => {
  it("appends one finalized turn through the capability-bound attempt RPC and returns server sequence", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          message_id: "message-1",
          event_id: "event-1",
          sequence: 1,
          speaker: "candidate",
          text: "I built the service.",
          started_at: "2026-09-14T17:20:00.000Z",
          ended_at: "2026-09-14T17:20:03.000Z",
          finalized_at: "2026-09-14T17:20:03.100Z",
        },
      ],
      error: null,
    });
    const repository = createTranscriptRepository(rpc);

    await expect(
      repository.appendFinalizedTurn({
        rawToken: "capability-secret",
        attemptId: "attempt-1",
        eventId: "event-1",
        speaker: "candidate",
        text: "I built the service.",
        startedAt: "2026-09-14T17:20:00.000Z",
        endedAt: "2026-09-14T17:20:03.000Z",
      }),
    ).resolves.toEqual({
      status: "appended",
      turn: {
        id: "message-1",
        eventId: "event-1",
        sequence: 1,
        speaker: "candidate",
        text: "I built the service.",
        startedAt: "2026-09-14T17:20:00.000Z",
        endedAt: "2026-09-14T17:20:03.000Z",
        finalizedAt: "2026-09-14T17:20:03.100Z",
      },
    });

    expect(rpc).toHaveBeenCalledWith("append_realtime_interview_transcript_turn", {
      p_token_hash: hashInvitationToken("capability-secret"),
      p_attempt_id: "attempt-1",
      p_event_id: "event-1",
      p_speaker: "candidate",
      p_text: "I built the service.",
      p_started_at: "2026-09-14T17:20:00.000Z",
      p_ended_at: "2026-09-14T17:20:03.000Z",
    });
  });

  it("lists only server-authoritative finalized turns in sequence order", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          message_id: "message-1",
          event_id: "event-1",
          sequence: 1,
          speaker: "interviewer",
          text: "Describe a project.",
          started_at: null,
          ended_at: null,
          finalized_at: "2026-09-14T17:20:00.000Z",
        },
        {
          message_id: "message-2",
          event_id: "event-2",
          sequence: 2,
          speaker: "candidate",
          text: "I built a realtime service.",
          started_at: null,
          ended_at: null,
          finalized_at: "2026-09-14T17:20:04.000Z",
        },
      ],
      error: null,
    });
    const repository = createTranscriptRepository(rpc);

    await expect(
      repository.listFinalizedTurns({
        rawToken: "capability-secret",
        attemptId: "attempt-1",
      }),
    ).resolves.toEqual({
      status: "available",
      turns: [
        {
          id: "message-1",
          eventId: "event-1",
          sequence: 1,
          speaker: "interviewer",
          text: "Describe a project.",
          startedAt: null,
          endedAt: null,
          finalizedAt: "2026-09-14T17:20:00.000Z",
        },
        {
          id: "message-2",
          eventId: "event-2",
          sequence: 2,
          speaker: "candidate",
          text: "I built a realtime service.",
          startedAt: null,
          endedAt: null,
          finalizedAt: "2026-09-14T17:20:04.000Z",
        },
      ],
    });

    expect(rpc).toHaveBeenCalledWith("list_realtime_interview_transcript", {
      p_token_hash: hashInvitationToken("capability-secret"),
      p_attempt_id: "attempt-1",
    });
  });

  it("fails closed for malformed or cross-attempt-denied server responses", async () => {
    for (const response of [
      { data: null, error: { message: "forbidden" } },
      { data: [], error: null },
      {
        data: [
          {
            message_id: "message-1",
            event_id: "event-1",
            sequence: 0,
            speaker: "candidate",
            text: "Invalid sequence",
            started_at: null,
            ended_at: null,
            finalized_at: "2026-09-14T17:20:00.000Z",
          },
        ],
        error: null,
      },
    ]) {
      const repository = createTranscriptRepository(vi.fn().mockResolvedValue(response));

      await expect(
        repository.appendFinalizedTurn({
          rawToken: "capability-secret",
          attemptId: "attempt-1",
          eventId: "event-1",
          speaker: "candidate",
          text: "Evidence",
          startedAt: null,
          endedAt: null,
        }),
      ).resolves.toEqual({ status: "conflict" });
    }
  });
});
