import type {
  RecordTechnicalEventResult,
  TechnicalEventCategory,
} from "./technical-event-repository";

type RealtimeTechnicalEventClientOptions = Readonly<{
  rawToken: string;
  attemptId: string;
  fetchImpl?: typeof fetch;
}>;

type TechnicalEventInput = Readonly<{
  category: TechnicalEventCategory;
  occurredAt: string;
}>;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function isCategory(value: unknown): value is TechnicalEventCategory {
  return (
    value === "provider_disconnect" ||
    value === "browser_disconnect" ||
    value === "microphone_failure" ||
    value === "reconnect_failure"
  );
}

export function createRealtimeTechnicalEventClient(
  options: RealtimeTechnicalEventClientOptions,
): (input: TechnicalEventInput) => Promise<RecordTechnicalEventResult> {
  const fetchImpl = options.fetchImpl ?? fetch;

  return async (input) => {
    const response = await fetchImpl(
      `/api/interview/${encodeURIComponent(options.rawToken)}/realtime-technical-event`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: options.attemptId,
          category: input.category,
          occurredAt: input.occurredAt,
        }),
      },
    );

    if (response.status === 409) return { status: "conflict" };
    if (!response.ok) return { status: "conflict" };

    let payload: unknown;
    try {
      payload = await response.json();
    } catch {
      return { status: "conflict" };
    }

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      return { status: "conflict" };
    }

    const result = payload as Record<string, unknown>;
    if (
      result.status !== "recorded" ||
      !result.event ||
      typeof result.event !== "object" ||
      Array.isArray(result.event)
    ) {
      return { status: "conflict" };
    }

    const event = result.event as Record<string, unknown>;
    if (
      !isNonEmptyString(event.id) ||
      !isCategory(event.category) ||
      event.category !== input.category ||
      !isNonEmptyString(event.occurredAt) ||
      Number.isNaN(Date.parse(event.occurredAt)) ||
      event.occurredAt !== input.occurredAt
    ) {
      return { status: "conflict" };
    }

    return {
      status: "recorded",
      event: Object.freeze({
        id: event.id,
        category: event.category,
        occurredAt: event.occurredAt,
      }),
    };
  };
}
