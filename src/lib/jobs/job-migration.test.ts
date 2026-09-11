import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609110003_create_jobs.sql",
);

describe("job tenancy migration", () => {
  it("defines organization-owned jobs and separated requirement kinds", () => {
    expect(existsSync(migrationPath)).toBe(true);
    if (!existsSync(migrationPath)) return;

    const migration = readFileSync(migrationPath, "utf8");

    expect(migration).toMatch(/create table public\.jobs/i);
    expect(migration).toMatch(/organization_id uuid not null references public\.organizations\(id\)/i);
    expect(migration).toMatch(/create table public\.job_requirements/i);
    expect(migration).toMatch(/must_have/i);
    expect(migration).toMatch(/nice_to_have/i);
    expect(migration).toMatch(/alter table public\.jobs enable row level security/i);
    expect(migration).toMatch(/alter table public\.job_requirements enable row level security/i);
  });
});
