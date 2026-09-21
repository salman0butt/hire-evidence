export type CandidateReviewTranscriptSpeaker = "candidate" | "interviewer";

export type CandidateReviewTranscriptTurn = Readonly<{
  id: string;
  eventId: string;
  sequence: number;
  speaker: CandidateReviewTranscriptSpeaker;
  text: string;
  startedAt: string | null;
  endedAt: string | null;
  finalizedAt: string;
}>;

type RpcResult = Readonly<{
  data: unknown;
  error: unknown;
}>;

type RpcClient = Readonly<{
  rpc: (
    name: string,
    args: Readonly<Record<string, unknown>>,
  ) => PromiseLike<RpcResult>;
}>;

type TranscriptRow = Readonly<{
  message_id: string;
  event_id: string;
  sequence: number;
  speaker: CandidateReviewTranscriptSpeaker;
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
    Number.isInteger(row.sequence) &&
    (row.sequence as number) > 0 &&
    (row.speaker === "candidate" || row.speaker === "interviewer") &&
    isNonEmptyString(row.text) &&
    isTimestampOrNull(row.started_at) &&
    isTimestampOrNull(row.ended_at) &&
    (row.started_at === null ||
      row.ended_at === null ||
      Date.parse(row.ended_at) >= Date.parse(row.started_at)) &&
    isNonEmptyString(row.finalized_at) &&
    !Number.isNaN(Date.parse(row.finalized_at))
  );
}

function toTurn(row: TranscriptRow): CandidateReviewTranscriptTurn {
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

export function createCandidateReviewTranscriptRepository(client: RpcClient) {
  return Object.freeze({
    async getCandidateTranscript(
      organizationId: string,
      jobId: string,
      candidateId: string,
      attemptId: string,
    ): Promise<readonly CandidateReviewTranscriptTurn[]> {
      const { data, error } = await client.rpc("get_candidate_review_transcript", {
        p_organization_id: organizationId,
        p_job_id: jobId,
        p_candidate_id: candidateId,
        p_attempt_id: attemptId,
      });

      if (error || !Array.isArray(data) || !data.every(isTranscriptRow)) {
        throw new Error("candidate transcript unavailable");
      }

      const rows = data as TranscriptRow[];
      const messageIds = new Set<string>();
      const eventIds = new Set<string>();

      for (let index = 0; index < rows.length; index += 1) {
        const row = rows[index];

        if (
          !row ||
          row.sequence !== index + 1 ||
          messageIds.has(row.message_id) ||
          eventIds.has(row.event_id)
        ) {
          throw new Error("candidate transcript unavailable");
        }

        messageIds.add(row.message_id);
        eventIds.add(row.event_id);
      }

      return Object.freeze(rows.map(toTurn));
    },
  });
}
