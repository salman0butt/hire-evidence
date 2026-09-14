import { describe, expect, it, vi } from "vitest";

import { createProductionRealtimeProgressRoute } from "./route";

const context = {
  params: Promise.resolve({ token: "capability-secret" }),
};

function request(body: unknown) {
  return new Request(
    "https://hire-evidence.example/api/interview/capability-secret/realtime-progress",
    {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
    },
  );
}

describe("POST /api/interview/[token]/realtime-progress", () => {
  it("binds persisted progression to the raw invitation capability and attempt", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          attempt_state: "active",
          interviewer_version_id: "version-1",
          resume_section_index: 0,
          resume_question_index: 1,
          resume_follow_ups_used: {},
          processed_event_ids: ["event-1"],
        },
      ],
      error: null,
    });
    const route = createProductionRealtimeProgressRoute({
      createSupabaseClient: vi.fn().mockResolvedValue({ rpc }),
    });

    const response = await route(
      request({
        attemptId: "attempt-1",
        eventId: "event-1",
        questionId: "question-1",
      }),
      context,
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "active",
      checkpoint: {
        interviewerVersionId: "version-1",
        sectionIndex: 0,
        questionIndex: 1,
        followUpsUsed: {},
        processedEventIds: ["event-1"],
      },
    });
    expect(rpc).toHaveBeenCalledWith("advance_realtime_interview_session", {
      p_token_hash: expect.any(String),
      p_attempt_id: "attempt-1",
      p_event_id: "event-1",
      p_question_id: "question-1",
    });
  });

  it("fails closed for malformed progression without invoking persistence", async () => {
    const rpc = vi.fn();
    const route = createProductionRealtimeProgressRoute({
      createSupabaseClient: vi.fn().mockResolvedValue({ rpc }),
    });

    const malformed = await route(
      request({ attemptId: "", eventId: "event-1", questionId: "question-1" }),
      context,
    );

    expect(malformed.status).toBe(400);
    const body = await malformed.text();
    expect(JSON.parse(body)).toEqual({ status: "unavailable" });
    expect(body).not.toContain("capability-secret");
    expect(rpc).not.toHaveBeenCalled();
  });
});
