import Link from "next/link";

import {
  hasOrganizationCapability,
  type OrganizationRole,
} from "@/lib/organization/rbac";

type TenantNavigationProps = Readonly<{
  organizationId: string;
  organizationName: string;
  role: OrganizationRole;
}>;

function formatRole(role: OrganizationRole): string {
  return role.replaceAll("_", " ");
}

export function TenantNavigation({
  organizationId,
  organizationName,
  role,
}: TenantNavigationProps) {
  const basePath = `/app/o/${organizationId}`;

  return (
    <nav
      aria-label="Organization navigation"
      className="rounded-2xl border border-zinc-200 bg-white p-4"
    >
      <div className="mb-4 space-y-1">
        <p className="font-semibold text-zinc-950">{organizationName}</p>
        <p className="text-xs capitalize text-zinc-500">{formatRole(role)}</p>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link
          href={basePath}
          className="rounded-lg px-3 py-2 font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
        >
          Overview
        </Link>

        {hasOrganizationCapability(role, "team:view") ? (
          <Link
            href={`${basePath}/team`}
            className="rounded-lg px-3 py-2 font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
          >
            Team
          </Link>
        ) : null}

        {hasOrganizationCapability(role, "organization:update") ? (
          <Link
            href={`${basePath}/settings`}
            className="rounded-lg px-3 py-2 font-medium text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950"
          >
            Settings
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
