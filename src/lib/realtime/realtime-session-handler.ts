import type { RealtimeSessionAuthorization } from "./session-authorization";

type RealtimeSessionAuthorizer = (
  rawToken: string,
) => Promise<RealtimeSessionAuthorization>;

type RealtimeSessionRouteContext = Readonly<{
  params: Promise<Readonly<{ token: string }>>;
}>;

type OperationalSignalRecorder = (input: unknown) => Promise<void>;

type RealtimeSessionHandlerOptions = Readonly<{
  recordOperationalSignal?: OperationalSignalRecorder;
  nowMs?: () => number;
  createId?: () => string;
}>;

function boundedLatency(startedAt: number, completedAt: number): number {
  if (!Number.isFinite(startedAt) || !Number.isFinite(completedAt)) return 0;
  return Math.min(3_600_000, Math.max(0, Math.round(completedAt - startedAt)));
}

export function createRealtimeSessionHandler(
  authorize: RealtimeSessionAuthorizer,
  options: RealtimeSessionHandlerOptions = {},
) {
  return async function handleRealtimeSession(
    _request: Request,
    context: RealtimeSessionRouteContext,
  ): Promise<Response> {
    const { token } = await context.params;
    const nowMs = options.nowMs ?? Date.now;
    const createId = options.createId ?? (() => crypto.randomUUID());

    let startedAt: number | undefined;
    let requestId: string | undefined;
    if (options.recordOperationalSignal) {
      try {
        startedAt = nowMs();
        requestId = createId();
      } catch {
        startedAt = undefined;
        requestId = undefined;
      }
    }

    let response: Response;
    try {
      const authorization = await authorize(token);
      if (authorization.status !== "authorized") {
        response = Response.json({ status: "unavailable" }, { status: 404 });
      } else {
        response = Response.json({
          status: "authorized",
          attemptId: authorization.attemptId,
          interviewerVersionId: authorization.interviewerVersionId,
          durationSeconds: authorization.durationSeconds,
          language: authorization.language,
          interviewPlan: authorization.interviewPlan,
          providerCredential: authorization.providerCredential,
          ...(authorization.resumeCheckpoint
            ? { resumeCheckpoint: authorization.resumeCheckpoint }
            : {}),
          ...(authorization.transcriptTurns
            ? { transcriptTurns: authorization.transcriptTurns }
            : {}),
        });
      }
    } catch {
      response = Response.json({ status: "unavailable" }, { status: 503 });
    }

    if (
      options.recordOperationalSignal &&
      startedAt !== undefined &&
      requestId !== undefined
    ) {
      try {
        const latencyMs = boundedLatency(startedAt, nowMs());
        await options.recordOperationalSignal({
          requestId,
          correlationId: requestId,
          service: "realtime-session",
          status: response.status >= 500 ? "error" : "ok",
          latencyMs,
          ...(response.status >= 500
            ? { errorCode: "REALTIME_SESSION_UNAVAILABLE" }
            : {}),
        });
      } catch {
        // Operational telemetry is best-effort and must never affect the
        // candidate-facing authorization response.
      }
    }

    return response;
  };
}
