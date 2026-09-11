export const ORGANIZATION_ROLES = [
  "owner",
  "admin",
  "recruiter",
  "hiring_manager",
  "reviewer",
] as const;

export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];

export const ORGANIZATION_CAPABILITIES = [
  "organization:view",
  "organization:update",
  "team:view",
  "team:invite",
  "team:manage_roles",
] as const;

export type OrganizationCapability =
  (typeof ORGANIZATION_CAPABILITIES)[number];

const MEMBER_CAPABILITIES = new Set<OrganizationCapability>([
  "organization:view",
  "team:view",
]);

export function hasOrganizationCapability(
  role: OrganizationRole,
  capability: OrganizationCapability,
): boolean {
  if (role === "owner" || role === "admin") {
    return true;
  }

  return MEMBER_CAPABILITIES.has(capability);
}
