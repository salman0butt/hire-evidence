import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609160001_assessment_generations.sql",
);

describe("assessment generation migration", () => {
  it("defines append-only tenant-scoped generation persistence and RPC boundaries", () => {
    const sql = readFileSync(migrationPath, "utf8");

    expect(sql).toMatch(/create table public\.assessment_generations/i);
    expect(sql).toMatch(/organization_id uuid not null/i);
    expect(sql).toMatch(/attempt_id uuid not null/i);
    expect(sql).toMatch(/generation_number integer not null/i);
    expect(sql).toMatch(/status text not null/i);
    expect(sql).toMatch(/pending.*processing.*completed.*failed/is);
    expect(sql).toMatch(/unique\s*\(attempt_id,\s*generation_number\)/i);
    expect(sql).toMatch(/enable row level security/i);
    expect(sql).toMatch(/revoke all on table public\.assessment_generations from anon/i);
    expect(sql).toMatch(/revoke all on table public\.assessment_generations from authenticated/i);
    expect(sql).toMatch(/security definer/i);
    expect(sql).toMatch(/claim_assessment_generation/i);
    expect(sql).toMatch(/complete_assessment_generation/i);
    expect(sql).toMatch(/fail_assessment_generation/i);
    expect(sql).toMatch(/get_assessment_generation/i);
  });

  it("requires completed attempts and immutable validated completion", () => {
    const sql = readFileSync(migrationPath, "utf8");

    expect(sql).toMatch(/interview_attempt.*state\s*=\s*'completed'/is);
    expect(sql).toMatch(/validated/i);
    expect(sql).toMatch(/status\s*=\s*'processing'/i);
    expect(sql).toMatch(/status\s*=\s*'completed'/i);
    expect(sql).toMatch(/raise exception/i);
  });
});
