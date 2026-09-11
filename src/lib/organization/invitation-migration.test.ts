import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609110002_create_organization_invitations.sql",
);

function readMigration(): string {
  return readFileSync(migrationPath, "utf8");
}

describe("organization invitation migration", () => {
  it("stores invitation hashes and lifecycle state without raw tokens", () => {
    const sql = readMigration();
    expect(sql).toMatch(/create table public\.organization_invitations/i);
    expect(sql).toMatch(/token_hash\s+text\s+not null\s+unique/i);
    expect(sql).toMatch(/expires_at\s+timestamptz\s+not null/i);
    expect(sql).toMatch(/accepted_at\s+timestamptz/i);
    expect(sql).toMatch(/revoked_at\s+timestamptz/i);
    expect(sql).not.toMatch(/raw_token/i);
  });

  it("exposes narrow authenticated create, revoke, and accept RPCs", () => {
    const sql = readMigration();
    for (const name of [
      "create_organization_invitation",
      "revoke_organization_invitation",
      "accept_organization_invitation",
    ]) {
      expect(sql).toMatch(new RegExp(`create or replace function public\\.${name}`, "i"));
      expect(sql).toMatch(new RegExp(`revoke all on function public\\.${name}`, "i"));
      expect(sql).toMatch(new RegExp(`grant execute on function public\\.${name}`, "i"));
    }
    expect(sql).toMatch(/security definer/i);
    expect(sql).toMatch(/set search_path\s*=\s*''/i);
  });

  it("enforces admin creation, non-owner roles, expiry, verified-email acceptance, and replay denial", () => {
    const sql = readMigration();
    expect(sql).toMatch(/array\['owner',\s*'admin'\]::public\.organization_role\[\]/i);
    expect(sql).toMatch(/p_role\s*=\s*'owner'::public\.organization_role/i);
    expect(sql).toMatch(/expires_at\s*<=\s*now\(\)/i);
    expect(sql).toMatch(/email_confirmed_at\s+is\s+not\s+null/i);
    expect(sql).toMatch(/lower\(.*email/i);
    expect(sql).toMatch(/accepted_at\s+is\s+not\s+null/i);
    expect(sql).toMatch(/revoked_at\s+is\s+not\s+null/i);
    expect(sql).toMatch(/insert into public\.organization_memberships/i);
  });
});
