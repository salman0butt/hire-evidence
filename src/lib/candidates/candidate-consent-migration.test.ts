import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120015_candidate_invitation_consent.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("candidate invitation consent migration", () => {
  it("stores append-only consent evidence with the required disclosure categories", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.candidate_consent_events/i);
    expect(migration).toMatch(/invitation_id uuid not null/i);
    expect(migration).toMatch(/references public\.candidate_invitations\s*\(id\)/i);
    expect(migration).toMatch(/disclosure_version text not null/i);
    expect(migration).toMatch(/consented_at timestamptz not null default now\(\)/i);
    expect(migration).toMatch(/disclosure_categories text\[\] not null/i);
    expect(migration).toMatch(/'ai_assisted'/i);
    expect(migration).toMatch(/'transcription'/i);
    expect(migration).toMatch(/'data_processing'/i);
    expect(migration).toMatch(/'retention'/i);
    expect(migration).toMatch(/enable row level security/i);
    expect(migration).toMatch(/revoke update, delete on public\.candidate_consent_events from authenticated/i);
  });

  it("records consent only through a narrow token-bound security-definer RPC", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.record_candidate_invitation_consent/i);
    expect(migration).toMatch(/p_token_hash text/i);
    expect(migration).toMatch(/p_disclosure_version text/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/token_hash\s*=\s*p_token_hash/i);
    expect(migration).toMatch(/expires_at\s*>\s*now\(\)/i);
    expect(migration).toMatch(/revoked_at is null/i);
    expect(migration).toMatch(/state\s+in\s*\(\s*'sent'\s*,\s*'opened'\s*\)/i);
    expect(migration).toMatch(/grant execute on function public\.record_candidate_invitation_consent/i);
  });

  it("accepts only the current disclosure version and blocks start until it was consented", () => {
    const migration = readMigration();

    expect(migration).toMatch(/candidate-interview-v1/i);
    expect(migration).toMatch(/p_disclosure_version\s*<>\s*'candidate-interview-v1'/i);
    expect(migration).toMatch(/create or replace function public\.transition_candidate_invitation/i);
    expect(migration).toMatch(/target_state\s*=\s*'started'/i);
    expect(migration).toMatch(/from public\.candidate_consent_events/i);
    expect(migration).toMatch(/consent\.invitation_id\s*=\s*invitation\.id/i);
    expect(migration).toMatch(/consent\.disclosure_version\s*=\s*'candidate-interview-v1'/i);
    expect(migration).toMatch(/current disclosure consent required/i);
  });
});