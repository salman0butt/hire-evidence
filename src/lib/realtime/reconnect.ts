import {
  createInterviewPlanState,
  type InterviewPlanInput,
  type InterviewPlanRunnerState,
} from "./plan-runner";

export type RealtimeResumeCheckpoint = Readonly<{
  interviewerVersionId: string;
  sectionIndex: number;
  questionIndex: number;
  followUpsUsed: Readonly<Record<string, number>>;
  processedEventIds: readonly string[];
}>;

const INVALID_CHECKPOINT = "Invalid realtime resume checkpoint.";

function failInvalidCheckpoint(): never {
  throw new Error(INVALID_CHECKPOINT);
}

function isValidIndex(value: number): boolean {
  return Number.isInteger(value) && value >= 0;
}

export function restoreInterviewPlanState(
  plan: InterviewPlanInput,
  checkpoint: RealtimeResumeCheckpoint,
): InterviewPlanRunnerState {
  const initialState = createInterviewPlanState(plan);

  if (
    initialState.status !== "active" ||
    checkpoint.interviewerVersionId !== initialState.plan.versionId ||
    !isValidIndex(checkpoint.sectionIndex) ||
    !isValidIndex(checkpoint.questionIndex)
  ) {
    return failInvalidCheckpoint();
  }

  const section = initialState.plan.sections[checkpoint.sectionIndex];
  const currentQuestion = section?.questions[checkpoint.questionIndex];
  if (!section || !currentQuestion) {
    return failInvalidCheckpoint();
  }

  const questionLimits = new Map<string, number>();
  for (const planSection of initialState.plan.sections) {
    for (const question of planSection.questions) {
      questionLimits.set(question.id, question.followUpLimit);
    }
  }

  const followUpsUsed: Record<string, number> = {};
  for (const [questionId, used] of Object.entries(checkpoint.followUpsUsed)) {
    const limit = questionLimits.get(questionId);
    if (
      limit === undefined ||
      !Number.isInteger(used) ||
      used < 0 ||
      used > limit
    ) {
      return failInvalidCheckpoint();
    }

    followUpsUsed[questionId] = used;
  }

  if (
    checkpoint.processedEventIds.some(
      (eventId) => typeof eventId !== "string" || eventId.trim().length === 0,
    ) ||
    new Set(checkpoint.processedEventIds).size !== checkpoint.processedEventIds.length
  ) {
    return failInvalidCheckpoint();
  }

  return Object.freeze({
    ...initialState,
    sectionIndex: checkpoint.sectionIndex,
    questionIndex: checkpoint.questionIndex,
    followUpsUsed: Object.freeze({ ...followUpsUsed }),
    processedEventIds: Object.freeze([...checkpoint.processedEventIds]),
  });
}