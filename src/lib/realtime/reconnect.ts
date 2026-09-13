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

  const questionLimits = new Map<
    string,
    Readonly<{ limit: number; sectionIndex: number; questionIndex: number }>
  >();
  initialState.plan.sections.forEach((planSection, sectionIndex) => {
    planSection.questions.forEach((question, questionIndex) => {
      questionLimits.set(
        question.id,
        Object.freeze({
          limit: question.followUpLimit,
          sectionIndex,
          questionIndex,
        }),
      );
    });
  });

  const followUpsUsed: Record<string, number> = {};
  for (const [questionId, used] of Object.entries(checkpoint.followUpsUsed)) {
    const questionPosition = questionLimits.get(questionId);
    const isFutureQuestion =
      questionPosition !== undefined &&
      (questionPosition.sectionIndex > checkpoint.sectionIndex ||
        (questionPosition.sectionIndex === checkpoint.sectionIndex &&
          questionPosition.questionIndex > checkpoint.questionIndex));

    if (
      questionPosition === undefined ||
      isFutureQuestion ||
      !Number.isInteger(used) ||
      used < 0 ||
      used > questionPosition.limit
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