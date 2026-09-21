export type BillingPlanId = "starter" | "growth";

export interface BillingPlan {
  readonly id: BillingPlanId;
  readonly name: string;
  readonly monthlyInterviewSeconds: number;
}

export const billingPlans: readonly BillingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyInterviewSeconds: 3_600,
  },
  {
    id: "growth",
    name: "Growth",
    monthlyInterviewSeconds: 18_000,
  },
];

export function getBillingPlan(id: string): BillingPlan {
  const plan = billingPlans.find((candidate) => candidate.id === id);

  if (!plan) {
    throw new Error(`Unknown billing plan: ${id}`);
  }

  return plan;
}
