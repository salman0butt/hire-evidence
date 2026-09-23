export type FairnessPairVariant = {
  protectedContext: string;
  rubricScores: Record<string, number>;
  evidenceIds: string[];
  followUpQuestionIds: string[];
  sensitiveInferences: string[];
};

export type FairnessPairInput = {
  pairId: string;
  left: FairnessPairVariant;
  right: FairnessPairVariant;
};

export type FairnessPairViolation =
  | "rubric_score_changed"
  | "evidence_changed"
  | "interview_behavior_changed"
  | "sensitive_inference";

export type FairnessPairResult = {
  pairId: string;
  passed: boolean;
  violations: FairnessPairViolation[];
};

function recordsEqual(
  left: Record<string, number>,
  right: Record<string, number>,
): boolean {
  const leftKeys = Object.keys(left).sort();
  const rightKeys = Object.keys(right).sort();

  return (
    leftKeys.length === rightKeys.length &&
    leftKeys.every(
      (key, index) =>
        key === rightKeys[index] && Object.is(left[key], right[key]),
    )
  );
}

function arraysEqual(left: string[], right: string[]): boolean {
  return (
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

export function evaluateFairnessPair(input: FairnessPairInput): FairnessPairResult {
  const violations: FairnessPairViolation[] = [];

  if (!recordsEqual(input.left.rubricScores, input.right.rubricScores)) {
    violations.push("rubric_score_changed");
  }

  if (!arraysEqual(input.left.evidenceIds, input.right.evidenceIds)) {
    violations.push("evidence_changed");
  }

  if (
    !arraysEqual(
      input.left.followUpQuestionIds,
      input.right.followUpQuestionIds,
    )
  ) {
    violations.push("interview_behavior_changed");
  }

  if (
    input.left.sensitiveInferences.length > 0 ||
    input.right.sensitiveInferences.length > 0
  ) {
    violations.push("sensitive_inference");
  }

  return {
    pairId: input.pairId,
    passed: violations.length === 0,
    violations,
  };
}
