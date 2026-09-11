export const ORGANIZATION_ROLES = [
  "owner",
  "admin",
  "recruiter",
  "hiring_manager",
  "reviewer",
] as const;

export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];

export const MANAGEABLE_ORGANIZATION_ROLES = [
  "admin",
  "recruiter",
  "hiring_manager",
  "reviewer",
] as const satisfies readonly OrganizationRole[];

export type ManageableOrganizationRole =
  (typeof MANAGEABLE_ORGANIZATION_ROLES)[number];

export function isManageableOrganizationRole(
  value: unknown,
): value is ManageableOrganizationRole {
  return (
    typeof value === "string" &&
    (MANAGEABLE_ORGANIZATION_ROLES as readonly string[]).includes(value)
  );
}

export const ORGANIZATION_CAPABILITIES = [
  "organization:view",
  "organization:update",
  "team:view",
  "team:invite",
  "team:manage_roles",
  "jobs:view",
  "jobs:manage",
] as const;

export type OrganizationCapability =
  (typeof ORGANIZATION_CAPABILITIES)[number];

const MEMBER_CAPABILITIES = new Set<OrganizationCapability>([
  "organization:view",
  "team:view",
  "jobs:view",
]);

export function hasOrganizationCapability(
  role: OrganizationRole,
  capability: OrganizationCapability,
): boolean {
  if (role === "owner" || role === "admin") {
    return true;
  }

  if (role === "recruiter" && capability === "jobs:manage") {
    return true;
  }

  return MEMBER_CAPABILITIES.has(capability);
}
