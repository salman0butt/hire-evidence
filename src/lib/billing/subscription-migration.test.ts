import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/202609220001_create_organization_subscriptions.sql",
  ),
  "utf8",
);

describe("organization subscription persistence migration", () => {
  it("stores one constrained subscription projection per organization", () => {
    expect(migration).toMatch(/create table public\.organization_subscriptions/i);
    expect(migration).toMatch(/organization_id uuid primary key/i);
    expect(migration).toMatch(/references public\.organizations\(id\)/i);
    expect(migration).toMatch(/plan_id text not null/i);
    expect(migration).toMatch(/check\s*\(plan_id in \('starter',\s*'growth'\)\)/i);
    expect(migration).toMatch(/stripe_customer_id text unique/i);
    expect(migration).toMatch(/stripe_subscription_id text unique/i);
  });

  it("constrains synchronized subscription lifecycle state", () => {
    expect(migration).toMatch(/status text not null/i);
    for (const status of [
      "incomplete",
      "trialing",
      "active",
      "past_due",
      "canceled",
      "unpaid",
    ]) {
      expect(migration).toContain(`'${status}'`);
    }
    expect(migration).toMatch(/current_period_start timestamptz/i);
    expect(migration).toMatch(/current_period_end timestamptz/i);
    expect(migration).toMatch(/check\s*\(current_period_end > current_period_start\)/i);
  });

  it("enables tenant RLS and keeps client writes closed", () => {
    expect(migration).toMatch(
      /alter table public\.organization_subscriptions enable row level security/i,
    );
    expect(migration).toMatch(/organization_subscriptions_select_member/i);
    expect(migration).toMatch(/private\.is_organization_member\(organization_id\)/i);
    expect(migration).not.toMatch(
      /grant\s+(?:insert|update|delete).*public\.organization_subscriptions.*authenticated/i,
    );
  });
});
