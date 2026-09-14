import { describe, expect, it } from "vitest";

import {
  applyRealtimePacingEvent,
  createRealtimePacingState,
  getRealtimePacingDecision,
} from "./pacing";

describe("realtime interview pacing", () => {
  it("counts only monotonic active interview time and ignores backwards clock samples", () => {
    let state = createRealtimePacingState({
      durationSeconds: 600,
      startedAtMs: 1_000,
    });

    state = applyRealtimePacingEvent(state, { type: "tick", nowMs: 31_000 });
    expect(state.activeElapsedMs).toBe(30_000);

    state = applyRealtimePacingEvent(state, { type: "tick", nowMs: 25_000 });
    expect(state.activeElapsedMs).toBe(30_000);

    state = applyRealtimePacingEvent(state, { type: "tick", nowMs: 41_000 });
    expect(state.activeElapsedMs).toBe(40_000);
    expect(getRealtimePacingDecision(state, { requiredQuestionsRemaining: 2 })).toMatchObject({
      remainingMs: 560_000,
      action: "continue",
    });
  });

  it("keeps infrastructure downtime separate from candidate active interview time", () => {
    let state = createRealtimePacingState({
      durationSeconds: 300,
      startedAtMs: 0,
    });

    state = applyRealtimePacingEvent(state, { type: "tick", nowMs: 30_000 });
    state = applyRealtimePacingEvent(state, { type: "infrastructureDowntimeStarted", nowMs: 30_000 });
    state = applyRealtimePacingEvent(state, { type: "tick", nowMs: 90_000 });
    state = applyRealtimePacingEvent(state, { type: "infrastructureDowntimeEnded", nowMs: 120_000 });
    state = applyRealtimePacingEvent(state, { type: "tick", nowMs: 150_000 });

    expect(state.activeElapsedMs).toBe(60_000);
    expect(state.infrastructureDowntimeMs).toBe(90_000);
    expect(getRealtimePacingDecision(state, { requiredQuestionsRemaining: 1 }).remainingMs).toBe(
      240_000,
    );
  });

  it("suppresses optional follow-ups near the deadline while preserving required questions", () => {
    let state = createRealtimePacingState({ durationSeconds: 120, startedAtMs: 0 });
    state = applyRealtimePacingEvent(state, { type: "tick", nowMs: 75_000 });

    expect(
      getRealtimePacingDecision(state, {
        requiredQuestionsRemaining: 1,
        optionalFollowUpAvailable: true,
        optionalFollowUpReserveMs: 60_000,
      }),
    ).toEqual({
      remainingMs: 45_000,
      action: "suppress-optional-follow-up",
    });
  });

  it("ends gracefully when the budget expires without deriving candidate quality", () => {
    let state = createRealtimePacingState({ durationSeconds: 60, startedAtMs: 10_000 });
    state = applyRealtimePacingEvent(state, { type: "tick", nowMs: 70_000 });

    expect(
      getRealtimePacingDecision(state, {
        requiredQuestionsRemaining: 3,
        optionalFollowUpAvailable: true,
      }),
    ).toEqual({
      remainingMs: 0,
      action: "complete-gracefully",
    });
  });

  it("completes when required work is done and no optional follow-up remains", () => {
    const state = createRealtimePacingState({ durationSeconds: 600, startedAtMs: 0 });

    expect(
      getRealtimePacingDecision(state, {
        requiredQuestionsRemaining: 0,
        optionalFollowUpAvailable: false,
      }),
    ).toEqual({
      remainingMs: 600_000,
      action: "complete-gracefully",
    });
  });
});
