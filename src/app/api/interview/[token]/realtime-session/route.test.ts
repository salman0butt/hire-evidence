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

type RpcResult = Readonly<{ data: unknown; error: unknown }>;
type Rpc = (
  name: string,
  args: Readonly<Record<string, unknown>>,
) => Promise<RpcResult>;
type SignalRecorder = (input: unknown) => Promise<void>;

describe("POST /api/interview/[token]/realtime-session", () => {
  it("fails closed at the production route while no realtime provider is configured", async () => {
    const response = await POST(request(), context);
    const body = await response.text();

    expect(response.status).toBe(503);
    expect(JSON.parse(body)).toEqual({ status: "unavailable" });
    expect(body).not.toContain("capability-secret");
  });

  it("wires provider RPC and a separate backend-only operational-signal RPC boundary", async () => {
    const rpc = vi.fn<Rpc>().mockResolvedValue({ data: { ok: true }, error: null });
    const operationalRpc = vi.fn<Rpc>().mockResolvedValue({ data: 1, error: null });
    const createSupabaseClient = vi.fn().mockResolvedValue({ rpc });
    const createOperationalSupabaseClient = vi.fn().mockResolvedValue({ rpc: operationalRpc });
    const composedHandler = vi.fn().mockResolvedValue(
      Response.json({ status: "authorized" }),
    );
    const createHandler = vi.fn((options: {
      apiKey: string | undefined;
      rpc: Rpc;
      recordOperationalSignal?: SignalRecorder;
    }) => {
      expect(options.apiKey).toBe("server-gemini-key");
      expect(options.recordOperationalSignal).toBeTypeOf("function");

      return async (incomingRequest: Request, incomingContext: typeof context) => {
        expect(incomingRequest).toBeInstanceOf(Request);
        expect(incomingContext).toBe(context);
        await expect(
          options.rpc("resolve_realtime_candidate_session", {
            raw_token: "capability-secret",
          }),
        ).resolves.toEqual({ data: { ok: true }, error: null });
        await options.recordOperationalSignal!({
          requestId: "req-1",
          correlationId: "corr-1",
          service: "realtime-session",
          status: "ok",
          latencyMs: 12,
        });

        return composedHandler();
      };
    });

    type DesiredRouteOptions = Parameters<typeof createProductionRealtimeSessionRoute>[0] & Readonly<{
      createOperationalSupabaseClient: () => Promise<Readonly<{ rpc: Rpc }>>;
    }>;

    const route = createProductionRealtimeSessionRoute({
      apiKey: "server-gemini-key",
      createSupabaseClient,
      createOperationalSupabaseClient,
      createHandler,
    } as DesiredRouteOptions);
    const response = await route(request(), context);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({ status: "authorized" });
    expect(createHandler).toHaveBeenCalledOnce();
    expect(createSupabaseClient).toHaveBeenCalledOnce();
    expect(rpc).toHaveBeenCalledWith("resolve_realtime_candidate_session", {
      raw_token: "capability-secret",
    });
    expect(createOperationalSupabaseClient).toHaveBeenCalledOnce();
    expect(operationalRpc).toHaveBeenCalledWith("record_operational_signal", {
      p_request_id: "req-1",
      p_correlation_id: "corr-1",
      p_service: "realtime-session",
      p_status: "ok",
      p_latency_ms: 12,
      p_error_code: null,
    });
  });

  it("records bounded request health without letting telemetry failure change the candidate response", async () => {
    const authorize = vi.fn().mockResolvedValue({
      status: "authorized",
      attemptId: "attempt-1",
      interviewerVersionId: "version-1",
      durationSeconds: 1800,
      language: "en",
      interviewPlan: { versionId: "version-1", sections: [] },
      providerCredential: {
        credential: "short-lived-provider-token",
        expiresAt: "2026-10-06T07:00:00.000Z",
      },
    });
    const recordOperationalSignal = vi.fn<SignalRecorder>()
      .mockRejectedValue(new Error("telemetry infrastructure detail"));
    const times = [1000, 1042];
    const nowMs = vi.fn(() => times.shift() ?? 1042);
    const createId = vi.fn(() => "op-request-1");

    type InstrumentedHandlerFactory = (
      authorizeInput: typeof authorize,
      options: Readonly<{
        recordOperationalSignal: SignalRecorder;
        nowMs: () => number;
        createId: () => string;
      }>,
    ) => ReturnType<typeof createRealtimeSessionHandler>;

    const handler = (createRealtimeSessionHandler as unknown as InstrumentedHandlerFactory)(
      authorize,
      { recordOperationalSignal, nowMs, createId },
    );
    const response = await handler(request(), context);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({ status: "authorized" });
    expect(recordOperationalSignal).toHaveBeenCalledWith({
      requestId: "op-request-1",
      correlationId: "op-request-1",
      service: "realtime-session",
      status: "ok",
      latencyMs: 42,
    });
  });

  it("records a constant machine-readable failure without leaking provider or capability details", async () => {
    const authorize = vi.fn().mockRejectedValue(new Error("provider-secret details"));
    const recordOperationalSignal = vi.fn<SignalRecorder>().mockResolvedValue(undefined);
    const times = [5000, 5015];
    const nowMs = vi.fn(() => times.shift() ?? 5015);

    type InstrumentedHandlerFactory = (
      authorizeInput: typeof authorize,
      options: Readonly<{
        recordOperationalSignal: SignalRecorder;
        nowMs: () => number;
        createId: () => string;
      }>,
    ) => ReturnType<typeof createRealtimeSessionHandler>;

    const handler = (createRealtimeSessionHandler as unknown as InstrumentedHandlerFactory)(
      authorize,
      {
        recordOperationalSignal,
        nowMs,
        createId: () => "op-request-2",
      },
    );
    const response = await handler(request(), context);

    expect(response.status).toBe(503);
    expect(recordOperationalSignal).toHaveBeenCalledWith({
      requestId: "op-request-2",
      correlationId: "op-request-2",
      service: "realtime-session",
      status: "error",
      latencyMs: 15,
      errorCode: "REALTIME_SESSION_UNAVAILABLE",
    });
    expect(JSON.stringify(recordOperationalSignal.mock.calls)).not.toContain("provider-secret details");
    expect(JSON.stringify(recordOperationalSignal.mock.calls)).not.toContain("capability-secret");
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
