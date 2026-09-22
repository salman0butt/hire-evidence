import { getBillingPlan, type BillingPlanId } from "@/config/billing-plans";

export interface BillingUsagePeriodInput {
  readonly planId: BillingPlanId;
  readonly consumedInterviewSeconds: number;
  readonly periodStartsAt: string;
  readonly periodEndsAt: string;
}

export interface BillingUsagePeriod {
  readonly allowanceInterviewSeconds: number;
  readonly consumedInterviewSeconds: number;
  readonly remainingInterviewSeconds: number;
  readonly periodStartsAt: string;
  readonly periodEndsAt: string;
  readonly exhausted: boolean;
}

export function projectBillingUsagePeriod(
  input: BillingUsagePeriodInput,
): BillingUsagePeriod {
  const startsAt = Date.parse(input.periodStartsAt);
  const endsAt = Date.parse(input.periodEndsAt);

  if (
    !Number.isSafeInteger(input.consumedInterviewSeconds) ||
    input.consumedInterviewSeconds < 0 ||
    !Number.isFinite(startsAt) ||
    !Number.isFinite(endsAt) ||
    startsAt >= endsAt
  ) {
    throw new Error("Invalid billing usage period");
  }

  const allowanceInterviewSeconds = getBillingPlan(
    input.planId,
  ).monthlyInterviewSeconds;
  const remainingInterviewSeconds = Math.max(
    0,
    allowanceInterviewSeconds - input.consumedInterviewSeconds,
  );

  return {
    allowanceInterviewSeconds,
    consumedInterviewSeconds: input.consumedInterviewSeconds,
    remainingInterviewSeconds,
    periodStartsAt: input.periodStartsAt,
    periodEndsAt: input.periodEndsAt,
    exhausted: input.consumedInterviewSeconds >= allowanceInterviewSeconds,
  };
}
