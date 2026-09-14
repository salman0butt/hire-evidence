import { describe, expect, it, vi } from "vitest";

import { hashInvitationToken } from "@/lib/candidates/invitation-token";
import { createTechnicalEventRepository } from "./technical-event-repository";

describe("interview technical event repository", () => {
  it("records a capability-bound non-evaluative technical interruption for the authoritative attempt", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          event_id: "technical-event-1",
          category: "provider_disconnect",
          occurred_at: "2026-09-14T19:45:00.000Z",
        },
      ],
      error: null,
    });
    const repository = createTechnicalEventRepository(rpc);

    await expect(
      repository.recordTechnicalEvent({
        rawToken: "capability-secret",
        attemptId: "attempt-1",
        category: "provider_disconnect",
        occurredAt: "2026-09-14T19:45:00.000Z",
      }),
    ).resolves.toEqual({
      status: "recorded",
      event: {
        id: "technical-event-1",
        category: "provider_disconnect",
        occurredAt: "2026-09-14T19:45:00.000Z",
      },
    });

    expect(rpc).toHaveBeenCalledWith("record_realtime_interview_technical_event", {
      p_token_hash: hashInvitationToken("capability-secret"),
      p_attempt_id: "attempt-1",
      p_category: "provider_disconnect",
      p_occurred_at: "2026-09-14T19:45:00.000Z",
    });
  });

  it("fails closed when the technical event response is malformed or denied", async () => {
    for (const response of [
      { data: null, error: { message: "forbidden" } },
      { data: [], error: null },
      {
        data: [
          {
            event_id: "technical-event-1",
            category: "candidate_behavior",
            occurred_at: "2026-09-14T19:45:00.000Z",
          },
        ],
        error: null,
      },
    ]) {
      const repository = createTechnicalEventRepository(
        vi.fn().mockResolvedValue(response),
      );

      await expect(
        repository.recordTechnicalEvent({
          rawToken: "capability-secret",
          attemptId: "attempt-1",
          category: "provider_disconnect",
          occurredAt: "2026-09-14T19:45:00.000Z",
        }),
      ).resolves.toEqual({ status: "conflict" });
    }
  });
});
