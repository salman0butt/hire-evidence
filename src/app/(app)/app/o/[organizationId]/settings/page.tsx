import { OrganizationSettingsForm } from "@/components/organization/organization-settings-form";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";
import { getOrganization } from "@/lib/organization/repository";

import { updateOrganizationSettingsAction } from "./actions";

type OrganizationSettingsPageProps = Readonly<{
  params: Promise<{ organizationId: string }>;
}>;

export default async function OrganizationSettingsPage({
  params,
}: OrganizationSettingsPageProps) {
  const { organizationId } = await params;
  const context = await requireOrganizationMembership(organizationId);
  const organization = await getOrganization(organizationId);
  const canUpdate = hasOrganizationCapability(
    context.role,
    "organization:update",
  );

  return (
    <OrganizationSettingsForm
      organization={organization}
      canUpdate={canUpdate}
      action={updateOrganizationSettingsAction.bind(null, organizationId)}
    />
  );
}
