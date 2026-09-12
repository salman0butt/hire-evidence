import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120004_create_interview_plans.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("deterministic interview plan tenancy migration", () => {
  it("persists tenant- and job-bound plans with ordered section budgets", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.interview_plans/i);
    expect(migration).toMatch(/organization_id uuid not null references public\.organizations\(id\)/i);
    expect(migration).toMatch(/job_id uuid not null/i);
    expect(migration).toMatch(/total_duration_seconds integer not null/i);
    expect(migration).toMatch(/foreign key \(job_id, organization_id\)[\s\S]*references public\.jobs\(id, organization_id\)/i);
    expect(migration).toMatch(/unique\s*\(id,\s*job_id,\s*organization_id\)/i);

    expect(migration).toMatch(/create table public\.interview_plan_sections/i);
    expect(migration).toMatch(/plan_id uuid not null/i);
    expect(migration).toMatch(/purpose text not null/i);
    expect(migration).toMatch(/duration_seconds integer not null/i);
    expect(migration).toMatch(/position integer not null/i);
    expect(migration).toMatch(/unique\s*\(plan_id,\s*position\)/i);
    expect(migration).toMatch(/foreign key \(plan_id, job_id, organization_id\)[\s\S]*references public\.interview_plans\(id, job_id, organization_id\)/i);
  });

  it("binds every planned question and competency to the same tenant and job", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.interview_plan_section_questions/i);
    expect(migration).toMatch(/question_id uuid not null/i);
    expect(migration).toMatch(/question_position integer not null/i);
    expect(migration).toMatch(/foreign key \(question_id, job_id, organization_id\)[\s\S]*references public\.questions\(id, job_id, organization_id\)/i);

    expect(migration).toMatch(/create table public\.interview_plan_section_competencies/i);
    expect(migration).toMatch(/competency_id uuid not null/i);
    expect(migration).toMatch(/foreign key \(competency_id, job_id, organization_id\)[\s\S]*references public\.competencies\(id, job_id, organization_id\)/i);
  });

  it("keeps plan data behind tenant-scoped RLS without direct authenticated mutation grants", () => {
    const migration = readMigration();

    for (const table of [
      "interview_plans",
      "interview_plan_sections",
      "interview_plan_section_questions",
      "interview_plan_section_competencies",
    ]) {
      expect(migration).toMatch(
        new RegExp(`alter table public\\.${table} enable row level security`, "i"),
      );
      expect(migration).not.toMatch(
        new RegExp(
          `grant\\s+(?:insert|update|delete)[^;]*public\\.${table}[^;]*to\\s+authenticated`,
          "i",
        ),
      );
    }

    expect(migration).toMatch(/private\.is_organization_member\(organization_id\)/i);
  });
});
