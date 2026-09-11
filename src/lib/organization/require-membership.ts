import { notFound } from "next/navigation";

import {
  ORGANIZATION_ROLES,
  type OrganizationRole,
} from "@/lib/organization/rbac";
import { createClient } from "@/lib/supabase/server";

export type OrganizationContext = Readonly<{
  organizationId: string;
  organizationName: string;
  role: OrganizationRole;
}>;

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function isOrganizationRole(value: unknown): value is OrganizationRole {
  return (
    typeof value === "string" &&
    (ORGANIZATION_ROLES as readonly string[]).includes(value)
  );
}

type MembershipRow = Readonly<{
  role?: unknown;
  organization?: unknown;
}>;

type OrganizationRow = Readonly<{
  id?: unknown;
  name?: unknown;
}>;

export async function requireOrganizationMembership(
  organizationId: string,
): Promise<OrganizationContext> {
  if (!UUID_PATTERN.test(organizationId)) {
    notFound();
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("role,organization:organizations(id,name)")
    .eq("organization_id", organizationId)
    .maybeSingle();

  if (error || !data) {
    notFound();
  }

  const membership = data as MembershipRow;
  const organization = membership.organization as OrganizationRow | null;

  if (
    !isOrganizationRole(membership.role) ||
    !organization ||
    organization.id !== organizationId ||
    typeof organization.name !== "string" ||
    organization.name.trim().length === 0
  ) {
    notFound();
  }

  return {
    organizationId,
    organizationName: organization.name,
    role: membership.role,
  };
}
