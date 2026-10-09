import { describe, expect, it } from "vitest";

import { canUseSupportAccess, createSupportAccessGrant } from "./support-access";

const validGrant = {
  organizationId: "org-1",
  actorId: "support-user-1",
  reason: "customer-requested-investigation",
  scope: "read_incident_health",
  grantedAt: "2026-10-06T12:00:00.000Z",
  expiresAt: "2026-10-06T13:00:00.000Z",
} as const;

describe("privileged support access", () => {
  it("creates an immutable, attributable, explicitly scoped grant with a bounded lifetime", () => {
    const grant = createSupportAccessGrant(validGrant);
    expect(grant).toEqual(validGrant);
    expect(Object.isFrozen(grant)).toBe(true);
  });

  it("fails closed for cross-tenant, wrong-scope, expired, or not-yet-active access", () => {
    const grant = createSupportAccessGrant(validGrant);

    expect(canUseSupportAccess(grant, "org-2", "read_incident_health", "2026-10-06T12:30:00.000Z")).toBe(false);
    expect(canUseSupportAccess(grant, "org-1", "read_audit", "2026-10-06T12:30:00.000Z")).toBe(false);
    expect(canUseSupportAccess(grant, "org-1", "read_incident_health", "2026-10-06T13:00:00.000Z")).toBe(false);
    expect(canUseSupportAccess(grant, "org-1", "read_incident_health", "2026-10-06T11:59:59.999Z")).toBe(false);
    expect(canUseSupportAccess(grant, "org-1", "read_incident_health", "2026-10-06T12:30:00.000Z")).toBe(true);
  });

  it("rejects missing attribution/reason, unsupported scopes, invalid timestamps, and grants longer than one hour", () => {
    for (const invalid of [
      { ...validGrant, actorId: "" },
      { ...validGrant, reason: "" },
      { ...validGrant, scope: "write_candidate_score" },
      { ...validGrant, grantedAt: "not-a-date" },
      { ...validGrant, expiresAt: "2026-10-06T14:00:00.001Z" },
    ]) {
      expect(() => createSupportAccessGrant(invalid)).toThrow(/support access/i);
    }
  });
});
