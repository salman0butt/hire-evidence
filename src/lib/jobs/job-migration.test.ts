import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609110003_create_jobs.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("job tenancy migration", () => {
  it("defines organization-owned jobs and separated requirement kinds", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.jobs/i);
    expect(migration).toMatch(/organization_id uuid not null references public\.organizations\(id\)/i);
    expect(migration).toMatch(/create table public\.job_requirements/i);
    expect(migration).toMatch(/must_have/i);
    expect(migration).toMatch(/nice_to_have/i);
    expect(migration).toMatch(/alter table public\.jobs enable row level security/i);
    expect(migration).toMatch(/alter table public\.job_requirements enable row level security/i);
  });

  it("creates a job and its requirements atomically through an authenticated role-gated RPC", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.create_job/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/auth\.uid\(\)/i);
    expect(migration).toMatch(/private\.has_organization_role/i);
    expect(migration).toMatch(
      /array\['owner',\s*'admin',\s*'recruiter',\s*'hiring_manager'\]::public\.organization_role\[\]/i,
    );
    expect(migration).toMatch(/insert into public\.jobs/i);
    expect(migration).toMatch(/insert into public\.job_requirements/i);
    expect(migration).toMatch(/jsonb_array_elements/i);
    expect(migration).toMatch(/grant execute on function public\.create_job/i);

    expect(migration).not.toMatch(
      /grant\s+(?:insert|update|delete).*public\.jobs.*to\s+authenticated/is,
    );
    expect(migration).not.toMatch(
      /grant\s+(?:insert|update|delete).*public\.job_requirements.*to\s+authenticated/is,
    );
  });

  it("updates and deletes only route-bound organization jobs through role-gated RPCs", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.update_job/i);
    expect(migration).toMatch(/create or replace function public\.delete_job/i);
    expect(
      migration.match(
        /array\['owner',\s*'admin',\s*'recruiter',\s*'hiring_manager'\]::public\.organization_role\[\]/gi,
      )?.length ?? 0,
    ).toBeGreaterThanOrEqual(3);
    expect(migration).toMatch(/where\s+id\s*=\s*p_job_id\s+and\s+organization_id\s*=\s*p_organization_id/is);
    expect(migration).toMatch(/delete from public\.job_requirements[\s\S]*organization_id\s*=\s*p_organization_id[\s\S]*job_id\s*=\s*p_job_id/i);
    expect(migration).toMatch(/delete from public\.jobs[\s\S]*id\s*=\s*p_job_id[\s\S]*organization_id\s*=\s*p_organization_id/i);
    expect(migration).toMatch(/grant execute on function public\.update_job/i);
    expect(migration).toMatch(/grant execute on function public\.delete_job/i);
  });
});
