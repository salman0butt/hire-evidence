import { describe, expect, it } from "vitest";

import { applyTranscriptEvent, createTranscriptState } from "./transcript-state";

describe("interview transcript state", () => {
  it("keeps partial hypotheses ephemeral per speaker", () => {
    const initial = createTranscriptState();
    const candidatePartial = applyTranscriptEvent(initial, {
      type: "partialTranscript",
      speaker: "candidate",
      text: "I built",
    });
    const interviewerPartial = applyTranscriptEvent(candidatePartial, {
      type: "partialTranscript",
      speaker: "interviewer",
      text: "Tell me more",
    });

    expect(interviewerPartial).toEqual({
      partials: {
        candidate: "I built",
        interviewer: "Tell me more",
      },
      finalizedTurns: [],
    });
  });

  it("finalizes only non-empty turns and clears only that speaker preview", () => {
    let state = createTranscriptState();
    state = applyTranscriptEvent(state, {
      type: "partialTranscript",
      speaker: "candidate",
      text: "I built",
    });
    state = applyTranscriptEvent(state, {
      type: "partialTranscript",
      speaker: "interviewer",
      text: "Listening",
    });
    state = applyTranscriptEvent(state, {
      type: "finalTranscript",
      speaker: "candidate",
      text: "  I built the service.  ",
    });

    expect(state).toEqual({
      partials: {
        candidate: "",
        interviewer: "Listening",
      },
      finalizedTurns: [
        {
          speaker: "candidate",
          text: "I built the service.",
        },
      ],
    });

    const unchanged = applyTranscriptEvent(state, {
      type: "finalTranscript",
      speaker: "interviewer",
      text: "   ",
    });
    expect(unchanged).toBe(state);
  });

  it("returns immutable snapshots so committed turns cannot be mutated", () => {
    const state = applyTranscriptEvent(createTranscriptState(), {
      type: "finalTranscript",
      speaker: "interviewer",
      text: "First question",
    });

    expect(Object.isFrozen(state)).toBe(true);
    expect(Object.isFrozen(state.partials)).toBe(true);
    expect(Object.isFrozen(state.finalizedTurns)).toBe(true);
    expect(Object.isFrozen(state.finalizedTurns[0])).toBe(true);
  });
});
