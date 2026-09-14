import { hashInvitationToken } from "@/lib/candidates/invitation-token";
import type { TranscriptSpeaker } from "./transport";

type RpcResult = Readonly<{
  data: unknown;
  error: unknown;
}>;

type Rpc = (
  name: string,
  args: Readonly<Record<string, unknown>>,
) => Promise<RpcResult>;

export type DurableTranscriptTurn = Readonly<{
  id: string;
  eventId: string;
  sequence: number;
  speaker: TranscriptSpeaker;
  text: string;
  startedAt: string | null;
  endedAt: string | null;
  finalizedAt: string;
}>;

export type AppendFinalizedTurnResult =
  | Readonly<{ status: "appended"; turn: DurableTranscriptTurn }>
  | Readonly<{ status: "conflict" }>;

export type ListFinalizedTurnsResult =
  | Readonly<{ status: "available"; turns: readonly DurableTranscriptTurn[] }>
  | Readonly<{ status: "conflict" }>;

export type TranscriptRepository = Readonly<{
  appendFinalizedTurn(input: Readonly<{
    rawToken: string;
    attemptId: string;
    eventId: string;
    speaker: TranscriptSpeaker;
    text: string;
    startedAt: string | null;
    endedAt: string | null;
  }>): Promise<AppendFinalizedTurnResult>;
  listFinalizedTurns(input: Readonly<{
    rawToken: string;
    attemptId: string;
  }>): Promise<ListFinalizedTurnsResult>;
}>;

type TranscriptRow = Readonly<{
  message_id: string;
  event_id: string;
  sequence: number;
  speaker: TranscriptSpeaker;
  text: string;
  started_at: string | null;
  ended_at: string | null;
  finalized_at: string;
}>;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isTimestampOrNull(value: unknown): value is string | null {
  return value === null || (isNonEmptyString(value) && !Number.isNaN(Date.parse(value)));
}

function isTranscriptRow(value: unknown): value is TranscriptRow {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  const row = value as Record<string, unknown>;
  return (
    isNonEmptyString(row.message_id) &&
    isNonEmptyString(row.event_id) &&
    typeof row.sequence === "number" &&
    Number.isInteger(row.sequence) &&
    row.sequence > 0 &&
    (row.speaker === "candidate" || row.speaker === "interviewer") &&
    isNonEmptyString(row.text) &&
    isTimestampOrNull(row.started_at) &&
    isTimestampOrNull(row.ended_at) &&
    isNonEmptyString(row.finalized_at) &&
    !Number.isNaN(Date.parse(row.finalized_at))
  );
}

function toTurn(row: TranscriptRow): DurableTranscriptTurn {
  return Object.freeze({
    id: row.message_id,
    eventId: row.event_id,
    sequence: row.sequence,
    speaker: row.speaker,
    text: row.text,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    finalizedAt: row.finalized_at,
  });
}

export function createTranscriptRepository(rpc: Rpc): TranscriptRepository {
  return Object.freeze({
    async appendFinalizedTurn(input): Promise<AppendFinalizedTurnResult> {
      if (
        !input.rawToken ||
        !input.attemptId ||
        !input.eventId ||
        !input.text.trim() ||
        (input.speaker !== "candidate" && input.speaker !== "interviewer")
      ) {
        return { status: "conflict" };
      }

      const { data, error } = await rpc("append_realtime_interview_transcript_turn", {
        p_token_hash: hashInvitationToken(input.rawToken),
        p_attempt_id: input.attemptId,
        p_event_id: input.eventId,
        p_speaker: input.speaker,
        p_text: input.text,
        p_started_at: input.startedAt,
        p_ended_at: input.endedAt,
      });

      if (error || !Array.isArray(data) || data.length !== 1 || !isTranscriptRow(data[0])) {
        return { status: "conflict" };
      }

      return { status: "appended", turn: toTurn(data[0]) };
    },

    async listFinalizedTurns(input): Promise<ListFinalizedTurnsResult> {
      if (!input.rawToken || !input.attemptId) return { status: "conflict" };

      const { data, error } = await rpc("list_realtime_interview_transcript", {
        p_token_hash: hashInvitationToken(input.rawToken),
        p_attempt_id: input.attemptId,
      });

      if (error || !Array.isArray(data) || !data.every(isTranscriptRow)) {
        return { status: "conflict" };
      }

      const rows = data as TranscriptRow[];
      const eventIds = new Set<string>();
      const messageIds = new Set<string>();
      for (let index = 0; index < rows.length; index += 1) {
        const row = rows[index];
        if (
          !row ||
          row.sequence !== index + 1 ||
          eventIds.has(row.event_id) ||
          messageIds.has(row.message_id)
        ) {
          return { status: "conflict" };
        }
        eventIds.add(row.event_id);
        messageIds.add(row.message_id);
      }

      return Object.freeze({
        status: "available",
        turns: Object.freeze(rows.map(toTurn)),
      });
    },
  });
}
