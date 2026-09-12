import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120008_enforce_interviewer_guardrails.sql",
);

function readMigration() {
  expect(existsSync(migrationPath)).toBe(true);
  return existsSync(migrationPath) ? readFileSync(migrationPath, "utf8") : "";
}

describe("authoritative interviewer guardrails migration", () => {
  it("defines one database guardrail boundary for prohibited hiring criteria", () => {
    const migration = readMigration();

    expect(migration).toMatch(/create or replace function private\.assert_interviewer_guardrails\s*\(/i);
    expect(migration).toMatch(/protected-class|protected class|race|religion/i);
    expect(migration).toMatch(/disability|medical/i);
    expect(migration).toMatch(/pregnan|family status/i);
    expect(migration).toMatch(/biometric|emotion/i);
    expect(migration).toMatch(/deception|lie detection/i);
    expect(migration).toMatch(/accent|native-sounding/i);
    expect(migration).toMatch(/personality/i);
    expect(migration).toMatch(/without human review|autonomously/i);
    expect(migration).toMatch(/override|bypass|disable/i);
  });

  it("wraps direct save rpc calls with the authoritative guardrail check", () => {
    const migration = readMigration();

    expect(migration).toMatch(/alter function public\.save_interviewer_config[\s\S]*rename to save_interviewer_config_guardrail_legacy/i);
    expect(migration).toMatch(/revoke all on function public\.save_interviewer_config_guardrail_legacy[\s\S]*from authenticated/i);
    expect(migration).toMatch(/create or replace function public\.save_interviewer_config\s*\(/i);
    expect(migration).toMatch(/private\.assert_interviewer_guardrails\s*\(/i);
    expect(migration).toMatch(/save_interviewer_config_guardrail_legacy\s*\(/i);
  });

  it("wraps direct publish rpc calls with the same authoritative guardrail check", () => {
    const migration = readMigration();

    expect(migration).toMatch(/alter function public\.publish_interviewer_config[\s\S]*rename to publish_interviewer_config_guardrail_legacy/i);
    expect(migration).toMatch(/revoke all on function public\.publish_interviewer_config_guardrail_legacy[\s\S]*from authenticated/i);
    expect(migration).toMatch(/create or replace function public\.publish_interviewer_config\s*\(/i);
    expect(migration).toMatch(/publish_interviewer_config_guardrail_legacy\s*\(/i);
  });

  it("includes route-bound job text together with guidelines and candidate instructions", () => {
    const migration = readMigration();

    expect(migration).toMatch(/from public\.jobs/i);
    expect(migration).toMatch(/description/i);
    expect(migration).toMatch(/responsibilities/i);
    expect(migration).toMatch(/interview_instructions/i);
    expect(migration).toMatch(/p_guidelines/i);
    expect(migration).toMatch(/p_candidate_instructions/i);
  });
});
