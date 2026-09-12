import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120006_add_interviewer_publish_state.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("interviewer draft/publish state migration", () => {
  it("adds an explicit draft-to-published lifecycle with publication metadata", () => {
    const migration = readMigration();

    expect(migration).toMatch(/add column status text not null default 'draft'/i);
    expect(migration).toMatch(/status in \('draft', 'published'\)/i);
    expect(migration).toMatch(/add column published_at timestamptz/i);
    expect(migration).toMatch(/status = 'draft'[\s\S]*published_at is null/i);
    expect(migration).toMatch(/status = 'published'[\s\S]*published_at is not null/i);
  });

  it("publishes only through a fixed-role atomic security-definer boundary", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.publish_interviewer_config\s*\(/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path = ''/i);
    expect(migration).toMatch(/auth\.uid\(\)/i);
    expect(migration).toMatch(
      /private\.has_organization_role\([\s\S]*'owner'[\s\S]*'admin'[\s\S]*'recruiter'[\s\S]*'hiring_manager'/i,
    );
    expect(migration).toMatch(/grant execute on function public\.publish_interviewer_config[\s\S]*to authenticated/i);
  });

  it("rejects incomplete or inconsistent configuration before the transition", () => {
    const migration = readMigration();

    expect(migration).toMatch(/interview_plans/i);
    expect(migration).toMatch(/interview_plan_sections/i);
    expect(migration).toMatch(/interview_plan_section_questions/i);
    expect(migration).toMatch(/interview_plan_section_competencies/i);
    expect(migration).toMatch(/config\.duration_seconds/i);
    expect(migration).toMatch(/plan\.total_duration_seconds/i);
    expect(migration).toMatch(/v_config_duration\s*<>\s*v_plan_duration/i);
    expect(migration).toMatch(/cannot be published/i);
  });

  it("makes publication idempotent and prevents later draft saves", () => {
    const migration = readMigration();

    expect(migration).toMatch(/if v_status = 'published' then[\s\S]*return p_config_id/i);
    expect(migration).toMatch(/where config\.id = p_config_id[\s\S]*config\.status = 'draft'/i);
    expect(migration).toMatch(/published interviewer configuration cannot be edited/i);
  });
});