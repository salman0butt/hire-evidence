import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609200001_candidate_review_notes_status.sql",
);

describe("candidate review notes/status migration", () => {
  it("defines attributable bounded reviewer notes and an explicit review lifecycle", () => {
    const sql = readFileSync(migrationPath, "utf8");

    expect(sql).toMatch(/create table public\.candidate_reviews/i);
    expect(sql).toMatch(/organization_id uuid not null/i);
    expect(sql).toMatch(/job_id uuid not null/i);
    expect(sql).toMatch(/candidate_id uuid not null/i);
    expect(sql).toMatch(/attempt_id uuid not null/i);
    expect(sql).toMatch(/assessment_generation_id uuid not null/i);
    expect(sql).toMatch(/status text not null/i);
    expect(sql).toMatch(/awaiting_review/i);
    expect(sql).toMatch(/in_review/i);
    expect(sql).toMatch(/reviewed/i);
    expect(sql).toMatch(/reviewer_notes text/i);
    expect(sql).toMatch(/char_length\(btrim\(reviewer_notes\)\) <= 4000/i);
    expect(sql).toMatch(/reviewer_user_id uuid not null/i);
    expect(sql).toMatch(/updated_at timestamptz not null default now\(\)/i);
    expect(sql).toMatch(/enable row level security/i);
  });

  it("exposes only an authenticated exact-scope mutation boundary", () => {
    const sql = readFileSync(migrationPath, "utf8");

    expect(sql).toMatch(/create or replace function public\.save_candidate_review/i);
    expect(sql).toMatch(/security definer/i);
    expect(sql).toMatch(/auth\.uid\(\)/i);
    expect(sql).toMatch(/private\.is_organization_member\(p_organization_id\)/i);
    expect(sql).toMatch(/assessment_generations/i);
    expect(sql).toMatch(/status\s*=\s*'completed'/i);
    expect(sql).toMatch(/p_job_id/i);
    expect(sql).toMatch(/p_candidate_id/i);
    expect(sql).toMatch(/p_attempt_id/i);
    expect(sql).toMatch(/p_assessment_generation_id/i);
    expect(sql).toMatch(/p_status/i);
    expect(sql).toMatch(/p_reviewer_notes/i);
    expect(sql).toMatch(/grant execute on function public\.save_candidate_review/i);
    expect(sql).toMatch(/to authenticated/i);
  });
});
