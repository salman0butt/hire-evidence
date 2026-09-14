import { describe, expect, it, vi } from "vitest";

import { createRealtimeSessionHandler } from "@/lib/realtime/realtime-session-handler";
import {
  createProductionRealtimeSessionRoute,
  POST,
} from "./route";

function request() {
  return new Request("https://hire-evidence.example/api/interview/capability-secret/realtime-session", {
    method: "POST",
  });
}

const context = {
  params: Promise.resolve({ token: "capability-secret" }),
};

describe("POST /api/interview/[token]/realtime-session", () => {
  it("fails closed at the production route while no realtime provider is configured", async () => {
    const response = await POST(request(), context);
    const body = await response.text();

    expect(response.status).toBe(503);
    expect(JSON.parse(body)).toEqual({ status: "unavailable" });
    expect(body).not.toContain("capability-secret");
  });

  it("wires the configured server provider key to a lazy Supabase RPC boundary", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: { ok: true }, error: null });
    const createSupabaseClient = vi.fn().mockResolvedValue({ rpc });
    const composedHandler = vi.fn().mockResolvedValue(
      Response.json({ status: "authorized" }),
    );
    const createHandler = vi.fn((options: {
      apiKey: string | undefined;
      rpc: (
        name: string,
        args: Readonly<Record<string, unknown>>,
      ) => Promise<Readonly<{ data: unknown; error: unknown }>>;
    }) => {
      expect(options.apiKey).toBe("server-gemini-key");

      return async (incomingRequest: Request, incomingContext: typeof context) => {
        expect(incomingRequest).toBeInstanceOf(Request);
        expect(incomingContext).toBe(context);
        await expect(
          options.rpc("resolve_realtime_candidate_session", {
            raw_token: "capability-secret",
          }),
        ).resolves.toEqual({ data: { ok: true }, error: null });

        return composedHandler();
      };
    });

    const route = createProductionRealtimeSessionRoute({
      apiKey: "server-gemini-key",
      createSupabaseClient,
      createHandler,
    });
    const response = await route(request(), context);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "authorized" });
    expect(createHandler).toHaveBeenCalledOnce();
    expect(createSupabaseClient).toHaveBeenCalledOnce();
    expect(rpc).toHaveBeenCalledWith("resolve_realtime_candidate_session", {
      raw_token: "capability-secret",
    });
  });

  it("returns one constant-safe unavailable response without echoing or logging the capability", async () => {
    const authorize = vi.fn().mockResolvedValue({ status: "unavailable" });
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => undefined);

    const response = await createRealtimeSessionHandler(authorize)(request(), context);
    const body = await response.text();

    expect(authorize).toHaveBeenCalledWith("capability-secret");
    expect(response.status).toBe(404);
    expect(JSON.parse(body)).toEqual({ status: "unavailable" });
    expect(body).not.toContain("capability-secret");
    expect(consoleError).not.toHaveBeenCalled();
    expect(consoleLog).not.toHaveBeenCalled();

    consoleError.mockRestore();
    consoleLog.mockRestore();
  });

  it("returns only the narrow candidate session projection on success", async () => {
    const resumeCheckpoint = {
      interviewerVersionId: "internal-version-1",
      sectionIndex: 1,
      questionIndex: 0,
      followUpsUsed: { "question-1": 1 },
      processedEventIds: ["event-1"],
    } as const;
    const interviewPlan = {
      versionId: "internal-version-1",
      sections: [
        {
          id: "section-1",
          title: "Technical depth",
          questions: [
            {
              id: "question-1",
              prompt: "Describe a production incident you resolved.",
              required: true,
              followUpLimit: 1,
            },
          ],
        },
      ],
    } as const;
    const authorize = vi.fn().mockResolvedValue({
      status: "authorized",
      attemptId: "attempt-1",
      interviewerVersionId: "internal-version-1",
      durationSeconds: 1800,
      language: "en",
      interviewPlan,
      providerCredential: {
        credential: "short-lived-provider-token",
        expiresAt: "2026-09-12T13:00:00.000Z",
      },
      resumeCheckpoint,
    });

    const response = await createRealtimeSessionHandler(authorize)(request(), context);
    const body = await response.text();

    expect(response.status).toBe(200);
    expect(JSON.parse(body)).toEqual({
      status: "authorized",
      attemptId: "attempt-1",
      interviewerVersionId: "internal-version-1",
      durationSeconds: 1800,
      language: "en",
      interviewPlan,
      providerCredential: {
        credential: "short-lived-provider-token",
        expiresAt: "2026-09-12T13:00:00.000Z",
      },
      resumeCheckpoint,
    });
    expect(body).not.toContain("rubric");
    expect(body).not.toContain("criteria");
    expect(body).not.toContain("capability-secret");
  });

  it("maps unexpected server/provider failures to a constant-safe retryable response", async () => {
    const authorize = vi.fn().mockRejectedValue(new Error("provider-secret details"));

    const response = await createRealtimeSessionHandler(authorize)(request(), context);
    const body = await response.text();

    expect(response.status).toBe(503);
    expect(JSON.parse(body)).toEqual({ status: "unavailable" });
    expect(body).not.toContain("provider-secret details");
    expect(body).not.toContain("capability-secret");
  });
});