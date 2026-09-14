import { describe, expect, it, vi } from "vitest";

import { createRealtimeProgressClient } from "./realtime-progress-client";

const activeCheckpoint = {
  interviewerVersionId: "version-1",
  sectionIndex: 0,
  questionIndex: 1,
  followUpsUsed: {},
  processedEventIds: ["turn-1"],
};

describe("realtime progress client", () => {
  it("posts capability-bound progress and returns a validated active checkpoint", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({ status: "active", checkpoint: activeCheckpoint }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      ),
    );
    const persistProgress = createRealtimeProgressClient({
      rawToken: "candidate capability/with spaces",
      attemptId: "attempt-1",
      fetchImpl,
    });

    await expect(
      persistProgress({ eventId: "turn-1", questionId: "question-1" }),
    ).resolves.toEqual({ status: "active", checkpoint: activeCheckpoint });

    expect(fetchImpl).toHaveBeenCalledWith(
      "/api/interview/candidate%20capability%2Fwith%20spaces/realtime-progress",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: "attempt-1",
          eventId: "turn-1",
          questionId: "question-1",
        }),
      },
    );
  });

  it("maps a conflict response without exposing server details", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "unavailable", detail: "secret" }), {
        status: 409,
      }),
    );
    const persistProgress = createRealtimeProgressClient({
      rawToken: "candidate-capability",
      attemptId: "attempt-1",
      fetchImpl,
    });

    await expect(
      persistProgress({ eventId: "turn-1", questionId: "question-1" }),
    ).resolves.toEqual({ status: "conflict" });
  });

  it("fails closed for malformed successful responses", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "active",
          checkpoint: { ...activeCheckpoint, questionIndex: -1 },
        }),
        { status: 200 },
      ),
    );
    const persistProgress = createRealtimeProgressClient({
      rawToken: "candidate-capability",
      attemptId: "attempt-1",
      fetchImpl,
    });

    await expect(
      persistProgress({ eventId: "turn-1", questionId: "question-1" }),
    ).rejects.toThrow("Realtime progress update failed");
  });
});