import type { RealtimeAudioPlayback } from "./audio-playback";
import {
  applyInterviewPlanEvent,
  createInterviewPlanState,
  getCurrentInterviewQuestion,
  type InterviewPlanInput,
  type InterviewPlanRunnerState,
} from "./plan-runner";
import {
  decideRealtimeRecovery,
  type RealtimeRecoveryDecision,
  type RealtimeTechnicalFailure,
} from "./recovery";
import {
  restoreInterviewPlanState,
  type RealtimeResumeCheckpoint,
} from "./reconnect";
import type { RealtimeTransportEvent } from "./transport";

export type RealtimeInterviewSessionSnapshot = Readonly<{
  status: "active" | "completed" | "ended";
  generation: number;
  currentQuestion: Readonly<{
    sectionId: string;
    sectionTitle: string;
    questionId: string;
    prompt: string;
  }> | null;
}>;

export type RealtimeInterviewSession = Readonly<{
  getSnapshot(): RealtimeInterviewSessionSnapshot;
  handleTransportEvent(event: RealtimeTransportEvent, generation?: number): void;
  completeCurrentQuestion(eventId: string, generation?: number): void;
  handleTechnicalFailure(
    failure: RealtimeTechnicalFailure,
    retryCount: number,
    maxRetries: number,
    generation?: number,
  ): RealtimeRecoveryDecision | null;
  advanceGeneration(): number;
}>;

function toSnapshot(
  state: InterviewPlanRunnerState,
  generation: number,
  ended: boolean,
): RealtimeInterviewSessionSnapshot {
  const current = getCurrentInterviewQuestion(state);

  return Object.freeze({
    status: ended ? "ended" : state.status,
    generation,
    currentQuestion: current
      ? Object.freeze({
          sectionId: current.sectionId,
          sectionTitle: current.sectionTitle,
          questionId: current.questionId,
          prompt: current.prompt,
        })
      : null,
  });
}

export function createRealtimeInterviewSession(input: Readonly<{
  plan: InterviewPlanInput;
  playback: RealtimeAudioPlayback;
  resumeCheckpoint?: RealtimeResumeCheckpoint | undefined;
  onSnapshot?: ((snapshot: RealtimeInterviewSessionSnapshot) => void) | undefined;
}>): RealtimeInterviewSession {
  let planState = input.resumeCheckpoint
    ? restoreInterviewPlanState(input.plan, input.resumeCheckpoint)
    : createInterviewPlanState(input.plan);
  let generation = 1;
  let ended = false;

  function getSnapshot() {
    return toSnapshot(planState, generation, ended);
  }

  function publishSnapshot() {
    input.onSnapshot?.(getSnapshot());
  }

  function handleTransportEvent(event: RealtimeTransportEvent, eventGeneration = generation) {
    if (eventGeneration !== generation || planState.status !== "active" || ended) {
      return;
    }

    switch (event.type) {
      case "audio":
        input.playback.enqueue(event.pcm, event.sampleRate);
        return;
      case "candidateSpeechStart":
        input.playback.interrupt();
        return;
      default:
        return;
    }
  }

  function completeCurrentQuestion(eventId: string, eventGeneration = generation) {
    if (eventGeneration !== generation || ended) {
      return;
    }

    const current = getCurrentInterviewQuestion(planState);
    if (!current || !eventId) {
      return;
    }

    const next = applyInterviewPlanEvent(planState, {
      type: "questionCompleted",
      eventId,
      questionId: current.questionId,
    });

    if (next === planState) {
      return;
    }

    planState = next;
    publishSnapshot();
  }

  function handleTechnicalFailure(
    failure: RealtimeTechnicalFailure,
    retryCount: number,
    maxRetries: number,
    eventGeneration = generation,
  ): RealtimeRecoveryDecision | null {
    if (eventGeneration !== generation || planState.status !== "active" || ended) {
      return null;
    }

    const decision = decideRealtimeRecovery({
      failure,
      retryCount,
      maxRetries,
      attemptStatus: "active",
    });

    if (decision.action === "end-safe") {
      ended = true;
      void input.playback.stop();
      publishSnapshot();
      return decision;
    }

    generation += 1;
    publishSnapshot();
    return decision;
  }

  function advanceGeneration() {
    if (ended) {
      return generation;
    }

    generation += 1;
    publishSnapshot();
    return generation;
  }

  return Object.freeze({
    getSnapshot,
    handleTransportEvent,
    completeCurrentQuestion,
    handleTechnicalFailure,
    advanceGeneration,
  });
}