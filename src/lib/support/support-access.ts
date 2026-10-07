export const SUPPORT_ACCESS_SCOPES = ["read_incident_health"] as const;

export type SupportAccessScope = (typeof SUPPORT_ACCESS_SCOPES)[number];

export type SupportAccessGrant = Readonly<{
  organizationId: string;
  actorId: string;
  reason: string;
  scope: SupportAccessScope;
  grantedAt: string;
  expiresAt: string;
}>;

const MAX_SUPPORT_ACCESS_MS = 60 * 60 * 1000;

function parseSupportAccessTime(value: string): number {
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) {
    throw new Error("Invalid support access timestamp");
  }
  return timestamp;
}

export function createSupportAccessGrant(input: {
  organizationId: string;
  actorId: string;
  reason: string;
  scope: string;
  grantedAt: string;
  expiresAt: string;
}): SupportAccessGrant {
  if (!input.organizationId.trim() || !input.actorId.trim() || !input.reason.trim()) {
    throw new Error("Support access requires organization, actor, and reason attribution");
  }

  if (!SUPPORT_ACCESS_SCOPES.includes(input.scope as SupportAccessScope)) {
    throw new Error("Unsupported support access scope");
  }

  const grantedAt = parseSupportAccessTime(input.grantedAt);
  const expiresAt = parseSupportAccessTime(input.expiresAt);
  const lifetime = expiresAt - grantedAt;

  if (lifetime <= 0 || lifetime > MAX_SUPPORT_ACCESS_MS) {
    throw new Error("Support access must expire within one hour of grant");
  }

  return Object.freeze({
    organizationId: input.organizationId,
    actorId: input.actorId,
    reason: input.reason,
    scope: input.scope as SupportAccessScope,
    grantedAt: input.grantedAt,
    expiresAt: input.expiresAt,
  });
}

export function canUseSupportAccess(
  grant: SupportAccessGrant,
  organizationId: string,
  scope: string,
  at: string,
): boolean {
  if (grant.organizationId !== organizationId || grant.scope !== scope) {
    return false;
  }

  const atTime = Date.parse(at);
  const grantedAt = Date.parse(grant.grantedAt);
  const expiresAt = Date.parse(grant.expiresAt);

  if (![atTime, grantedAt, expiresAt].every(Number.isFinite)) {
    return false;
  }

  return atTime >= grantedAt && atTime < expiresAt;
}
