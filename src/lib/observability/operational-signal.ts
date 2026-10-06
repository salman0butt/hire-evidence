export type OperationalSignal = Readonly<{
  requestId: string;
  correlationId: string;
  service: string;
  status: "ok" | "degraded" | "error";
  latencyMs: number;
  errorCode?: string;
}>;

type RpcResult = Readonly<{
  data: unknown;
  error: unknown;
}>;

type Rpc = (
  name: string,
  args: Readonly<Record<string, unknown>>,
) => Promise<RpcResult>;

const allowedKeys = new Set([
  "requestId",
  "correlationId",
  "service",
  "status",
  "latencyMs",
  "errorCode",
]);
const allowedStatuses = new Set<OperationalSignal["status"]>(["ok", "degraded", "error"]);
const identifierPattern = /^[A-Za-z0-9._:-]{1,128}$/;
const servicePattern = /^[a-z0-9-]{1,64}$/;
const errorCodePattern = /^[A-Z][A-Z0-9_]{0,63}$/;
const maxLatencyMs = 3_600_000;

function invalid(): never {
  throw new Error("Invalid operational signal");
}

export function createOperationalSignal(input: unknown): OperationalSignal {
  if (typeof input !== "object" || input === null || Array.isArray(input)) invalid();

  const record = input as Record<string, unknown>;
  if (Object.keys(record).some((key) => !allowedKeys.has(key))) invalid();

  const { requestId, correlationId, service, status, latencyMs, errorCode } = record;
  if (typeof requestId !== "string" || !identifierPattern.test(requestId)) invalid();
  if (typeof correlationId !== "string" || !identifierPattern.test(correlationId)) invalid();
  if (typeof service !== "string" || !servicePattern.test(service)) invalid();
  if (typeof status !== "string" || !allowedStatuses.has(status as OperationalSignal["status"])) invalid();
  if (!Number.isFinite(latencyMs) || typeof latencyMs !== "number" || latencyMs < 0 || latencyMs > maxLatencyMs) invalid();
  if (errorCode !== undefined && (typeof errorCode !== "string" || !errorCodePattern.test(errorCode))) invalid();
  if (status === "error" && errorCode === undefined) invalid();

  return Object.freeze({
    requestId,
    correlationId,
    service,
    status: status as OperationalSignal["status"],
    latencyMs,
    ...(errorCode === undefined ? {} : { errorCode }),
  });
}

export function createOperationalSignalRecorder(rpc: Rpc) {
  return async function recordOperationalSignal(input: unknown): Promise<void> {
    const signal = createOperationalSignal(input);

    let result: RpcResult;
    try {
      result = await rpc("record_operational_signal", {
        p_request_id: signal.requestId,
        p_correlation_id: signal.correlationId,
        p_service: signal.service,
        p_status: signal.status,
        p_latency_ms: signal.latencyMs,
        p_error_code: signal.errorCode ?? null,
      });
    } catch {
      throw new Error("operational signal unavailable");
    }

    if (result.error) {
      throw new Error("operational signal unavailable");
    }
  };
}
