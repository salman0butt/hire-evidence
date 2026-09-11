import type { ReactNode } from "react";

import { TenantNavigation } from "@/components/organization/tenant-navigation";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

type TenantLayoutProps = Readonly<{
  children: ReactNode;
  params: Promise<{ organizationId: string }>;
}>;

export default async function TenantLayout({
  children,
  params,
}: TenantLayoutProps) {
  const { organizationId } = await params;
  const organization = await requireOrganizationMembership(organizationId);

  return (
    <div className="space-y-6">
      <TenantNavigation {...organization} />
      {children}
    </div>
  );
}
