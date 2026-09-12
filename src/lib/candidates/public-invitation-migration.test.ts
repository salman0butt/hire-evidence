import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120014_public_candidate_invitation_resolution.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("public candidate invitation resolution migration", () => {
  it("exposes one narrowly scoped safe public invitation projection", () => {
    const migration = readMigration();

    expect(migration).toMatch(
      /create or replace function public\.resolve_public_candidate_invitation\(\s*p_token_hash text\s*\)/is,
    );
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/candidate_invitations[\s\S]*token_hash\s*=\s*p_token_hash/i);
    expect(migration).toMatch(/organizations[\s\S]*organization_name/i);
    expect(migration).toMatch(/jobs[\s\S]*job_title/i);
  });

  it("fails closed for invitations that are not currently usable", () => {
    const migration = readMigration();

    expect(migration).toMatch(/expires_at\s*>\s*now\(\)/i);
    expect(migration).toMatch(/revoked_at\s+is null/i);
    expect(migration).toMatch(
      /state\s+in\s*\(\s*'sent'\s*,\s*'opened'\s*,\s*'started'\s*\)/i,
    );
  });

  it("grants only the resolver capability to public caller roles", () => {
    const migration = readMigration();
    const returnShape =
      migration.match(/returns table\s*\(([\s\S]*?)\)\s*language/i)?.[1] ?? "";

    expect(migration).toMatch(
      /revoke all on function public\.resolve_public_candidate_invitation\(text\) from public/i,
    );
    expect(migration).toMatch(
      /grant execute on function public\.resolve_public_candidate_invitation\(text\) to anon/i,
    );
    expect(migration).toMatch(
      /grant execute on function public\.resolve_public_candidate_invitation\(text\) to authenticated/i,
    );
    expect(migration).not.toMatch(/grant\s+select\s+on\s+(table\s+)?public\.candidate_invitations\s+to\s+(anon|authenticated)/i);
    expect(returnShape).toMatch(/organization_name\s+text/i);
    expect(returnShape).toMatch(/job_title\s+text/i);
    expect(returnShape).not.toMatch(/\bcandidate_id\b/i);
    expect(returnShape).not.toMatch(/\borganization_id\b/i);
    expect(returnShape).not.toMatch(/\binterviewer_version_id\b/i);
  });
});
