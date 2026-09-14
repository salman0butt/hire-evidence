import { readFileSync } from "node:fs";
import { join } from "node:path";

import { describe, expect, it } from "vitest";

const migrationPath = join(
  process.cwd(),
  "supabase/migrations/202609120017_realtime_interview_sessions.sql",
);

describe("realtime attempt lifecycle idempotency", () => {
  it("replays an already-processed terminal progress event before rejecting a completed attempt", () => {
    const migration = readFileSync(migrationPath, "utf8");
    const functionStart = migration.indexOf(
      "create or replace function public.advance_realtime_interview_session",
    );
    const functionBody = migration.slice(functionStart);
    const missingAttemptGuard = functionBody.indexOf("if attempt.id is null");
    const replayGuard = functionBody.indexOf(
      "if attempt.processed_event_ids ? p_event_id",
    );
    const activeStateGuard = functionBody.indexOf("attempt.state = 'active'");

    expect(functionStart).toBeGreaterThanOrEqual(0);
    expect(missingAttemptGuard).toBeGreaterThanOrEqual(0);
    expect(replayGuard).toBeGreaterThan(missingAttemptGuard);
    expect(activeStateGuard).toBeGreaterThan(replayGuard);
  });
});
