export type PricingPlan = Readonly<{
  name: string;
  description: string;
  priceLabel: string;
  ctaLabel: string;
  ctaHref: string;
  status: "placeholder";
}>;

export const pricingPlans: readonly PricingPlan[] = [
  {
    name: "Starter",
    description: "A simple starting point for structured interview workflows.",
    priceLabel: "Pricing coming soon",
    ctaLabel: "Create your first interviewer",
    ctaHref: "/auth/signup",
    status: "placeholder",
  },
];
