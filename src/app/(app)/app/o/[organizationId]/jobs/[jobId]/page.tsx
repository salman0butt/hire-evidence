import { JobForm } from "@/components/jobs/job-form";
import { getJob } from "@/lib/jobs/jobs";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import { updateJobAction } from "../job-actions";

type JobPageProps = Readonly<{
  params: Promise<{ organizationId: string; jobId: string }>;
}>;

export default async function JobPage({ params }: JobPageProps) {
  const { organizationId, jobId } = await params;
  const context = await requireOrganizationMembership(organizationId);
  const job = await getJob(organizationId, jobId);
  const canManage = hasOrganizationCapability(context.role, "jobs:manage");

  return (
    <JobForm
      mode="edit"
      initialJob={job}
      readOnly={!canManage}
      action={canManage ? updateJobAction.bind(null, organizationId, jobId) : undefined}
    />
  );
}
