import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609140003_interview_session_finalization.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("interview session finalization migration", () => {
  it("stores authoritative completion metadata and one assessment trigger per attempt", () => {
    const migration = readMigration();

    expect(migration).toMatch(/alter table public\.interview_attempts/i);
    expect(migration).toMatch(/completed_at timestamptz/i);
    expect(migration).toMatch(/duration_seconds integer/i);
    expect(migration).toMatch(/create table public\.interview_assessment_triggers/i);
    expect(migration).toMatch(/attempt_id uuid (?:primary key|not null unique)/i);
    expect(migration).toMatch(/references public\.interview_attempts\s*\(id\)/i);
    expect(migration).toMatch(/enable row level security/i);
    expect(migration).toMatch(/revoke all on table public\.interview_assessment_triggers from anon/i);
    expect(migration).toMatch(/revoke all on table public\.interview_assessment_triggers from authenticated/i);
  });

  it("finalizes only the capability-bound authoritative attempt and returns retry-stable metadata", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.finalize_realtime_interview_session/i);
    expect(migration).toMatch(/p_token_hash text/i);
    expect(migration).toMatch(/p_attempt_id uuid/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/candidate_invitation\.token_hash\s*=\s*p_token_hash/i);
    expect(migration).toMatch(/candidate_invitation\.expires_at\s*>\s*now\(\)/i);
    expect(migration).toMatch(/candidate_invitation\.revoked_at is null/i);
    expect(migration).toMatch(/candidate_invitation\.state\s*=\s*'started'/i);
    expect(migration).toMatch(/for update of interview_attempt/i);
    expect(migration).toMatch(/completed_at\s*=\s*coalesce\(interview_attempt\.completed_at/i);
    expect(migration).toMatch(/duration_seconds\s*=\s*coalesce\(\s*interview_attempt\.duration_seconds/i);
    expect(migration).toMatch(/on conflict \(attempt_id\) do nothing/i);
    expect(migration).toMatch(/grant execute on function public\.finalize_realtime_interview_session/i);
  });
});
