import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120017_realtime_interview_sessions.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("realtime interview session migration", () => {
  it("stores one authoritative invitation-bound attempt without raw capability tokens", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.interview_attempts/i);
    expect(migration).toMatch(/invitation_id uuid not null/i);
    expect(migration).toMatch(/references public\.candidate_invitations\s*\(id\)/i);
    expect(migration).toMatch(/candidate_id uuid not null/i);
    expect(migration).toMatch(/interviewer_version_id uuid not null/i);
    expect(migration).toMatch(/state text not null/i);
    expect(migration).toMatch(/unique\s*\(invitation_id\)/i);
    expect(migration).not.toMatch(/raw_token|invitation_token/i);
    expect(migration).toMatch(/enable row level security/i);
  });

  it("resolves only a capability-bound realtime session projection for server authorization", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.resolve_realtime_candidate_session/i);
    expect(migration).toMatch(/p_token_hash text/i);
    expect(migration).toMatch(/returns table\s*\([\s\S]*invitation_id uuid[\s\S]*candidate_id uuid[\s\S]*interviewer_version_id uuid[\s\S]*duration_seconds integer[\s\S]*language text[\s\S]*lifecycle text[\s\S]*has_current_consent boolean/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/token_hash\s*=\s*p_token_hash/i);
    expect(migration).toMatch(/expires_at\s*>\s*now\(\)/i);
    expect(migration).toMatch(/revoked_at is null/i);
    expect(migration).toMatch(/candidate_consent_events/i);
    expect(migration).toMatch(/candidate-interview-v1/i);
    expect(migration).toMatch(/grant execute on function public\.resolve_realtime_candidate_session/i);
  });

  it("authorizes start through a token-hash-bound security-definer RPC with current consent", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.authorize_realtime_interview_session/i);
    expect(migration).toMatch(/p_token_hash text/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/token_hash\s*=\s*p_token_hash/i);
    expect(migration).toMatch(/expires_at\s*>\s*now\(\)/i);
    expect(migration).toMatch(/revoked_at is null/i);
    expect(migration).toMatch(/candidate_consent_events/i);
    expect(migration).toMatch(/candidate-interview-v1/i);
    expect(migration).toMatch(/interviewer_versions/i);
  });

  it("creates or resumes the same attempt and advances the invitation to started atomically", () => {
    const migration = readMigration();

    expect(migration).toMatch(/state\s+in\s*\(\s*'sent'\s*,\s*'opened'\s*,\s*'started'\s*\)/i);
    expect(migration).toMatch(/on conflict\s*\(invitation_id\)/i);
    expect(migration).toMatch(/state\s*=\s*'started'/i);
    expect(migration).toMatch(/update public\.candidate_invitations/i);
    expect(migration).toMatch(/grant execute on function public\.authorize_realtime_interview_session/i);
  });

  it("returns only the opaque attempt identifier and keeps attempt rows off browser table grants", () => {
    const migration = readMigration();

    expect(migration).toMatch(
      /create or replace function public\.authorize_realtime_interview_session\s*\(\s*p_token_hash text\s*\)\s*returns uuid/is,
    );
    expect(migration).toMatch(/revoke all on table public\.interview_attempts from anon/i);
    expect(migration).toMatch(/revoke all on table public\.interview_attempts from authenticated/i);
    expect(migration).not.toMatch(/grant\s+select\s+on\s+(?:table\s+)?public\.interview_attempts/i);
  });
});
