import { redirect } from "next/navigation";

import { JobForm } from "@/components/jobs/job-form";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import { createJobAction } from "../job-actions";

type NewJobPageProps = Readonly<{
  params: Promise<{ organizationId: string }>;
}>;

export default async function NewJobPage({ params }: NewJobPageProps) {
  const { organizationId } = await params;
  const context = await requireOrganizationMembership(organizationId);

  if (!hasOrganizationCapability(context.role, "jobs:manage")) {
    redirect(`/app/o/${organizationId}/jobs`);
  }

  return (
    <JobForm
      mode="create"
      action={createJobAction.bind(null, organizationId)}
    />
  );
}
