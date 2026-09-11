import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120001_create_competencies.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("competency tenancy migration", () => {
  it("defines organization- and job-bound competencies with bounded weight and deterministic position", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.competencies/i);
    expect(migration).toMatch(/organization_id uuid not null references public\.organizations\(id\)/i);
    expect(migration).toMatch(/job_id uuid not null/i);
    expect(migration).toMatch(/foreign key \(job_id, organization_id\)[\s\S]*references public\.jobs\(id, organization_id\)/i);
    expect(migration).toMatch(/name text not null/i);
    expect(migration).toMatch(/description text/i);
    expect(migration).toMatch(/weight numeric/i);
    expect(migration).toMatch(/weight > 0/i);
    expect(migration).toMatch(/weight <= 100/i);
    expect(migration).toMatch(/position integer not null/i);
    expect(migration).toMatch(/unique\s*\(job_id,\s*position\)/i);
    expect(migration).toMatch(/alter table public\.competencies enable row level security/i);
  });

  it("routes competency mutation through authenticated fixed-role RPC authority", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.create_competency/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/private\.has_organization_role/i);
    expect(migration).toMatch(
      /array\['owner',\s*'admin',\s*'recruiter',\s*'hiring_manager'\]::public\.organization_role\[\]/i,
    );
    expect(migration).not.toMatch(
      /grant\s+(?:insert|update|delete).*public\.competencies.*to\s+authenticated/is,
    );
  });
});
