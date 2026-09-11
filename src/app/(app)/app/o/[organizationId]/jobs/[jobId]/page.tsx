import { CompetencySection } from "@/components/jobs/competency-section";
import { JobForm } from "@/components/jobs/job-form";
import { listCompetencies } from "@/lib/interviewer/competencies";
import { getJob } from "@/lib/jobs/jobs";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import { updateJobAction } from "../job-actions";
import {
  createCompetencyAction,
  saveCompetencyRubricAction,
} from "./competency-actions";

type JobPageProps = Readonly<{
  params: Promise<{ organizationId: string; jobId: string }>;
}>;

export default async function JobPage({ params }: JobPageProps) {
  const { organizationId, jobId } = await params;
  const context = await requireOrganizationMembership(organizationId);
  const [job, competencies] = await Promise.all([
    getJob(organizationId, jobId),
    listCompetencies(organizationId, jobId),
  ]);
  const canManage = hasOrganizationCapability(context.role, "jobs:manage");

  return (
    <div className="space-y-10">
      {canManage ? (
        <JobForm
          mode="edit"
          initialJob={job}
          action={updateJobAction.bind(null, organizationId, jobId)}
        />
      ) : (
        <JobForm mode="edit" initialJob={job} readOnly />
      )}

      {canManage ? (
        <CompetencySection
          competencies={competencies}
          action={createCompetencyAction.bind(null, organizationId, jobId)}
          rubricAction={saveCompetencyRubricAction.bind(null, organizationId, jobId)}
        />
      ) : (
        <CompetencySection competencies={competencies} readOnly />
      )}
    </div>
  );
}
