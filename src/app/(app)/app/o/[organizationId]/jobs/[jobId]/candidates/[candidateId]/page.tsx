import { createCandidateResultRepository } from "@/lib/review/candidate-result-repository";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";

type CandidateResultPageProps = Readonly<{
  params: Promise<{
    organizationId: string;
    jobId: string;
    candidateId: string;
  }>;
}>;

export default async function CandidateResultPage({
  params,
}: CandidateResultPageProps) {
  const { organizationId, jobId, candidateId } = await params;

  await requireOrganizationMembership(organizationId);

  const client = await createClient();
  const repository = createCandidateResultRepository(client);

  let result;

  try {
    result = await repository.getCandidateResult(
      organizationId,
      jobId,
      candidateId,
    );
  } catch {
    notFound();
  }

  return (
    <main className="space-y-8">
      <header className="space-y-2">
        <p className="text-sm text-neutral-600">{result.job_title}</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {result.candidate_name}
        </h1>
        <p className="max-w-2xl text-sm text-neutral-600">
          AI assessment supports independent human review; it is not a hiring
          decision.
        </p>
      </header>

      <dl className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border p-4">
          <dt className="text-sm font-medium text-neutral-600">
            Interview status
          </dt>
          <dd className="mt-1 text-base font-semibold">
            {result.interview_status}
          </dd>
        </div>
        <div className="rounded-lg border p-4">
          <dt className="text-sm font-medium text-neutral-600">
            Review status
          </dt>
          <dd className="mt-1 text-base font-semibold">
            {result.review_status}
          </dd>
        </div>
        <div className="rounded-lg border p-4">
          <dt className="text-sm font-medium text-neutral-600">
            Assessment generation
          </dt>
          <dd className="mt-1 text-base font-semibold">
            {result.generation_number}
          </dd>
        </div>
      </dl>
    </main>
  );
}
