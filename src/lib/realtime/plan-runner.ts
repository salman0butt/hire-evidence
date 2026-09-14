export type InterviewPlanQuestion = Readonly<{
  id: string;
  prompt: string;
  required: boolean;
  followUpLimit: number;
}>;

export type InterviewPlanSection = Readonly<{
  id: string;
  title: string;
  questions: readonly InterviewPlanQuestion[];
}>;

export type InterviewPlan = Readonly<{
  versionId: string;
  sections: readonly InterviewPlanSection[];
}>;

export type InterviewPlanInput = Readonly<{
  versionId: string;
  sections: readonly Readonly<{
    id: string;
    title: string;
    questions: readonly Readonly<{
      id: string;
      prompt: string;
      required: boolean;
      followUpLimit: number;
    }>[];
  }>[];
}>;

export type InterviewPlanRunnerState = Readonly<{
  plan: InterviewPlan;
  sectionIndex: number;
  questionIndex: number;
  followUpsUsed: Readonly<Record<string, number>>;
  processedEventIds: readonly string[];
  status: "active" | "completed";
}>;

export type InterviewPlanEvent =
  | Readonly<{
      type: "questionCompleted";
      eventId: string;
      questionId: string;
    }>
  | Readonly<{
      type: "followUpConsumed";
      eventId: string;
      questionId: string;
    }>;

export type CurrentInterviewQuestion = Readonly<{
  sectionId: string;
  sectionTitle: string;
  questionId: string;
  prompt: string;
  required: boolean;
  followUpLimit: number;
  remainingFollowUps: number;
}>;

function snapshotPlan(input: InterviewPlanInput): InterviewPlan {
  const sections = input.sections.map((section) =>
    Object.freeze({
      id: section.id,
      title: section.title,
      questions: Object.freeze(
        section.questions.map((question) =>
          Object.freeze({
            id: question.id,
            prompt: question.prompt,
            required: question.required,
            followUpLimit: Math.max(0, Math.floor(question.followUpLimit)),
          }),
        ),
      ),
    }),
  );

  return Object.freeze({
    versionId: input.versionId,
    sections: Object.freeze(sections),
  });
}

function findFirstQuestion(plan: InterviewPlan): Readonly<{
  sectionIndex: number;
  questionIndex: number;
}> | null {
  for (let sectionIndex = 0; sectionIndex < plan.sections.length; sectionIndex += 1) {
    const section = plan.sections[sectionIndex];
    if (section && section.questions.length > 0) {
      return { sectionIndex, questionIndex: 0 };
    }
  }

  return null;
}

function findNextQuestion(
  state: InterviewPlanRunnerState,
): Readonly<{ sectionIndex: number; questionIndex: number }> | null {
  const currentSection = state.plan.sections[state.sectionIndex];
  if (currentSection && state.questionIndex + 1 < currentSection.questions.length) {
    return {
      sectionIndex: state.sectionIndex,
      questionIndex: state.questionIndex + 1,
    };
  }

  for (
    let sectionIndex = state.sectionIndex + 1;
    sectionIndex < state.plan.sections.length;
    sectionIndex += 1
  ) {
    const section = state.plan.sections[sectionIndex];
    if (section && section.questions.length > 0) {
      return { sectionIndex, questionIndex: 0 };
    }
  }

  return null;
}

export function createInterviewPlanState(
  input: InterviewPlanInput,
): InterviewPlanRunnerState {
  const plan = snapshotPlan(input);
  const first = findFirstQuestion(plan);

  if (!first) {
    return Object.freeze({
      plan,
      sectionIndex: 0,
      questionIndex: 0,
      followUpsUsed: Object.freeze({}),
      processedEventIds: Object.freeze([]),
      status: "completed",
    });
  }

  return Object.freeze({
    plan,
    sectionIndex: first.sectionIndex,
    questionIndex: first.questionIndex,
    followUpsUsed: Object.freeze({}),
    processedEventIds: Object.freeze([]),
    status: "active",
  });
}

export function getCurrentInterviewQuestion(
  state: InterviewPlanRunnerState,
): CurrentInterviewQuestion | null {
  if (state.status !== "active") return null;

  const section = state.plan.sections[state.sectionIndex];
  const question = section?.questions[state.questionIndex];
  if (!section || !question) return null;

  const used = state.followUpsUsed[question.id] ?? 0;

  return Object.freeze({
    sectionId: section.id,
    sectionTitle: section.title,
    questionId: question.id,
    prompt: question.prompt,
    required: question.required,
    followUpLimit: question.followUpLimit,
    remainingFollowUps: Math.max(0, question.followUpLimit - used),
  });
}

export function isInterviewQuestionAllowed(
  state: InterviewPlanRunnerState,
  questionId: string,
): boolean {
  return getCurrentInterviewQuestion(state)?.questionId === questionId;
}

export function applyInterviewPlanEvent(
  state: InterviewPlanRunnerState,
  event: InterviewPlanEvent,
): InterviewPlanRunnerState {
  if (state.status !== "active") return state;
  if (!event.eventId || state.processedEventIds.includes(event.eventId)) return state;

  const current = getCurrentInterviewQuestion(state);
  if (!current || current.questionId !== event.questionId) return state;

  if (event.type === "followUpConsumed") {
    const used = state.followUpsUsed[event.questionId] ?? 0;
    if (used >= current.followUpLimit) return state;

    return Object.freeze({
      ...state,
      followUpsUsed: Object.freeze({
        ...state.followUpsUsed,
        [event.questionId]: used + 1,
      }),
      processedEventIds: Object.freeze([...state.processedEventIds, event.eventId]),
    });
  }

  const next = findNextQuestion(state);
  if (!next) {
    return Object.freeze({
      ...state,
      processedEventIds: Object.freeze([...state.processedEventIds, event.eventId]),
      status: "completed",
    });
  }

  return Object.freeze({
    ...state,
    sectionIndex: next.sectionIndex,
    questionIndex: next.questionIndex,
    processedEventIds: Object.freeze([...state.processedEventIds, event.eventId]),
  });
}
