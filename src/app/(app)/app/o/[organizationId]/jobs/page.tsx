import { JobList } from "@/components/jobs/job-list";
import { listJobs } from "@/lib/jobs/jobs";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

type JobsPageProps = Readonly<{
  params: Promise<{ organizationId: string }>;
}>;

export default async function JobsPage({ params }: JobsPageProps) {
  const { organizationId } = await params;
  const context = await requireOrganizationMembership(organizationId);
  const jobs = await listJobs(organizationId);
  const canManage = hasOrganizationCapability(context.role, "jobs:manage");

  return (
    <JobList
      organizationId={organizationId}
      jobs={jobs}
      canManage={canManage}
    />
  );
}
