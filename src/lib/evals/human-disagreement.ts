export type HumanDisagreementRecord = {
  criterionId: string;
  aiOutcome: string;
  humanOutcome: string;
  reason?: string;
};

export type HumanDisagreementAnalytics = {
  totalReviews: number;
  disagreements: number;
  disagreementRate: number;
  byCriterion: Record<string, { reviews: number; disagreements: number }>;
  byReason: Record<string, number>;
};

const allowedKeys = new Set(["criterionId", "aiOutcome", "humanOutcome", "reason"]);

function requireNonEmptyString(value: unknown, label: string): asserts value is string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`${label} must be a non-empty string`);
  }
}

export function aggregateHumanDisagreement(
  records: readonly HumanDisagreementRecord[],
): HumanDisagreementAnalytics {
  const byCriterion = new Map<string, { reviews: number; disagreements: number }>();
  const byReason = new Map<string, number>();
  let disagreements = 0;

  for (const record of records) {
    const unsupportedKeys = Object.keys(record).filter((key) => !allowedKeys.has(key));
    if (unsupportedKeys.length > 0) {
      throw new Error(`Unsupported or candidate-identifying analytics field: ${unsupportedKeys.join(", ")}`);
    }

    requireNonEmptyString(record.criterionId, "criterionId");
    requireNonEmptyString(record.aiOutcome, "aiOutcome");
    requireNonEmptyString(record.humanOutcome, "humanOutcome");
    if (record.reason !== undefined) {
      requireNonEmptyString(record.reason, "reason");
    }

    const disagrees = record.aiOutcome !== record.humanOutcome;
    if (disagrees) disagreements += 1;

    const criterion = byCriterion.get(record.criterionId) ?? { reviews: 0, disagreements: 0 };
    criterion.reviews += 1;
    if (disagrees) criterion.disagreements += 1;
    byCriterion.set(record.criterionId, criterion);

    if (disagrees && record.reason !== undefined) {
      byReason.set(record.reason, (byReason.get(record.reason) ?? 0) + 1);
    }
  }

  return {
    totalReviews: records.length,
    disagreements,
    disagreementRate: records.length === 0 ? 0 : disagreements / records.length,
    byCriterion: Object.fromEntries([...byCriterion.entries()].sort(([a], [b]) => a.localeCompare(b))),
    byReason: Object.fromEntries([...byReason.entries()].sort(([a], [b]) => a.localeCompare(b))),
  };
}
