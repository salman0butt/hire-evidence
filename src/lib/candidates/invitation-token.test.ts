import { describe, expect, it } from "vitest";

import { createInvitationToken, hashInvitationToken } from "./invitation-token";

describe("candidate invitation tokens", () => {
  it("creates an opaque URL-safe token backed by at least 32 random bytes and its SHA-256 hash", () => {
    const invitation = createInvitationToken();

    expect(invitation.token).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(Buffer.from(invitation.token, "base64url")).toHaveLength(32);
    expect(invitation.tokenHash).toMatch(/^[a-f0-9]{64}$/);
    expect(invitation.tokenHash).toBe(hashInvitationToken(invitation.token));
  });
});
