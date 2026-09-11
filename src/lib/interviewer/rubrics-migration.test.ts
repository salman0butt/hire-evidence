import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120002_create_rubrics.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("observable rubric tenancy migration", () => {
  it("defines tenant-, job-, and competency-bound observable score levels 1 through 5", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create table public\.competency_rubrics/i);
    expect(migration).toMatch(/organization_id uuid not null references public\.organizations\(id\)/i);
    expect(migration).toMatch(/job_id uuid not null/i);
    expect(migration).toMatch(/competency_id uuid not null/i);
    expect(migration).toMatch(
      /foreign key \(competency_id, job_id, organization_id\)[\s\S]*references public\.competencies\(id, job_id, organization_id\)/i,
    );
    expect(migration).toMatch(/score_level smallint not null/i);
    expect(migration).toMatch(/score_level between 1 and 5/i);
    expect(migration).toMatch(/definition text not null/i);
    expect(migration).toMatch(/char_length\(btrim\(definition\)\) between 1 and 2000/i);
    expect(migration).toMatch(/unique\s*\(competency_id,\s*score_level\)/i);
    expect(migration).toMatch(/alter table public\.competency_rubrics enable row level security/i);
  });

  it("keeps rubric mutation behind authenticated fixed-role RPC authority", () => {
    const migration = readMigration();

    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
    expect(migration).toMatch(/private\.has_organization_role/i);
    expect(migration).toMatch(
      /array\['owner',\s*'admin',\s*'recruiter',\s*'hiring_manager'\]::public\.organization_role\[\]/i,
    );
    expect(migration).not.toMatch(
      /grant\s+(?:insert|update|delete).*public\.competency_rubrics.*to\s+authenticated/is,
    );
  });

  it("only exposes an atomic save contract that requires all five observable levels", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function public\.save_competency_rubric/i);
    for (const level of [1, 2, 3, 4, 5]) {
      expect(migration).toMatch(new RegExp(`p_level_${level} text`, "i"));
    }
    expect(migration).toMatch(
      /array\[p_level_1,\s*p_level_2,\s*p_level_3,\s*p_level_4,\s*p_level_5\]/i,
    );
    expect(migration).toMatch(/grant execute on function public\.save_competency_rubric/i);
    expect(migration).not.toMatch(
      /grant execute on function public\.upsert_competency_rubric_level[\s\S]*to authenticated/i,
    );
  });
});
