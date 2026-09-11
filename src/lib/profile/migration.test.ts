import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migration = readFileSync(
  join(process.cwd(), "supabase/migrations/20260910_create_profiles.sql"),
  "utf8",
);

describe("profiles migration", () => {
  it("enables RLS and scopes reads to auth.uid()", () => {
    expect(migration).toMatch(
      /alter table public\.profiles enable row level security/i,
    );
    expect(migration).toMatch(
      /for select[\s\S]*?using \(\(select auth\.uid\(\)\) = id\)/i,
    );
  });

  it("scopes inserts and updates to auth.uid()", () => {
    expect(migration).toMatch(
      /for insert[\s\S]*?with check \(\(select auth\.uid\(\)\) = id\)/i,
    );
    expect(migration).toMatch(
      /for update[\s\S]*?using \(\(select auth\.uid\(\)\) = id\)[\s\S]*?with check \(\(select auth\.uid\(\)\) = id\)/i,
    );
  });

  it("keeps profile ownership tied to auth.users and bounds display names", () => {
    expect(migration).toMatch(
      /id uuid primary key references auth\.users\(id\) on delete cascade/i,
    );
    expect(migration).toMatch(/char_length\(display_name\) <= 120/i);
  });
});
