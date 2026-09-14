import { describe, expect, it, vi } from "vitest";

import { createRealtimeTechnicalEventClient } from "./technical-event-client";

describe("realtime technical event client", () => {
  it("records non-evaluative technical interruptions through the capability-bound route", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          status: "recorded",
          event: {
            id: "technical-event-1",
            category: "provider_disconnect",
            occurredAt: "2026-09-14T20:15:00.000Z",
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      ),
    );
    const recordTechnicalEvent = createRealtimeTechnicalEventClient({
      rawToken: "candidate capability/with spaces",
      attemptId: "attempt-1",
      fetchImpl,
    });

    await expect(
      recordTechnicalEvent({
        category: "provider_disconnect",
        occurredAt: "2026-09-14T20:15:00.000Z",
      }),
    ).resolves.toMatchObject({ status: "recorded" });

    expect(fetchImpl).toHaveBeenCalledWith(
      "/api/interview/candidate%20capability%2Fwith%20spaces/realtime-technical-event",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: "attempt-1",
          category: "provider_disconnect",
          occurredAt: "2026-09-14T20:15:00.000Z",
        }),
      },
    );
  });

  it("fails closed for denied or malformed responses", async () => {
    for (const response of [
      new Response(JSON.stringify({ status: "unavailable" }), { status: 409 }),
      new Response(JSON.stringify({ status: "recorded", event: null }), { status: 200 }),
    ]) {
      const client = createRealtimeTechnicalEventClient({
        rawToken: "candidate-token",
        attemptId: "attempt-1",
        fetchImpl: vi.fn().mockResolvedValue(response),
      });

      await expect(
        client({
          category: "provider_disconnect",
          occurredAt: "2026-09-14T20:15:00.000Z",
        }),
      ).resolves.toEqual({ status: "conflict" });
    }
  });
});
