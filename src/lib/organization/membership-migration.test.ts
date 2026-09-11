import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609110001_manage_memberships.sql",
);

function readMigration(): string {
  return readFileSync(migrationPath, "utf8");
}

describe("organization membership management migration", () => {
  it("exposes narrowly scoped authenticated RPCs instead of direct membership writes", () => {
    const sql = readMigration();

    expect(sql).toMatch(/create or replace function public\.update_organization_member_role/i);
    expect(sql).toMatch(/create or replace function public\.remove_organization_member/i);
    expect(sql).toMatch(/security definer/i);
    expect(sql).toMatch(/set search_path\s*=\s*''/i);
    expect(sql).toMatch(/auth\.uid\(\)/i);
    expect(sql).toMatch(/revoke all on function public\.update_organization_member_role/i);
    expect(sql).toMatch(/revoke all on function public\.remove_organization_member/i);
    expect(sql).toMatch(/grant execute on function public\.update_organization_member_role/i);
    expect(sql).toMatch(/grant execute on function public\.remove_organization_member/i);
    expect(sql).not.toMatch(/grant\s+(insert|update|delete)[^;]*organization_memberships[^;]*authenticated/i);
  });

  it("preserves ownership and restricts management to owner or admin actors", () => {
    const sql = readMigration();

    expect(sql).toMatch(/array\['owner',\s*'admin'\]::public\.organization_role\[\]/i);
    expect(sql).toMatch(/p_role\s*=\s*'owner'::public\.organization_role/i);
    expect(sql).toMatch(/target_membership\.role\s*=\s*'owner'::public\.organization_role/i);
    expect(sql).toMatch(/raise exception 'Owner membership cannot be changed\.'/i);
    expect(sql).toMatch(/raise exception 'Owner membership cannot be removed\.'/i);
  });

  it("requires organization and target membership state to match the requested tenant", () => {
    const sql = readMigration();

    expect(sql).toMatch(/where membership\.organization_id\s*=\s*p_organization_id/i);
    expect(sql).toMatch(/and membership\.user_id\s*=\s*p_user_id/i);
    expect(sql).toMatch(/if not found then/i);
    expect(sql).toMatch(/raise exception 'Membership not found\.'/i);
  });
});
