import type { BillingPlanId } from "@/config/billing-plans";

import { projectBillingUsagePeriod } from "./usage-meter";

export interface InterviewEntitlementInput {
  readonly organizationId: string;
  readonly planId: BillingPlanId;
  readonly subscriptionStatus: string;
  readonly consumedInterviewSeconds: number;
  readonly periodStartsAt: string;
  readonly periodEndsAt: string;
}

export interface InterviewEntitlement {
  readonly organizationId: string;
  readonly planId: BillingPlanId;
  readonly remainingInterviewSeconds: number;
  readonly periodStartsAt: string;
  readonly periodEndsAt: string;
}

export function assertInterviewEntitlement(
  input: InterviewEntitlementInput,
): InterviewEntitlement {
  if (input.subscriptionStatus !== "active") {
    throw new Error("Interview entitlement unavailable");
  }

  const usage = projectBillingUsagePeriod({
    planId: input.planId,
    consumedInterviewSeconds: input.consumedInterviewSeconds,
    periodStartsAt: input.periodStartsAt,
    periodEndsAt: input.periodEndsAt,
  });

  if (usage.exhausted) {
    throw new Error("Interview entitlement exhausted");
  }

  return {
    organizationId: input.organizationId,
    planId: input.planId,
    remainingInterviewSeconds: usage.remainingInterviewSeconds,
    periodStartsAt: usage.periodStartsAt,
    periodEndsAt: usage.periodEndsAt,
  };
}
