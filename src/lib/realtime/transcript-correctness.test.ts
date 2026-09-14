import { describe, expect, it, vi } from "vitest";

import { createTranscriptRepository } from "./transcript-repository";

describe("interview transcript correctness guards", () => {
  it("fails closed when durable transcript rows repeat an event identity across contiguous sequences", async () => {
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
          event_id: "event-1",
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
    ).resolves.toEqual({ status: "conflict" });
  });

  it("fails closed when durable transcript rows repeat an immutable message identity", async () => {
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
          message_id: "message-1",
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
    ).resolves.toEqual({ status: "conflict" });
  });

  it("fails closed when the append response reassigns the finalized speaker", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          message_id: "message-1",
          event_id: "event-1",
          sequence: 1,
          speaker: "interviewer",
          text: "I built the service.",
          started_at: null,
          ended_at: null,
          finalized_at: "2026-09-14T17:20:00.000Z",
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
        startedAt: null,
        endedAt: null,
      }),
    ).resolves.toEqual({ status: "conflict" });
  });

  it("fails closed when a finalized turn ends before it starts", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          message_id: "message-1",
          event_id: "event-1",
          sequence: 1,
          speaker: "candidate",
          text: "I built the service.",
          started_at: "2026-09-14T17:20:05.000Z",
          ended_at: "2026-09-14T17:20:03.000Z",
          finalized_at: "2026-09-14T17:20:06.000Z",
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
        startedAt: "2026-09-14T17:20:05.000Z",
        endedAt: "2026-09-14T17:20:03.000Z",
      }),
    ).resolves.toEqual({ status: "conflict" });
  });
});
