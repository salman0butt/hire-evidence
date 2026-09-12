import { CompetencySection } from "@/components/jobs/competency-section";
import { InterviewPlanSection } from "@/components/jobs/interview-plan-section";
import { JobForm } from "@/components/jobs/job-form";
import { QuestionSection } from "@/components/jobs/question-section";
import { listCompetencies } from "@/lib/interviewer/competencies";
import { getInterviewPlan } from "@/lib/interviewer/interview-plans";
import { listQuestions } from "@/lib/interviewer/questions";
import { getJob } from "@/lib/jobs/jobs";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import { updateJobAction } from "../job-actions";
import {
  createCompetencyAction,
  saveCompetencyRubricAction,
} from "./competency-actions";
import { saveInterviewPlanAction } from "./interview-plan-actions";
import { createQuestionAction } from "./question-actions";

type JobPageProps = Readonly<{
  params: Promise<{ organizationId: string; jobId: string }>;
}>;

const MAX_INTERVIEW_DURATION_SECONDS = 3600;

export default async function JobPage({ params }: JobPageProps) {
  const { organizationId, jobId } = await params;
  const context = await requireOrganizationMembership(organizationId);
  const [job, competencies, questions, interviewPlan] = await Promise.all([
    getJob(organizationId, jobId),
    listCompetencies(organizationId, jobId),
    listQuestions(organizationId, jobId),
    getInterviewPlan(organizationId, jobId),
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

      {canManage ? (
        <QuestionSection
          questions={questions}
          competencies={competencies}
          action={createQuestionAction.bind(null, organizationId, jobId)}
        />
      ) : (
        <QuestionSection questions={questions} competencies={competencies} readOnly />
      )}

      {canManage ? (
        <InterviewPlanSection
          questions={questions}
          competencies={competencies}
          maxTotalDurationSeconds={MAX_INTERVIEW_DURATION_SECONDS}
          initialPlan={interviewPlan ?? undefined}
          action={saveInterviewPlanAction.bind(null, organizationId, jobId)}
        />
      ) : (
        <InterviewPlanSection
          questions={questions}
          competencies={competencies}
          maxTotalDurationSeconds={MAX_INTERVIEW_DURATION_SECONDS}
          initialPlan={interviewPlan ?? undefined}
          readOnly
        />
      )}
    </div>
  );
}
