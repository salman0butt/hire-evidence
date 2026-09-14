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
import type { RealtimeAttemptProgressResult } from "./session-repository";
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
  completeCurrentQuestion(eventId: string, generation?: number): Promise<void>;
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

function toResumeCheckpoint(state: InterviewPlanRunnerState): RealtimeResumeCheckpoint {
  return Object.freeze({
    interviewerVersionId: state.plan.versionId,
    sectionIndex: state.sectionIndex,
    questionIndex: state.questionIndex,
    followUpsUsed: Object.freeze({ ...state.followUpsUsed }),
    processedEventIds: Object.freeze([...state.processedEventIds]),
  });
}

export function createRealtimeInterviewSession(input: Readonly<{
  plan: InterviewPlanInput;
  playback: RealtimeAudioPlayback;
  resumeCheckpoint?: RealtimeResumeCheckpoint | undefined;
  persistProgress?:
    | ((input: Readonly<{ eventId: string; questionId: string }>) => Promise<RealtimeAttemptProgressResult>)
    | undefined;
  onSnapshot?: ((snapshot: RealtimeInterviewSessionSnapshot) => void) | undefined;
  onResumeCheckpoint?: ((checkpoint: RealtimeResumeCheckpoint) => void) | undefined;
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
      case "interrupted":
        input.playback.interrupt();
        return;
      default:
        return;
    }
  }

  async function completeCurrentQuestion(eventId: string, eventGeneration = generation) {
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

    if (input.persistProgress) {
      let persisted: RealtimeAttemptProgressResult;
      try {
        persisted = await input.persistProgress({
          eventId,
          questionId: current.questionId,
        });
      } catch {
        return;
      }

      if (
        eventGeneration !== generation ||
        ended ||
        getCurrentInterviewQuestion(planState)?.questionId !== current.questionId
      ) {
        return;
      }

      if (persisted.status === "conflict") {
        return;
      }

      if (persisted.status === "active") {
        let restoredState: InterviewPlanRunnerState;
        try {
          restoredState = restoreInterviewPlanState(input.plan, persisted.checkpoint);
        } catch {
          return;
        }

        planState = restoredState;
        input.onResumeCheckpoint?.(persisted.checkpoint);
      } else {
        if (next.status !== "completed") {
          return;
        }
        planState = next;
      }

      publishSnapshot();
      return;
    }

    planState = next;
    if (planState.status === "active") {
      input.onResumeCheckpoint?.(toResumeCheckpoint(planState));
    }
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
