import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609190001_candidate_review_score_overrides.sql",
);

describe("candidate review score override migration", () => {
  it("defines append-only human score overrides over an immutable assessment generation", () => {
    const sql = readFileSync(migrationPath, "utf8");

    expect(sql).toMatch(/create table public\.candidate_review_score_overrides/i);
    expect(sql).toMatch(/organization_id uuid not null/i);
    expect(sql).toMatch(/job_id uuid not null/i);
    expect(sql).toMatch(/candidate_id uuid not null/i);
    expect(sql).toMatch(/attempt_id uuid not null/i);
    expect(sql).toMatch(/assessment_generation_id uuid not null/i);
    expect(sql).toMatch(/competency_id text not null/i);
    expect(sql).toMatch(/human_score integer/i);
    expect(sql).toMatch(/human_score is null or human_score between 1 and 5/i);
    expect(sql).toMatch(/reason text not null/i);
    expect(sql).toMatch(/char_length\(btrim\(reason\)\) between 1 and 1000/i);
    expect(sql).toMatch(/reviewer_user_id uuid not null/i);
    expect(sql).toMatch(/created_at timestamptz not null default now\(\)/i);
    expect(sql).toMatch(/enable row level security/i);
    expect(sql).toMatch(/revoke all on table public\.candidate_review_score_overrides from authenticated/i);
  });

  it("exposes only an authenticated append boundary that validates the authoritative review scope", () => {
    const sql = readFileSync(migrationPath, "utf8");

    expect(sql).toMatch(/create or replace function public\.create_candidate_review_score_override/i);
    expect(sql).toMatch(/security definer/i);
    expect(sql).toMatch(/auth\.uid\(\)/i);
    expect(sql).toMatch(/private\.is_organization_member\(p_organization_id\)/i);
    expect(sql).toMatch(/assessment_generations/i);
    expect(sql).toMatch(/status\s*=\s*'completed'/i);
    expect(sql).toMatch(/interview_attempts/i);
    expect(sql).toMatch(/p_job_id/i);
    expect(sql).toMatch(/p_candidate_id/i);
    expect(sql).toMatch(/p_attempt_id/i);
    expect(sql).toMatch(/p_assessment_generation_id/i);
    expect(sql).toMatch(/p_competency_id/i);
    expect(sql).toMatch(/p_human_score/i);
    expect(sql).toMatch(/p_reason/i);
    expect(sql).toMatch(/grant execute on function public\.create_candidate_review_score_override/i);
    expect(sql).toMatch(/to authenticated/i);
    expect(sql).not.toMatch(/create or replace function public\.update_candidate_review_score_override/i);
    expect(sql).not.toMatch(/create or replace function public\.delete_candidate_review_score_override/i);
  });
});
