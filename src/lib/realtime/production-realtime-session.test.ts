import { describe, expect, it, vi } from "vitest";

import { createProductionRealtimeSessionHandler } from "./production-realtime-session";

type Rpc = (
  name: string,
  args: Readonly<Record<string, unknown>>,
) => Promise<Readonly<{ data: unknown; error: unknown }>>;

const request = new Request(
  "https://hire-evidence.example/api/interview/capability-secret/realtime-session",
  { method: "POST" },
);
const context = { params: Promise.resolve({ token: "capability-secret" }) };

describe("production realtime session composition", () => {
  it("fails closed without a Gemini server API key", async () => {
    const rpc = vi.fn<Rpc>();
    const fetchImpl = vi.fn<typeof fetch>();
    const handler = createProductionRealtimeSessionHandler({
      apiKey: undefined,
      rpc,
      fetchImpl,
    });

    const response = await handler(request, context);

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual({ status: "unavailable" });
    expect(rpc).not.toHaveBeenCalled();
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("authorizes the capability through Supabase before minting a constrained Gemini token", async () => {
    const rpc = vi.fn<Rpc>(async (name) => {
      if (name === "resolve_realtime_candidate_session") {
        return {
          data: [
            {
              invitation_id: "11111111-1111-4111-8111-111111111111",
              candidate_id: "22222222-2222-4222-8222-222222222222",
              interviewer_version_id: "33333333-3333-4333-8333-333333333333",
              duration_seconds: 1800,
              language: "en",
              lifecycle: "sent",
              has_current_consent: true,
            },
          ],
          error: null,
        };
      }
      if (name === "authorize_realtime_interview_session") {
        return {
          data: [
            {
              attempt_id: "44444444-4444-4444-8444-444444444444",
              interviewer_version_id: "33333333-3333-4333-8333-333333333333",
              resume_section_index: 0,
              resume_question_index: 0,
              resume_follow_ups_used: {},
              processed_event_ids: [],
            },
          ],
          error: null,
        };
      }
      throw new Error(`unexpected RPC: ${name}`);
    });
    const fetchImpl = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ name: "auth_tokens/ephemeral-1" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const handler = createProductionRealtimeSessionHandler({
      apiKey: "server-only-gemini-key",
      rpc,
      fetchImpl,
      now: () => new Date("2026-09-14T08:30:00.000Z"),
    });

    const response = await handler(request, context);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(JSON.parse(body)).toMatchObject({
      status: "authorized",
      attemptId: "44444444-4444-4444-8444-444444444444",
      durationSeconds: 1800,
      language: "en",
      providerCredential: {
        credential: "auth_tokens/ephemeral-1",
        expiresAt: "2026-09-14T08:34:00.000Z",
      },
    });
    expect(body).not.toContain("capability-secret");
    expect(body).not.toContain("server-only-gemini-key");
    expect(rpc.mock.calls.map(([name]) => name)).toEqual([
      "resolve_realtime_candidate_session",
      "authorize_realtime_interview_session",
    ]);
    expect(fetchImpl).toHaveBeenCalledTimes(1);
  });
});
