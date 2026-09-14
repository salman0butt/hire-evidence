export type RealtimePacingState = Readonly<{
  durationMs: number;
  activeElapsedMs: number;
  infrastructureDowntimeMs: number;
  lastObservedMs: number;
  infrastructureDowntimeStartedAtMs: number | null;
}>;

export type RealtimePacingEvent =
  | Readonly<{ type: "tick"; nowMs: number }>
  | Readonly<{ type: "infrastructureDowntimeStarted"; nowMs: number }>
  | Readonly<{ type: "infrastructureDowntimeEnded"; nowMs: number }>;

export type RealtimePacingAction =
  | "continue"
  | "suppress-optional-follow-up"
  | "complete-gracefully";

export type RealtimePacingDecision = Readonly<{
  remainingMs: number;
  action: RealtimePacingAction;
}>;

export type RealtimePacingDecisionInput = Readonly<{
  requiredQuestionsRemaining: number;
  optionalFollowUpAvailable?: boolean;
  optionalFollowUpReserveMs?: number;
}>;

function requireFiniteNonNegative(value: number, label: string) {
  if (!Number.isFinite(value) || value < 0) {
    throw new Error(`${label} must be a finite non-negative number.`);
  }
}

export function createRealtimePacingState(input: Readonly<{
  durationSeconds: number;
  startedAtMs: number;
}>): RealtimePacingState {
  if (!Number.isFinite(input.durationSeconds) || input.durationSeconds <= 0) {
    throw new Error("Realtime interview duration must be positive.");
  }
  requireFiniteNonNegative(input.startedAtMs, "Realtime pacing start time");

  return Object.freeze({
    durationMs: input.durationSeconds * 1_000,
    activeElapsedMs: 0,
    infrastructureDowntimeMs: 0,
    lastObservedMs: input.startedAtMs,
    infrastructureDowntimeStartedAtMs: null,
  });
}

function advanceTo(state: RealtimePacingState, nowMs: number): RealtimePacingState {
  requireFiniteNonNegative(nowMs, "Realtime pacing clock sample");

  const monotonicNowMs = Math.max(state.lastObservedMs, nowMs);
  const elapsedMs = monotonicNowMs - state.lastObservedMs;

  if (elapsedMs === 0) {
    return state;
  }

  if (state.infrastructureDowntimeStartedAtMs !== null) {
    return Object.freeze({
      ...state,
      infrastructureDowntimeMs: state.infrastructureDowntimeMs + elapsedMs,
      lastObservedMs: monotonicNowMs,
    });
  }

  return Object.freeze({
    ...state,
    activeElapsedMs: state.activeElapsedMs + elapsedMs,
    lastObservedMs: monotonicNowMs,
  });
}

export function applyRealtimePacingEvent(
  state: RealtimePacingState,
  event: RealtimePacingEvent,
): RealtimePacingState {
  const advanced = advanceTo(state, event.nowMs);

  switch (event.type) {
    case "tick":
      return advanced;
    case "infrastructureDowntimeStarted":
      return advanced.infrastructureDowntimeStartedAtMs === null
        ? Object.freeze({
            ...advanced,
            infrastructureDowntimeStartedAtMs: advanced.lastObservedMs,
          })
        : advanced;
    case "infrastructureDowntimeEnded":
      return advanced.infrastructureDowntimeStartedAtMs !== null
        ? Object.freeze({
            ...advanced,
            infrastructureDowntimeStartedAtMs: null,
          })
        : advanced;
  }
}

export function getRealtimePacingDecision(
  state: RealtimePacingState,
  input: RealtimePacingDecisionInput,
): RealtimePacingDecision {
  const remainingMs = Math.max(0, state.durationMs - state.activeElapsedMs);
  const requiredQuestionsRemaining = Math.max(0, Math.floor(input.requiredQuestionsRemaining));
  const optionalFollowUpAvailable = input.optionalFollowUpAvailable === true;
  const optionalFollowUpReserveMs = Math.max(0, input.optionalFollowUpReserveMs ?? 0);

  if (remainingMs === 0 || (requiredQuestionsRemaining === 0 && !optionalFollowUpAvailable)) {
    return Object.freeze({ remainingMs, action: "complete-gracefully" });
  }

  if (optionalFollowUpAvailable && remainingMs <= optionalFollowUpReserveMs) {
    return Object.freeze({ remainingMs, action: "suppress-optional-follow-up" });
  }

  return Object.freeze({ remainingMs, action: "continue" });
}
