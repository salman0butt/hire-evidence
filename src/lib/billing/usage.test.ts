import { describe, expect, it, vi } from "vitest";

import { recordAuthoritativeInterviewUsage } from "./usage";

describe("authoritative interview usage", () => {
  it("records the finalized attempt duration exactly once", async () => {
    const recordUsage = vi.fn().mockResolvedValue({ status: "recorded" as const });

    await expect(
      recordAuthoritativeInterviewUsage(
        {
          organizationId: "org-123",
          attemptId: "attempt-123",
          finalizedDurationSeconds: 137,
        },
        { recordUsage },
      ),
    ).resolves.toEqual({ status: "recorded" });

    expect(recordUsage).toHaveBeenCalledWith({
      organizationId: "org-123",
      attemptId: "attempt-123",
      interviewSeconds: 137,
    });
  });

  it("does not accept a client-reported duration as billing authority", async () => {
    const recordUsage = vi.fn();

    await expect(
      recordAuthoritativeInterviewUsage(
        {
          organizationId: "org-123",
          attemptId: "attempt-123",
          finalizedDurationSeconds: 0,
        },
        { recordUsage },
      ),
    ).rejects.toThrow("Invalid authoritative interview duration");

    expect(recordUsage).not.toHaveBeenCalled();
  });

  it("preserves idempotent duplicate-finalization results", async () => {
    const recordUsage = vi.fn().mockResolvedValue({ status: "duplicate" as const });

    await expect(
      recordAuthoritativeInterviewUsage(
        {
          organizationId: "org-123",
          attemptId: "attempt-123",
          finalizedDurationSeconds: 137,
        },
        { recordUsage },
      ),
    ).resolves.toEqual({ status: "duplicate" });

    expect(recordUsage).toHaveBeenCalledTimes(1);
  });
});
