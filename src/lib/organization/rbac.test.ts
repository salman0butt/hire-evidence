import { describe, expect, it } from "vitest";

import {
  ORGANIZATION_CAPABILITIES,
  ORGANIZATION_ROLES,
  hasOrganizationCapability,
  type OrganizationCapability,
  type OrganizationRole,
} from "./rbac";

const adminCapabilities: readonly OrganizationCapability[] = [
  "organization:view",
  "organization:update",
  "team:view",
  "team:invite",
  "team:manage_roles",
  "jobs:view",
  "jobs:manage",
];

const memberCapabilities: readonly OrganizationCapability[] = [
  "organization:view",
  "team:view",
  "jobs:view",
];

describe("organization RBAC", () => {
  it("exposes exactly the fixed milestone roles and capabilities", () => {
    expect(ORGANIZATION_ROLES).toEqual([
      "owner",
      "admin",
      "recruiter",
      "hiring_manager",
      "reviewer",
    ]);
    expect(ORGANIZATION_CAPABILITIES).toEqual(adminCapabilities);
  });

  it.each(["owner", "admin"] satisfies readonly OrganizationRole[])(
    "%s can use every organization-management capability",
    (role) => {
      for (const capability of adminCapabilities) {
        expect(hasOrganizationCapability(role, capability)).toBe(true);
      }
    },
  );

  it("recruiter can manage jobs without receiving organization/team administration", () => {
    expect(hasOrganizationCapability("recruiter", "jobs:view")).toBe(true);
    expect(hasOrganizationCapability("recruiter", "jobs:manage")).toBe(true);
    expect(hasOrganizationCapability("recruiter", "organization:update")).toBe(false);
    expect(hasOrganizationCapability("recruiter", "team:invite")).toBe(false);
    expect(hasOrganizationCapability("recruiter", "team:manage_roles")).toBe(false);
  });

  it.each([
    "hiring_manager",
    "reviewer",
  ] satisfies readonly OrganizationRole[])(
    "%s can view jobs but cannot manage them or organization settings",
    (role) => {
      for (const capability of ORGANIZATION_CAPABILITIES) {
        expect(hasOrganizationCapability(role, capability)).toBe(
          memberCapabilities.includes(capability),
        );
      }
    },
  );
});
