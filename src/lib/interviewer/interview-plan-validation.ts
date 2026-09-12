export type InterviewPlanSectionInput = Readonly<{
  purpose: string;
  durationSeconds: number;
  position: number;
  questionIds: string[];
  competencyIds: string[];
}>;

export type InterviewPlanInput = Readonly<{
  totalDurationSeconds: number;
  sections: InterviewPlanSectionInput[];
}>;

export type InterviewPlanValidationContext = Readonly<{
  maxTotalDurationSeconds: number;
  allowedQuestionIds: readonly string[];
  allowedCompetencyIds: readonly string[];
  requiredQuestionIds: readonly string[];
  requiredCompetencyIds: readonly string[];
}>;

type InterviewPlanValidationResult =
  | Readonly<{ ok: true; value: InterviewPlanInput }>
  | Readonly<{ ok: false; message: string }>;

function isValidDuration(value: number, maximum: number): boolean {
  return Number.isInteger(value) && value > 0 && value <= maximum;
}

export function validateInterviewPlanInput(
  input: InterviewPlanInput,
  context: InterviewPlanValidationContext,
): InterviewPlanValidationResult {
  if (
    !Number.isInteger(context.maxTotalDurationSeconds) ||
    context.maxTotalDurationSeconds <= 0 ||
    !isValidDuration(
      input.totalDurationSeconds,
      context.maxTotalDurationSeconds,
    ) ||
    input.sections.some(
      (section) =>
        !isValidDuration(section.durationSeconds, context.maxTotalDurationSeconds),
    )
  ) {
    return {
      ok: false,
      message:
        "Interview duration and every section duration must be positive integers within the configured maximum.",
    };
  }

  if (input.sections.some((section, index) => section.position !== index)) {
    return {
      ok: false,
      message: "Interview plan section positions must be contiguous from zero.",
    };
  }

  const allowedQuestionIds = new Set(context.allowedQuestionIds);
  const allowedCompetencyIds = new Set(context.allowedCompetencyIds);

  for (const section of input.sections) {
    if (section.questionIds.some((id) => !allowedQuestionIds.has(id))) {
      return {
        ok: false,
        message: "Interview plan contains a question outside this job.",
      };
    }

    if (section.competencyIds.some((id) => !allowedCompetencyIds.has(id))) {
      return {
        ok: false,
        message: "Interview plan contains a competency outside this job.",
      };
    }
  }

  const sectionDurationTotal = input.sections.reduce(
    (total, section) => total + section.durationSeconds,
    0,
  );
  if (sectionDurationTotal !== input.totalDurationSeconds) {
    return {
      ok: false,
      message: "Interview plan duration must equal the sum of section durations.",
    };
  }

  const plannedQuestionIds = new Set(
    input.sections.flatMap((section) => section.questionIds),
  );
  if (context.requiredQuestionIds.some((id) => !plannedQuestionIds.has(id))) {
    return {
      ok: false,
      message: "Interview plan must cover every required question.",
    };
  }

  const plannedCompetencyIds = new Set(
    input.sections.flatMap((section) => section.competencyIds),
  );
  if (
    context.requiredCompetencyIds.some((id) => !plannedCompetencyIds.has(id))
  ) {
    return {
      ok: false,
      message: "Interview plan must cover every required competency.",
    };
  }

  return {
    ok: true,
    value: {
      totalDurationSeconds: input.totalDurationSeconds,
      sections: input.sections.map((section) => ({
        purpose: section.purpose.trim(),
        durationSeconds: section.durationSeconds,
        position: section.position,
        questionIds: [...section.questionIds],
        competencyIds: [...section.competencyIds],
      })),
    },
  };
}
