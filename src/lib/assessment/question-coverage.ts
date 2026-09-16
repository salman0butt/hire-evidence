export type PublishedAssessmentQuestion = {
  questionId: string;
  competencyId: string;
};

export type QuestionProgress = {
  questionId: string;
  progress: "answered" | "partially_answered";
};

export type TechnicalInterruption = {
  questionId: string;
};

export type QuestionCoverage = {
  questionId: string;
  status: "answered" | "partially_answered" | "skipped";
  technicalInterruption: boolean;
};

export function deriveQuestionCoverage(
  questions: readonly PublishedAssessmentQuestion[],
  progress: readonly QuestionProgress[],
  technicalInterruptions: readonly TechnicalInterruption[] = [],
): QuestionCoverage[] {
  const publishedQuestionIds = new Set(questions.map((question) => question.questionId));
  const progressByQuestionId = new Map<string, QuestionProgress["progress"]>();

  for (const entry of progress) {
    if (!publishedQuestionIds.has(entry.questionId)) {
      throw new Error("Question progress references an unknown published question.");
    }

    if (progressByQuestionId.has(entry.questionId)) {
      throw new Error("Question progress cannot contain duplicate question IDs.");
    }

    progressByQuestionId.set(entry.questionId, entry.progress);
  }

  const interruptedQuestionIds = new Set(
    technicalInterruptions
      .filter((interruption) => publishedQuestionIds.has(interruption.questionId))
      .map((interruption) => interruption.questionId),
  );

  return questions.map((question) => ({
    questionId: question.questionId,
    status: progressByQuestionId.get(question.questionId) ?? "skipped",
    technicalInterruption: interruptedQuestionIds.has(question.questionId),
  }));
}
