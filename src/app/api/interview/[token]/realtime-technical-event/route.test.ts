import { describe, expect, it, vi } from "vitest";

import { createProductionRealtimeTechnicalEventRoute } from "./route";

const context = {
  params: Promise.resolve({ token: "capability-secret" }),
};

function request(body: unknown) {
  return new Request(
    "https://hire-evidence.example/api/interview/capability-secret/realtime-technical-event",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}

describe("POST /api/interview/[token]/realtime-technical-event", () => {
  it("records only capability-bound technical interruptions and returns no evaluative fields", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          event_id: "technical-event-1",
          category: "provider_disconnect",
          occurred_at: "2026-09-14T20:20:00.000Z",
        },
      ],
      error: null,
    });
    const route = createProductionRealtimeTechnicalEventRoute({
      createSupabaseClient: vi.fn().mockResolvedValue({ rpc }),
    });

    const response = await route(
      request({
        attemptId: "attempt-1",
        category: "provider_disconnect",
        occurredAt: "2026-09-14T20:20:00.000Z",
      }),
      context,
    );

    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload).toEqual({
      status: "recorded",
      event: {
        id: "technical-event-1",
        category: "provider_disconnect",
        occurredAt: "2026-09-14T20:20:00.000Z",
      },
    });
    expect(JSON.stringify(payload)).not.toMatch(/score|assessment|evidence|transcript/i);
    expect(rpc).toHaveBeenCalledWith("record_realtime_interview_technical_event", {
      p_token_hash: expect.any(String),
      p_attempt_id: "attempt-1",
      p_category: "provider_disconnect",
      p_occurred_at: "2026-09-14T20:20:00.000Z",
    });
  });

  it("fails closed for malformed events without invoking persistence", async () => {
    const rpc = vi.fn();
    const route = createProductionRealtimeTechnicalEventRoute({
      createSupabaseClient: vi.fn().mockResolvedValue({ rpc }),
    });

    const response = await route(
      request({
        attemptId: "attempt-1",
        category: "candidate_behavior",
        occurredAt: "2026-09-14T20:20:00.000Z",
      }),
      context,
    );

    expect(response.status).toBe(400);
    const body = await response.text();
    expect(JSON.parse(body)).toEqual({ status: "unavailable" });
    expect(body).not.toContain("capability-secret");
    expect(rpc).not.toHaveBeenCalled();
  });
});
