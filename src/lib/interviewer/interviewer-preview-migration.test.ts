import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120010_create_interviewer_preview.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("non-billable interviewer preview migration", () => {
  it("exposes an authenticated tenant-bound preview RPC", () => {
    const migration = readMigration();

    expect(migration).toMatch(
      /create or replace function public\.preview_interviewer_config\s*\(/i,
    );
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/auth\.uid\(\)/i);
    expect(migration).toMatch(/private\.has_organization_role/i);
    expect(migration).toMatch(/grant execute on function public\.preview_interviewer_config/i);
  });

  it("uses the same snapshot composition authority as publication", () => {
    const migration = readMigration();

    expect(migration).toMatch(
      /create or replace function private\.compose_interviewer_snapshot\s*\(/i,
    );
    expect(migration).toMatch(
      /create or replace function public\.publish_interviewer_config_guardrail_legacy[\s\S]*private\.compose_interviewer_snapshot/i,
    );
    expect(migration).toMatch(
      /create or replace function public\.preview_interviewer_config[\s\S]*private\.compose_interviewer_snapshot/i,
    );
  });

  it("revalidates safety and never persists preview artifacts", () => {
    const migration = readMigration();

    expect(migration).toMatch(/private\.assert_interviewer_guardrails/i);
    expect(migration).not.toMatch(/insert into public\.(?:candidates|interview_attempts|usage_events)/i);
    expect(migration).not.toMatch(/update public\.interviewer_configs[\s\S]*set status\s*=\s*'published'/i);
  });
});
