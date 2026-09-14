import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609140001_interview_transcript_messages.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("interview transcript migration", () => {
  it("stores immutable finalized turns with attempt-scoped sequence and idempotency identity", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.interview_transcript_messages/i);
    expect(migration).toMatch(/attempt_id uuid not null/i);
    expect(migration).toMatch(/references public\.interview_attempts\s*\(id\)/i);
    expect(migration).toMatch(/event_id text not null/i);
    expect(migration).toMatch(/sequence integer not null/i);
    expect(migration).toMatch(/speaker text not null/i);
    expect(migration).toMatch(/text text not null/i);
    expect(migration).toMatch(/check\s*\(speaker in \('candidate', 'interviewer'\)\)/i);
    expect(migration).toMatch(/check\s*\(sequence > 0\)/i);
    expect(migration).toMatch(/check\s*\(btrim\(text\) <> ''\)/i);
    expect(migration).toMatch(/unique\s*\(attempt_id, sequence\)/i);
    expect(migration).toMatch(/unique\s*\(attempt_id, event_id\)/i);
    expect(migration).toMatch(/enable row level security/i);
  });

  it("keeps transcript rows off direct browser grants", () => {
    const migration = readMigration();

    expect(migration).toMatch(/revoke all on table public\.interview_transcript_messages from anon/i);
    expect(migration).toMatch(/revoke all on table public\.interview_transcript_messages from authenticated/i);
    expect(migration).not.toMatch(
      /grant\s+(?:select|insert|update|delete|all)\s+on\s+(?:table\s+)?public\.interview_transcript_messages/i,
    );
  });

  it("appends only to the capability-bound active attempt and assigns sequence server-side", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.append_realtime_interview_transcript_turn/i);
    expect(migration).toMatch(/p_token_hash text/i);
    expect(migration).toMatch(/p_attempt_id uuid/i);
    expect(migration).toMatch(/p_event_id text/i);
    expect(migration).toMatch(/p_speaker text/i);
    expect(migration).toMatch(/p_text text/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/candidate_invitation\.token_hash\s*=\s*p_token_hash/i);
    expect(migration).toMatch(/candidate_invitation\.expires_at\s*>\s*now\(\)/i);
    expect(migration).toMatch(/candidate_invitation\.revoked_at is null/i);
    expect(migration).toMatch(/candidate_invitation\.state\s*=\s*'started'/i);
    expect(migration).toMatch(/attempt\.state\s*=\s*'active'/i);
    expect(migration).toMatch(/for update of attempt/i);
    expect(migration).toMatch(/coalesce\(max\(message\.sequence\), 0\) \+ 1/i);
    expect(migration).toMatch(/on conflict\s*\(attempt_id, event_id\)\s*do nothing/i);
    expect(migration).toMatch(/grant execute on function public\.append_realtime_interview_transcript_turn/i);
  });

  it("lists only finalized turns from the same capability-bound attempt in authoritative order", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.list_realtime_interview_transcript/i);
    expect(migration).toMatch(/p_token_hash text/i);
    expect(migration).toMatch(/p_attempt_id uuid/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/candidate_invitation\.token_hash\s*=\s*p_token_hash/i);
    expect(migration).toMatch(/candidate_invitation\.expires_at\s*>\s*now\(\)/i);
    expect(migration).toMatch(/candidate_invitation\.revoked_at is null/i);
    expect(migration).toMatch(/message\.attempt_id\s*=\s*p_attempt_id/i);
    expect(migration).toMatch(/order by message\.sequence/i);
    expect(migration).toMatch(/grant execute on function public\.list_realtime_interview_transcript/i);
  });
});
