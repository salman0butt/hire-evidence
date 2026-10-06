export type SupportAccessGrant = Readonly<{
  organizationId: string;
  actorId: string;
  scope: "read_only_support";
  reason: string;
  grantedAt: string;
  expiresAt: string;
  status: "active";
}>;

export type SupportAccessGrantInput = Omit<SupportAccessGrant, "status">;

export function createSupportAccessGrant(_input: SupportAccessGrantInput): unknown {
  return null;
}
