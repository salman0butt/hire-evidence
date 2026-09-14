import { describe, expect, it, vi } from "vitest";

import { hashInvitationToken } from "@/lib/candidates/invitation-token";
import { createRealtimeSessionRepository } from "./session-repository";

type FinalizeAttempt = (input: Readonly<{
  rawToken: string;
  attemptId: string;
}>) => Promise<unknown>;

describe("realtime session finalization", () => {
  it("finalizes the authoritative attempt through one capability-bound idempotent RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [
        {
          attempt_id: "attempt-1",
          attempt_state: "completed",
          completed_at: "2026-09-14T21:05:00.000Z",
          duration_seconds: 847,
          assessment_trigger_id: "assessment-trigger-1",
        },
      ],
      error: null,
    });
    const repository = createRealtimeSessionRepository(rpc);
    const finalizeAttempt = (repository as unknown as { finalizeAttempt: FinalizeAttempt })
      .finalizeAttempt;

    await expect(
      finalizeAttempt({
        rawToken: "capability-secret",
        attemptId: "attempt-1",
      }),
    ).resolves.toEqual({
      status: "completed",
      attemptId: "attempt-1",
      completedAt: "2026-09-14T21:05:00.000Z",
      durationSeconds: 847,
      assessmentTriggerId: "assessment-trigger-1",
    });

    expect(rpc).toHaveBeenCalledTimes(1);
    expect(rpc).toHaveBeenCalledWith("finalize_realtime_interview_session", {
      p_token_hash: hashInvitationToken("capability-secret"),
      p_attempt_id: "attempt-1",
    });
  });
});
