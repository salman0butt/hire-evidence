import { InviteForm } from "@/components/organization/invite-form";
import { TeamInvitations } from "@/components/organization/team-invitations";
import { TeamMembers } from "@/components/organization/team-members";
import { listPendingOrganizationInvitations } from "@/lib/organization/invitations";
import { listOrganizationMembers } from "@/lib/organization/members";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import {
  createInvitationAction,
  revokeInvitationAction,
} from "./invite-actions";
import { removeMemberAction, updateMemberRoleAction } from "./actions";

type TeamPageProps = Readonly<{
  params: Promise<{ organizationId: string }>;
}>;

export default async function TeamPage({ params }: TeamPageProps) {
  const { organizationId } = await params;
  const organization = await requireOrganizationMembership(organizationId);
  const members = await listOrganizationMembers(organizationId);
  const canManage = hasOrganizationCapability(
    organization.role,
    "team:manage_roles",
  );
  const canInvite = hasOrganizationCapability(organization.role, "team:invite");
  const invitations = canInvite
    ? await listPendingOrganizationInvitations(organizationId)
    : [];

  return (
    <div className="space-y-8">
      <TeamMembers
        members={members}
        canManage={canManage}
        updateAction={updateMemberRoleAction.bind(null, organizationId)}
        removeAction={removeMemberAction.bind(null, organizationId)}
      />

      {canInvite ? (
        <>
          <InviteForm action={createInvitationAction.bind(null, organizationId)} />
          <TeamInvitations
            invitations={invitations}
            revokeAction={revokeInvitationAction.bind(null, organizationId)}
          />
        </>
      ) : null}
    </div>
  );
}
