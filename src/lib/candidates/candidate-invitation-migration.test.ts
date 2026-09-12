import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120012_create_candidate_invitations.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("candidate invitation persistence migration", () => {
  it("binds each invitation to one tenant, job, candidate, and immutable interviewer version", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.candidate_invitations/i);
    expect(migration).toMatch(
      /organization_id uuid not null references public\.organizations\(id\)/i,
    );
    expect(migration).toMatch(
      /job_id uuid not null references public\.jobs\(id\)/i,
    );
    expect(migration).toMatch(
      /candidate_id uuid not null references public\.candidates\(id\)/i,
    );
    expect(migration).toMatch(
      /interviewer_version_id uuid not null references public\.interviewer_versions\(id\)/i,
    );
  });

  it("stores only a unique SHA-256 token hash with expiry and revocation metadata", () => {
    const migration = readMigration();

    expect(migration).toMatch(/token_hash text not null unique/i);
    expect(migration).toMatch(/check\s*\(token_hash\s*~\s*'\^\[0-9a-f\]\{64\}\$'/i);
    expect(migration).toMatch(/expires_at timestamptz not null/i);
    expect(migration).toMatch(/revoked_at timestamptz/i);
    expect(migration).toMatch(/created_at timestamptz not null default now\(\)/i);
    expect(migration).toMatch(/updated_at timestamptz not null default now\(\)/i);
    expect(migration).not.toMatch(/\braw_token\b/i);
    expect(migration).not.toMatch(/(?:^|[,\n])\s*token\s+(?:text|varchar|character varying)\b/im);
  });

  it("enables RLS without direct browser mutation grants", () => {
    const migration = readMigration();

    expect(migration).toMatch(
      /alter table public\.candidate_invitations enable row level security/i,
    );
    expect(migration).toMatch(/revoke all on table public\.candidate_invitations from anon/i);
    expect(migration).not.toMatch(
      /grant\s+(?:insert|update|delete).*public\.candidate_invitations.*to\s+(?:anon|authenticated)/is,
    );
  });
});
