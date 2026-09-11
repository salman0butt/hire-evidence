import { describe, expect, it } from "vitest";

import {
  INVITATION_TTL_MS,
  generateInvitationToken,
  hashInvitationToken,
} from "./invitations";

describe("organization invitation tokens", () => {
  it("uses a seven-day bounded invitation lifetime", () => {
    expect(INVITATION_TTL_MS).toBe(7 * 24 * 60 * 60 * 1000);
  });

  it("generates URL-safe high-entropy raw tokens and SHA-256 hashes", () => {
    const first = generateInvitationToken();
    const second = generateInvitationToken();

    expect(first.rawToken).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(first.rawToken.length).toBeGreaterThanOrEqual(43);
    expect(first.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(first.tokenHash).toBe(hashInvitationToken(first.rawToken));
    expect(first.tokenHash).not.toBe(first.rawToken);
    expect(second.rawToken).not.toBe(first.rawToken);
    expect(second.tokenHash).not.toBe(first.tokenHash);
  });

  it("hashes the same raw token deterministically", () => {
    const { rawToken } = generateInvitationToken();
    expect(hashInvitationToken(rawToken)).toBe(hashInvitationToken(rawToken));
  });
});
