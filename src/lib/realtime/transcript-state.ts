import type { RealtimeTransportEvent, TranscriptSpeaker } from "./transport";

export type InterviewTranscriptTurn = Readonly<{
  speaker: TranscriptSpeaker;
  text: string;
}>;

export type TranscriptState = Readonly<{
  partials: Readonly<Record<TranscriptSpeaker, string>>;
  finalizedTurns: ReadonlyArray<InterviewTranscriptTurn>;
}>;

type TranscriptEvent = Extract<
  RealtimeTransportEvent,
  { type: "partialTranscript" | "finalTranscript" }
>;

function freezeState(
  partials: Record<TranscriptSpeaker, string>,
  finalizedTurns: InterviewTranscriptTurn[],
): TranscriptState {
  return Object.freeze({
    partials: Object.freeze(partials),
    finalizedTurns: Object.freeze(finalizedTurns),
  });
}

export function createTranscriptState(
  finalizedTurns: readonly InterviewTranscriptTurn[] = [],
): TranscriptState {
  return freezeState(
    {
      candidate: "",
      interviewer: "",
    },
    finalizedTurns.map((turn) =>
      Object.freeze({
        speaker: turn.speaker,
        text: turn.text,
      }),
    ),
  );
}

export function applyTranscriptEvent(
  state: TranscriptState,
  event: TranscriptEvent,
): TranscriptState {
  if (event.type === "partialTranscript") {
    if (state.partials[event.speaker] === event.text) {
      return state;
    }

    return freezeState(
      {
        ...state.partials,
        [event.speaker]: event.text,
      },
      [...state.finalizedTurns],
    );
  }

  const text = event.text.trim();
  if (!text) {
    return state;
  }

  const turn = Object.freeze({
    speaker: event.speaker,
    text,
  });

  return freezeState(
    {
      ...state.partials,
      [event.speaker]: "",
    },
    [...state.finalizedTurns, turn],
  );
}
