import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120011_create_candidates.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("candidate tenancy migration", () => {
  it("defines organization-owned, job-bound candidate records with RLS", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.candidates/i);
    expect(migration).toMatch(
      /organization_id uuid not null references public\.organizations\(id\)/i,
    );
    expect(migration).toMatch(
      /job_id uuid not null references public\.jobs\(id\)/i,
    );
    expect(migration).toMatch(/full_name text not null/i);
    expect(migration).toMatch(/email text not null/i);
    expect(migration).toMatch(/created_at timestamptz not null default now\(\)/i);
    expect(migration).toMatch(/updated_at timestamptz not null default now\(\)/i);
    expect(migration).toMatch(/alter table public\.candidates enable row level security/i);
  });

  it("enforces normalized candidate identity and tenant/job consistency", () => {
    const migration = readMigration();

    expect(migration).toMatch(/check\s*\(full_name\s*=\s*btrim\(full_name\)/i);
    expect(migration).toMatch(/check\s*\(email\s*=\s*lower\(btrim\(email\)\)/i);
    expect(migration).toMatch(/email\s*~\s*'\^\[\^\[:space:\]@\]\+@/i);
    expect(migration).toMatch(/normalized_email\s*!~\s*'\^\[\^\[:space:\]@\]\+@/i);
    expect(migration).toMatch(/unique\s*\(organization_id,\s*job_id,\s*email\)/i);
    expect(migration).toMatch(/foreign key\s*\(job_id,\s*organization_id\)/i);
    expect(migration).toMatch(/references public\.jobs\s*\(id,\s*organization_id\)/i);
  });

  it("uses role-gated RPCs for candidate creation instead of direct mutation grants", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.create_candidate/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/auth\.uid\(\)/i);
    expect(migration).toMatch(/private\.has_organization_role/i);
    expect(migration).toMatch(
      /array\['owner',\s*'admin',\s*'recruiter',\s*'hiring_manager'\]::public\.organization_role\[\]/i,
    );
    expect(migration).toMatch(/insert into public\.candidates/i);
    expect(migration).toMatch(/grant execute on function public\.create_candidate/i);

    expect(migration).not.toMatch(
      /grant\s+(?:insert|update|delete).*public\.candidates.*to\s+authenticated/is,
    );
  });
});
