import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120007_create_interviewer_versions.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("immutable interviewer version migration", () => {
  it("stores tenant-bound immutable published snapshots with platform provenance", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.interviewer_versions/i);
    expect(migration).toMatch(/organization_id uuid not null/i);
    expect(migration).toMatch(/job_id uuid not null/i);
    expect(migration).toMatch(/interviewer_config_id uuid not null/i);
    expect(migration).toMatch(/version_number integer not null/i);
    expect(migration).toMatch(/snapshot jsonb not null/i);
    expect(migration).toMatch(/platform_prompt_version text not null/i);
    expect(migration).toMatch(/guardrail_version text not null/i);
    expect(migration).toMatch(/unique\s*\(interviewer_config_id, version_number\)/i);
  });

  it("creates the version snapshot only through the authorized publish boundary", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.publish_interviewer_config\s*\(/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/insert into public\.interviewer_versions/i);
    expect(migration).toMatch(/jsonb_build_object/i);
    expect(migration).toMatch(/requirements/i);
    expect(migration).toMatch(/competencies/i);
    expect(migration).toMatch(/rubrics/i);
    expect(migration).toMatch(/questions/i);
    expect(migration).toMatch(/interview_plan/i);
    expect(migration).toMatch(/interviewer_config/i);
  });

  it("returns the same immutable version for repeated publication", () => {
    const migration = readMigration();

    expect(migration).toMatch(/if v_status = 'published' then[\s\S]*select version\.id[\s\S]*return v_version_id/i);
    expect(migration).toMatch(/order by version\.version_number desc/i);
  });

  it("allows tenant members to read versions while denying direct mutation", () => {
    const migration = readMigration();

    expect(migration).toMatch(/enable row level security/i);
    expect(migration).toMatch(/create policy .*interviewer_versions.*select/i);
    expect(migration).toMatch(/private\.is_organization_member/i);
    expect(migration).not.toMatch(/create policy .*interviewer_versions.*(?:insert|update|delete)/i);
    expect(migration).toMatch(/revoke insert, update, delete on public\.interviewer_versions from authenticated/i);
  });
});
