export type RealtimeConnectionStatus =
  | "idle"
  | "diagnosing"
  | "authorizing"
  | "connecting"
  | "connected"
  | "recovering"
  | "ended"
  | "error";

export type RealtimePresentationStatus = "idle" | "listening" | "thinking" | "speaking";

export type RealtimeConnectionError = Readonly<{
  recoverable: boolean;
  reason: string;
}>;

export type RealtimeConnectionState = Readonly<{
  connection: RealtimeConnectionStatus;
  presentation: RealtimePresentationStatus;
  generation: number;
  error: RealtimeConnectionError | undefined;
}>;

type GenerationEvent = Readonly<{ generation: number }>;

export type RealtimeConnectionEvent =
  | Readonly<{ type: "beginDiagnostics" }>
  | Readonly<{ type: "diagnosticsPassed" }>
  | Readonly<{ type: "diagnosticsFailed"; reason: string }>
  | Readonly<{ type: "authorizationSucceeded" }>
  | Readonly<{ type: "authorizationFailed"; reason: string }>
  | (Readonly<{ type: "transportOpen" }> & GenerationEvent)
  | (Readonly<{ type: "candidateSpeechStart" }> & GenerationEvent)
  | (Readonly<{ type: "candidateSpeechEnd" }> & GenerationEvent)
  | (Readonly<{ type: "modelAudioStarted" }> & GenerationEvent)
  | (Readonly<{ type: "modelAudioEnded" }> & GenerationEvent)
  | (Readonly<{ type: "recoverableTransportFailure"; reason: string }> & GenerationEvent)
  | (Readonly<{ type: "fatalTransportFailure"; reason: string }> & GenerationEvent)
  | Readonly<{ type: "retry" }>
  | Readonly<{ type: "end" }>
  | Readonly<{ type: "cancel" }>;

const GENERATION_EVENTS = new Set<RealtimeConnectionEvent["type"]>([
  "transportOpen",
  "candidateSpeechStart",
  "candidateSpeechEnd",
  "modelAudioStarted",
  "modelAudioEnded",
  "recoverableTransportFailure",
  "fatalTransportFailure",
]);

export function createInitialRealtimeConnectionState(): RealtimeConnectionState {
  return {
    connection: "idle",
    presentation: "idle",
    generation: 0,
    error: undefined,
  };
}

function withConnection(
  state: RealtimeConnectionState,
  connection: RealtimeConnectionStatus,
  overrides: Partial<RealtimeConnectionState> = {},
): RealtimeConnectionState {
  return {
    ...state,
    connection,
    ...overrides,
  };
}

export function reduceRealtimeConnectionState(
  state: RealtimeConnectionState,
  event: RealtimeConnectionEvent,
): RealtimeConnectionState {
  if (state.connection === "ended") {
    return state;
  }

  if (GENERATION_EVENTS.has(event.type)) {
    const generation = "generation" in event ? event.generation : undefined;
    if (generation !== state.generation) {
      return state;
    }
  }

  switch (event.type) {
    case "beginDiagnostics":
      return state.connection === "idle"
        ? withConnection(state, "diagnosing", { presentation: "idle", error: undefined })
        : state;

    case "diagnosticsPassed":
      return state.connection === "diagnosing"
        ? withConnection(state, "authorizing", { error: undefined })
        : state;

    case "diagnosticsFailed":
      return state.connection === "diagnosing"
        ? withConnection(state, "error", {
            presentation: "idle",
            error: { recoverable: true, reason: event.reason },
          })
        : state;

    case "authorizationSucceeded":
      return state.connection === "authorizing"
        ? withConnection(state, "connecting", {
            generation: state.generation + 1,
            presentation: "idle",
            error: undefined,
          })
        : state;

    case "authorizationFailed":
      return state.connection === "authorizing"
        ? withConnection(state, "error", {
            presentation: "idle",
            error: { recoverable: false, reason: event.reason },
          })
        : state;

    case "transportOpen":
      return state.connection === "connecting"
        ? withConnection(state, "connected", {
            presentation: "listening",
            error: undefined,
          })
        : state;

    case "candidateSpeechStart":
      return state.connection === "connected"
        ? withConnection(state, "connected", { presentation: "listening" })
        : state;

    case "candidateSpeechEnd":
      return state.connection === "connected"
        ? withConnection(state, "connected", { presentation: "thinking" })
        : state;

    case "modelAudioStarted":
      return state.connection === "connected"
        ? withConnection(state, "connected", { presentation: "speaking" })
        : state;

    case "modelAudioEnded":
      return state.connection === "connected"
        ? withConnection(state, "connected", { presentation: "listening" })
        : state;

    case "recoverableTransportFailure":
      return state.connection === "connected" || state.connection === "connecting"
        ? withConnection(state, "recovering", {
            presentation: "idle",
            error: { recoverable: true, reason: event.reason },
          })
        : state;

    case "fatalTransportFailure":
      return state.connection === "connected" || state.connection === "connecting"
        ? withConnection(state, "error", {
            presentation: "idle",
            error: { recoverable: false, reason: event.reason },
          })
        : state;

    case "retry":
      return state.connection === "recovering"
        ? withConnection(state, "connecting", {
            generation: state.generation + 1,
            presentation: "idle",
            error: undefined,
          })
        : state;

    case "end":
    case "cancel":
      return withConnection(state, "ended", {
        presentation: "idle",
        error: undefined,
      });
  }
}
