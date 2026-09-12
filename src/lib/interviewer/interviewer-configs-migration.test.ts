import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120005_create_interviewer_configs.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("interviewer configuration tenancy migration", () => {
  it("persists tenant-, job-, and plan-bound draft interviewer configuration", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.interviewer_configs/i);
    expect(migration).toMatch(/organization_id uuid not null references public\.organizations\(id\)/i);
    expect(migration).toMatch(/job_id uuid not null/i);
    expect(migration).toMatch(/plan_id uuid not null/i);
    expect(migration).toMatch(/name text not null/i);
    expect(migration).toMatch(/interview_type text not null/i);
    expect(migration).toMatch(/persona text not null/i);
    expect(migration).toMatch(/language text not null/i);
    expect(migration).toMatch(/duration_seconds integer not null/i);
    expect(migration).toMatch(/difficulty text not null/i);
    expect(migration).toMatch(/question_mode text not null/i);
    expect(migration).toMatch(/guidelines text not null/i);
    expect(migration).toMatch(/candidate_instructions text not null/i);
    expect(migration).toMatch(/max_follow_ups_per_question integer not null/i);
    expect(migration).toMatch(/follow_up_reasons text\[\] not null/i);
    expect(migration).toMatch(/unique\s*\(id,\s*job_id,\s*organization_id\)/i);
    expect(migration).toMatch(/foreign key \(job_id, organization_id\)[\s\S]*references public\.jobs\(id, organization_id\)/i);
    expect(migration).toMatch(/foreign key \(plan_id, job_id, organization_id\)[\s\S]*references public\.interview_plans\(id, job_id, organization_id\)/i);
  });

  it("mirrors bounded validation for enum-like fields, duration, follow-ups, and authored text", () => {
    const migration = readMigration();

    expect(migration).toMatch(/interview_type in \('screening', 'behavioral', 'technical', 'role_specific', 'leadership', 'case_study', 'system_design', 'values', 'custom'\)/i);
    expect(migration).toMatch(/persona in \('professional', 'friendly', 'direct', 'technical', 'conversational'\)/i);
    expect(migration).toMatch(/difficulty in \('easy', 'medium', 'hard'\)/i);
    expect(migration).toMatch(/question_mode in \('fixed', 'semi_adaptive', 'adaptive'\)/i);
    expect(migration).toMatch(/duration_seconds between 900 and 3600/i);
    expect(migration).toMatch(/max_follow_ups_per_question between 0 and 2/i);
    expect(migration).toMatch(/char_length\(btrim\(name\)\) between 1 and 200/i);
    expect(migration).toMatch(/char_length\(guidelines\) <= 8000/i);
    expect(migration).toMatch(/char_length\(candidate_instructions\) <= 4000/i);
  });

  it("keeps configuration behind member-read RLS without direct authenticated writes", () => {
    const migration = readMigration();

    expect(migration).toMatch(/alter table public\.interviewer_configs enable row level security/i);
    expect(migration).toMatch(/private\.is_organization_member\(organization_id\)/i);
    expect(migration).not.toMatch(/grant\s+(?:insert|update|delete)[^;]*public\.interviewer_configs[^;]*to\s+authenticated/i);
  });

  it("saves drafts only through a fixed-role security-definer boundary", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.save_interviewer_config\s*\(/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path = ''/i);
    expect(migration).toMatch(/auth\.uid\(\)/i);
    expect(migration).toMatch(/private\.has_organization_role\([\s\S]*'owner'[\s\S]*'admin'[\s\S]*'recruiter'[\s\S]*'hiring_manager'/i);
    expect(migration).toMatch(/revoke all on function public\.save_interviewer_config/i);
    expect(migration).toMatch(/grant execute on function public\.save_interviewer_config[\s\S]*to authenticated/i);
  });
});
