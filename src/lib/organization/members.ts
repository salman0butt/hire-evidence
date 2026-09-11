import { ORGANIZATION_ROLES, type OrganizationRole } from "@/lib/organization/rbac";
import { createClient } from "@/lib/supabase/server";

export const MANAGEABLE_ORGANIZATION_ROLES = [
  "admin",
  "recruiter",
  "hiring_manager",
  "reviewer",
] as const satisfies readonly OrganizationRole[];

export type ManageableOrganizationRole =
  (typeof MANAGEABLE_ORGANIZATION_ROLES)[number];

export type OrganizationMember = Readonly<{
  userId: string;
  role: OrganizationRole;
}>;

function isOrganizationRole(value: unknown): value is OrganizationRole {
  return (
    typeof value === "string" &&
    (ORGANIZATION_ROLES as readonly string[]).includes(value)
  );
}

export function isManageableOrganizationRole(
  value: unknown,
): value is ManageableOrganizationRole {
  return (
    typeof value === "string" &&
    (MANAGEABLE_ORGANIZATION_ROLES as readonly string[]).includes(value)
  );
}

export async function listOrganizationMembers(
  organizationId: string,
): Promise<OrganizationMember[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organization_memberships")
    .select("user_id,role")
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: true })
    .order("user_id", { ascending: true });

  if (error) {
    throw new Error("Unable to load organization members.");
  }

  const members: OrganizationMember[] = [];
  for (const row of data ?? []) {
    if (typeof row.user_id !== "string" || !isOrganizationRole(row.role)) {
      throw new Error("Invalid organization membership data.");
    }
    members.push({ userId: row.user_id, role: row.role });
  }

  return members;
}

export async function updateOrganizationMemberRole(input: {
  organizationId: string;
  userId: string;
  role: ManageableOrganizationRole;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("update_organization_member_role", {
    p_organization_id: input.organizationId,
    p_user_id: input.userId,
    p_role: input.role,
  });

  if (error) throw new Error("Unable to update organization member.");
}

export async function removeOrganizationMember(input: {
  organizationId: string;
  userId: string;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("remove_organization_member", {
    p_organization_id: input.organizationId,
    p_user_id: input.userId,
  });

  if (error) throw new Error("Unable to remove organization member.");
}
