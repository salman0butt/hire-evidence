import { hashInvitationToken } from "@/lib/candidates/invitation-token";

type RpcResult = Readonly<{
  data: unknown;
  error: unknown;
}>;

type Rpc = (
  name: string,
  args: Readonly<Record<string, unknown>>,
) => Promise<RpcResult>;

export type TechnicalEventCategory =
  | "provider_disconnect"
  | "browser_disconnect"
  | "microphone_failure"
  | "reconnect_failure";

export type DurableTechnicalEvent = Readonly<{
  id: string;
  category: TechnicalEventCategory;
  occurredAt: string;
}>;

export type RecordTechnicalEventResult =
  | Readonly<{ status: "recorded"; event: DurableTechnicalEvent }>
  | Readonly<{ status: "conflict" }>;

export type TechnicalEventRepository = Readonly<{
  recordTechnicalEvent(input: Readonly<{
    rawToken: string;
    attemptId: string;
    category: TechnicalEventCategory;
    occurredAt: string;
  }>): Promise<RecordTechnicalEventResult>;
}>;

type TechnicalEventRow = Readonly<{
  event_id: string;
  category: TechnicalEventCategory;
  occurred_at: string;
}>;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isTechnicalEventCategory(value: unknown): value is TechnicalEventCategory {
  return (
    value === "provider_disconnect" ||
    value === "browser_disconnect" ||
    value === "microphone_failure" ||
    value === "reconnect_failure"
  );
}

function isTechnicalEventRow(value: unknown): value is TechnicalEventRow {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const row = value as Record<string, unknown>;
  return (
    isNonEmptyString(row.event_id) &&
    isTechnicalEventCategory(row.category) &&
    isNonEmptyString(row.occurred_at) &&
    !Number.isNaN(Date.parse(row.occurred_at))
  );
}

export function createTechnicalEventRepository(rpc: Rpc): TechnicalEventRepository {
  return Object.freeze({
    async recordTechnicalEvent(input): Promise<RecordTechnicalEventResult> {
      if (
        !input.rawToken ||
        !input.attemptId ||
        !isTechnicalEventCategory(input.category) ||
        !input.occurredAt ||
        Number.isNaN(Date.parse(input.occurredAt))
      ) {
        return { status: "conflict" };
      }

      const { data, error } = await rpc("record_realtime_interview_technical_event", {
        p_token_hash: hashInvitationToken(input.rawToken),
        p_attempt_id: input.attemptId,
        p_category: input.category,
        p_occurred_at: input.occurredAt,
      });

      if (
        error ||
        !Array.isArray(data) ||
        data.length !== 1 ||
        !isTechnicalEventRow(data[0])
      ) {
        return { status: "conflict" };
      }

      const row = data[0];
      if (row.category !== input.category || row.occurred_at !== input.occurredAt) {
        return { status: "conflict" };
      }

      return Object.freeze({
        status: "recorded",
        event: Object.freeze({
          id: row.event_id,
          category: row.category,
          occurredAt: row.occurred_at,
        }),
      });
    },
  });
}
