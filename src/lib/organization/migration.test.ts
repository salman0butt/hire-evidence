import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(
    process.cwd(),
    "supabase/migrations/20260911_create_organizations.sql",
  ),
  "utf8",
);

describe("organization tenancy migration", () => {
  it("defines the fixed organization roles and membership identity", () => {
    expect(migration).toMatch(/create type public\.organization_role as enum/i);

    for (const role of [
      "owner",
      "admin",
      "recruiter",
      "hiring_manager",
      "reviewer",
    ]) {
      expect(migration).toContain(`'${role}'`);
    }

    expect(migration).toMatch(/create table public\.organizations/i);
    expect(migration).toMatch(/create table public\.organization_memberships/i);
    expect(migration).toMatch(/primary key\s*\(organization_id,\s*user_id\)/i);
    expect(migration).toMatch(/user_id uuid not null references auth\.users\(id\)/i);
  });

  it("uses private security-definer helpers for tenant policy checks", () => {
    expect(migration).toMatch(/create schema if not exists private/i);
    expect(migration).toMatch(
      /create or replace function private\.is_organization_member/i,
    );
    expect(migration).toMatch(
      /create or replace function private\.has_organization_role/i,
    );
    expect(migration).toMatch(/security definer/i);
    expect(migration).toMatch(/set search_path\s*=\s*''/i);
  });

  it("enables RLS and keeps direct writes narrower than policy helpers", () => {
    expect(migration).toMatch(
      /alter table public\.organizations enable row level security/i,
    );
    expect(migration).toMatch(
      /alter table public\.organization_memberships enable row level security/i,
    );
    expect(migration).toMatch(/profiles_select_own|organizations_select_member/i);
    expect(migration).toMatch(/organizations_update_admin/i);
    expect(migration).toMatch(/memberships_select_member/i);

    expect(migration).not.toMatch(
      /grant\s+insert\s+on\s+public\.organizations\s+to\s+authenticated/i,
    );
    expect(migration).not.toMatch(
      /grant\s+(insert|update|delete)[\s\S]*?public\.organization_memberships[\s\S]*?authenticated/i,
    );
  });

  it("bootstraps organization and owner membership atomically through auth.uid()", () => {
    expect(migration).toMatch(
      /create or replace function public\.create_organization/i,
    );
    expect(migration).toMatch(/auth\.uid\(\)/i);
    expect(migration).toMatch(/insert into public\.organizations/i);
    expect(migration).toMatch(/insert into public\.organization_memberships/i);
    expect(migration).toMatch(/'owner'::public\.organization_role/i);
    expect(migration).toMatch(
      /grant execute on function public\.create_organization\(text, text, text\) to authenticated/i,
    );
  });
});