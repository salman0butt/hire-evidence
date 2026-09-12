import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120013_candidate_invitation_lifecycle.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("candidate invitation lifecycle migration", () => {
  it("defines the monotonic invitation lifecycle and transition timestamps", () => {
    const migration = readMigration();

    expect(migration).toMatch(
      /create type public\.candidate_invitation_state as enum\s*\(\s*'draft'\s*,\s*'sent'\s*,\s*'opened'\s*,\s*'started'\s*,\s*'completed'\s*\)/is,
    );
    expect(migration).toMatch(/state public\.candidate_invitation_state not null default 'draft'/i);
    expect(migration).toMatch(/sent_at timestamptz/i);
    expect(migration).toMatch(/opened_at timestamptz/i);
    expect(migration).toMatch(/started_at timestamptz/i);
    expect(migration).toMatch(/completed_at timestamptz/i);
  });

  it("uses an authoritative transition RPC and rejects non-monotonic or terminal transitions", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.transition_candidate_invitation/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/expires_at\s*<=\s*now\(\)/i);
    expect(migration).toMatch(/revoked_at\s+is not null/i);
    expect(migration).toMatch(/state\s*=\s*'completed'/i);
    expect(migration).toMatch(/draft[\s\S]*sent[\s\S]*opened[\s\S]*started[\s\S]*completed/i);
    expect(migration).toMatch(/invalid invitation transition/i);
  });

  it("keeps direct lifecycle mutation away from browser roles", () => {
    const migration = readMigration();

    expect(migration).toMatch(/revoke update on public\.candidate_invitations from authenticated/i);
    expect(migration).toMatch(/grant execute on function public\.transition_candidate_invitation/i);
  });
});
