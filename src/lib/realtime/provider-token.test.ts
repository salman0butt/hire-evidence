import { describe, expect, it, vi } from "vitest";

import { createProviderTokenIssuer } from "./provider-token";

const request = {
  attemptId: "attempt-1",
  interviewerVersionId: "version-1",
  durationSeconds: 1800,
  language: "en",
} as const;

describe("provider token issuer boundary", () => {
  it("returns a non-empty short-lived credential from the injected provider adapter", async () => {
    const issue = vi.fn().mockResolvedValue({
      credential: "ephemeral-token",
      expiresAt: "2026-09-12T13:04:00.000Z",
    });
    const issuer = createProviderTokenIssuer(issue, {
      now: () => new Date("2026-09-12T13:00:00.000Z"),
      maxLifetimeMs: 5 * 60 * 1000,
    });

    await expect(issuer(request)).resolves.toEqual({
      credential: "ephemeral-token",
      expiresAt: "2026-09-12T13:04:00.000Z",
    });
    expect(issue).toHaveBeenCalledWith(request);
  });

  it("rejects empty, expired, invalid, or overlong provider credentials", async () => {
    const now = () => new Date("2026-09-12T13:00:00.000Z");

    for (const credential of [
      { credential: "", expiresAt: "2026-09-12T13:04:00.000Z" },
      { credential: "token", expiresAt: "not-a-date" },
      { credential: "token", expiresAt: "2026-09-12T12:59:59.000Z" },
      { credential: "token", expiresAt: "2026-09-12T13:05:01.000Z" },
    ]) {
      const issuer = createProviderTokenIssuer(
        vi.fn().mockResolvedValue(credential),
        { now, maxLifetimeMs: 5 * 60 * 1000 },
      );

      await expect(issuer(request)).rejects.toThrow(
        "Provider credential must be short-lived",
      );
    }
  });
});
