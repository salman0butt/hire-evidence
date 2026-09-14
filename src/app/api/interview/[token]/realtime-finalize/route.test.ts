import { describe, expect, it, vi } from "vitest";

import { createProductionRealtimeFinalizeRoute } from "./route";

const context = {
  params: Promise.resolve({ token: "capability-secret" }),
};

function request(body: unknown) {
  return new Request(
    "https://hire-evidence.example/api/interview/capability-secret/realtime-finalize",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}

describe("POST /api/interview/[token]/realtime-finalize", () => {
  it("finalizes only the capability-bound attempt without exposing internal assessment identifiers", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          attempt_id: "attempt-1",
          attempt_state: "completed",
          completed_at: "2026-09-14T21:05:00.000Z",
          duration_seconds: 847,
          assessment_trigger_id: "assessment-trigger-1",
        },
      ],
      error: null,
    });
    const route = createProductionRealtimeFinalizeRoute({
      createSupabaseClient: vi.fn().mockResolvedValue({ rpc }),
    });

    const response = await route(request({ attemptId: "attempt-1" }), context);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "completed",
      attemptId: "attempt-1",
      completedAt: "2026-09-14T21:05:00.000Z",
      durationSeconds: 847,
    });
    expect(rpc).toHaveBeenCalledWith("finalize_realtime_interview_session", {
      p_token_hash: expect.any(String),
      p_attempt_id: "attempt-1",
    });
  });

  it("fails closed for malformed finalization without invoking persistence", async () => {
    const rpc = vi.fn();
    const route = createProductionRealtimeFinalizeRoute({
      createSupabaseClient: vi.fn().mockResolvedValue({ rpc }),
    });

    const response = await route(request({ attemptId: "" }), context);

    expect(response.status).toBe(400);
    const body = await response.text();
    expect(JSON.parse(body)).toEqual({ status: "unavailable" });
    expect(body).not.toContain("capability-secret");
    expect(rpc).not.toHaveBeenCalled();
  });
});
