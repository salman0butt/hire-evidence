import { TeamMembers } from "@/components/organization/team-members";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { listOrganizationMembers } from "@/lib/organization/members";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import { removeMemberAction, updateMemberRoleAction } from "./actions";

type TeamPageProps = Readonly<{
  params: Promise<{ organizationId: string }>;
}>;

export default async function TeamPage({ params }: TeamPageProps) {
  const { organizationId } = await params;
  const organization = await requireOrganizationMembership(organizationId);
  const members = await listOrganizationMembers(organizationId);

  return (
    <TeamMembers
      members={members}
      canManage={hasOrganizationCapability(
        organization.role,
        "team:manage_roles",
      )}
      updateAction={updateMemberRoleAction.bind(null, organizationId)}
      removeAction={removeMemberAction.bind(null, organizationId)}
    />
  );
}
