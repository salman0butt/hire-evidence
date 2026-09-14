import type { RealtimeResumeCheckpoint } from "./reconnect";
import type { RealtimeAttemptProgressResult } from "./session-repository";

type RealtimeProgressClientOptions = Readonly<{
  rawToken: string;
  attemptId: string;
  fetchImpl?: typeof fetch;
}>;

type ProgressInput = Readonly<{
  eventId: string;
  questionId: string;
}>;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === "number" && Number.isInteger(value) && value >= 0;
}

function isFollowUpsUsed(value: unknown): value is Readonly<Record<string, number>> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;

  return Object.entries(value).every(
    ([questionId, used]) => isNonEmptyString(questionId) && isNonNegativeInteger(used),
  );
}

function isProcessedEventIds(value: unknown): value is readonly string[] {
  return (
    Array.isArray(value) &&
    value.every(isNonEmptyString) &&
    new Set(value).size === value.length
  );
}

function parseCheckpoint(value: unknown): RealtimeResumeCheckpoint | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const checkpoint = value as Record<string, unknown>;
  if (
    !isNonEmptyString(checkpoint.interviewerVersionId) ||
    !isNonNegativeInteger(checkpoint.sectionIndex) ||
    !isNonNegativeInteger(checkpoint.questionIndex) ||
    !isFollowUpsUsed(checkpoint.followUpsUsed) ||
    !isProcessedEventIds(checkpoint.processedEventIds)
  ) {
    return null;
  }

  return Object.freeze({
    interviewerVersionId: checkpoint.interviewerVersionId,
    sectionIndex: checkpoint.sectionIndex,
    questionIndex: checkpoint.questionIndex,
    followUpsUsed: Object.freeze({ ...checkpoint.followUpsUsed }),
    processedEventIds: Object.freeze([...checkpoint.processedEventIds]),
  });
}

export function createRealtimeProgressClient(
  options: RealtimeProgressClientOptions,
): (input: ProgressInput) => Promise<RealtimeAttemptProgressResult> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const rawToken = options.rawToken;
  const attemptId = options.attemptId;

  return async (input) => {
    const response = await fetchImpl(
      `/api/interview/${encodeURIComponent(rawToken)}/realtime-progress`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId,
          eventId: input.eventId,
          questionId: input.questionId,
        }),
      },
    );

    if (response.status === 409) {
      return { status: "conflict" };
    }

    if (!response.ok) {
      throw new Error("Realtime progress update failed");
    }

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      throw new Error("Realtime progress update failed");
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("Realtime progress update failed");
    }

    const result = payload as Record<string, unknown>;
    if (result.status === "completed") {
      return { status: "completed" };
    }

    if (result.status === "active") {
      const checkpoint = parseCheckpoint(result.checkpoint);
      if (checkpoint) {
        return { status: "active", checkpoint };
      }
    }

    throw new Error("Realtime progress update failed");
  };
}