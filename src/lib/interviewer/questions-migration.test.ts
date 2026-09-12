import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120003_create_questions.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("question bank tenancy migration", () => {
  it("defines tenant- and job-bound questions with deterministic ordering", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.questions/i);
    expect(migration).toMatch(
      /organization_id uuid not null references public\.organizations\(id\)/i,
    );
    expect(migration).toMatch(/job_id uuid not null/i);
    expect(migration).toMatch(
      /foreign key \(job_id, organization_id\)[\s\S]*references public\.jobs\(id, organization_id\)/i,
    );
    expect(migration).toMatch(/competency_id uuid not null/i);
    expect(migration).toMatch(
      /foreign key \(competency_id, job_id, organization_id\)[\s\S]*references public\.competencies\(id, job_id, organization_id\)/i,
    );
    expect(migration).toMatch(/position integer not null/i);
    expect(migration).toMatch(/unique\s*\(job_id,\s*position\)/i);
  });

  it("persists the bounded question-bank fields required by the builder", () => {
    const migration = readMigration();

    expect(migration).toMatch(/question_text text not null/i);
    expect(migration).toMatch(/difficulty text not null/i);
    expect(migration).toMatch(/expected_areas text\[\] not null/i);
    expect(migration).toMatch(/follow_up_hints text\[\] not null/i);
    expect(migration).toMatch(/max_duration_seconds integer not null/i);
    expect(migration).toMatch(/is_required boolean not null/i);
    expect(migration).toMatch(/char_length\(btrim\(question_text\)\) between 1 and 4000/i);
    expect(migration).toMatch(/max_duration_seconds between 1 and 3600/i);
  });

  it("keeps question mutation behind authenticated fixed-role RPC authority", () => {
    const migration = readMigration();

    expect(migration).toMatch(/alter table public\.questions enable row level security/i);
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/private\.has_organization_role/i);
    expect(migration).toMatch(
      /array\['owner',\s*'admin',\s*'recruiter',\s*'hiring_manager'\]::public\.organization_role\[\]/i,
    );
    expect(migration).not.toMatch(
      /grant\s+(?:insert|update|delete).*public\.questions.*to\s+authenticated/is,
    );
  });
});
