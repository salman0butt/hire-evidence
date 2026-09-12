import type { RealtimeAudioPlayback } from "./audio-playback";
import {
  applyInterviewPlanEvent,
  createInterviewPlanState,
  getCurrentInterviewQuestion,
  type InterviewPlanInput,
  type InterviewPlanRunnerState,
} from "./plan-runner";
import type { RealtimeTransportEvent } from "./transport";

export type RealtimeInterviewSessionSnapshot = Readonly<{
  status: "active" | "completed";
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
  advanceGeneration(): number;
}>;

function toSnapshot(
  state: InterviewPlanRunnerState,
  generation: number,
): RealtimeInterviewSessionSnapshot {
  const current = getCurrentInterviewQuestion(state);

  return Object.freeze({
    status: state.status,
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
  onSnapshot?: ((snapshot: RealtimeInterviewSessionSnapshot) => void) | undefined;
}>): RealtimeInterviewSession {
  let planState = createInterviewPlanState(input.plan);
  let generation = 1;

  function getSnapshot() {
    return toSnapshot(planState, generation);
  }

  function publishSnapshot() {
    input.onSnapshot?.(getSnapshot());
  }

  function handleTransportEvent(event: RealtimeTransportEvent, eventGeneration = generation) {
    if (eventGeneration !== generation || planState.status !== "active") {
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
    if (eventGeneration !== generation) {
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

  function advanceGeneration() {
    generation += 1;
    publishSnapshot();
    return generation;
  }

  return Object.freeze({
    getSnapshot,
    handleTransportEvent,
    completeCurrentQuestion,
    advanceGeneration,
  });
}
