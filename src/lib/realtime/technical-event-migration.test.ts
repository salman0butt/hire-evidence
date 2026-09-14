import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609140002_interview_technical_events.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("interview technical event migration", () => {
  it("stores attempt-scoped non-evaluative technical interruptions separately from transcript evidence", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.interview_technical_events/i);
    expect(migration).toMatch(/attempt_id uuid not null/i);
    expect(migration).toMatch(/references public\.interview_attempts\s*\(id\)/i);
    expect(migration).toMatch(/category text not null/i);
    expect(migration).toMatch(/occurred_at timestamptz not null/i);
    expect(migration).toMatch(
      /check\s*\(category in \('provider_disconnect', 'browser_disconnect', 'microphone_failure', 'reconnect_failure'\)\)/i,
    );
    expect(migration).toMatch(/enable row level security/i);
    expect(migration).not.toMatch(/\bscore\b/i);
    expect(migration).not.toMatch(/\bevidence\b/i);
    expect(migration).not.toMatch(/\btranscript\b/i);
  });

  it("keeps technical events off direct browser table grants", () => {
    const migration = readMigration();

    expect(migration).toMatch(/revoke all on table public\.interview_technical_events from anon/i);
    expect(migration).toMatch(/revoke all on table public\.interview_technical_events from authenticated/i);
    expect(migration).not.toMatch(
      /grant\s+(?:select|insert|update|delete|all)\s+on\s+(?:table\s+)?public\.interview_technical_events/i,
    );
  });

  it("records only through the capability-bound authoritative active attempt", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.record_realtime_interview_technical_event/i);
    expect(migration).toMatch(/p_token_hash text/i);
    expect(migration).toMatch(/p_attempt_id uuid/i);
    expect(migration).toMatch(/p_category text/i);
    expect(migration).toMatch(/p_occurred_at timestamptz/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/candidate_invitation\.token_hash\s*=\s*p_token_hash/i);
    expect(migration).toMatch(/candidate_invitation\.expires_at\s*>\s*now\(\)/i);
    expect(migration).toMatch(/candidate_invitation\.revoked_at is null/i);
    expect(migration).toMatch(/candidate_invitation\.state\s*=\s*'started'/i);
    expect(migration).toMatch(/attempt\.state\s*=\s*'active'/i);
    expect(migration).toMatch(/grant execute on function public\.record_realtime_interview_technical_event/i);
  });
});
