import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120016_candidate_support_settings.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("candidate support settings migration", () => {
  it("adds bounded tenant-configured candidate support fields to organizations", () => {
    const migration = readMigration();

    expect(migration).toMatch(/alter table public\.organizations[\s\S]*candidate_support_email\s+text/i);
    expect(migration).toMatch(/alter table public\.organizations[\s\S]*candidate_support_url\s+text/i);
    expect(migration).toMatch(/char_length\(candidate_support_email\)\s*<=\s*254/i);
    expect(migration).toMatch(/char_length\(candidate_support_url\)\s*<=\s*2048/i);
  });

  it("keeps support settings writable only through the existing trusted owner-admin boundary", () => {
    const migration = readMigration();

    expect(migration).toMatch(
      /grant update\s*\([^)]*candidate_support_email[^)]*candidate_support_url[^)]*\)[\s\S]*on table public\.organizations\s+to authenticated/i,
    );
    expect(migration).not.toMatch(/grant\s+update[\s\S]*to\s+anon/i);
  });

  it("extends only the narrow public invitation projection with support contact fields", () => {
    const migration = readMigration();
    const returnShape =
      migration.match(/returns table\s*\(([\s\S]*?)\)\s*language/i)?.[1] ?? "";

    expect(migration).toMatch(/create or replace function public\.resolve_public_candidate_invitation/i);
    expect(returnShape).toMatch(/candidate_support_email\s+text/i);
    expect(returnShape).toMatch(/candidate_support_url\s+text/i);
    expect(returnShape).not.toMatch(/\borganization_id\b/i);
    expect(returnShape).not.toMatch(/\bcandidate_id\b/i);
    expect(migration).toMatch(/organization_name\.candidate_support_email/i);
    expect(migration).toMatch(/organization_name\.candidate_support_url/i);
  });
});
