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

function formatEvidenceSufficiency(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

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

      <section aria-labelledby="competency-review-title" className="space-y-5">
        <div className="space-y-2">
          <h2
            id="competency-review-title"
            className="text-2xl font-semibold tracking-tight"
          >
            Competency review
          </h2>
          <p className="max-w-2xl text-sm leading-6 text-neutral-600">
            Review the AI assessment against its cited interview evidence. Scores
            and rationale are review inputs, not hiring recommendations.
          </p>
        </div>

        <ul className="grid gap-4 lg:grid-cols-2" aria-label="Competency assessments">
          {result.review_competencies.map((competency) => {
            const headingId = `competency-${competency.competencyId}`;

            return (
              <li key={competency.competencyId}>
                <article
                  aria-labelledby={headingId}
                  className="h-full space-y-5 rounded-xl border border-neutral-200 bg-white p-5"
                >
                  <div className="space-y-1">
                    <h3 id={headingId} className="text-lg font-semibold">
                      {competency.name}
                    </h3>
                    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                      AI assessment
                    </p>
                  </div>

                  <dl className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                        AI score
                      </dt>
                      <dd className="mt-1 font-semibold">
                        {competency.score === null
                          ? "Insufficient evidence"
                          : `${competency.score} / 5`}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs font-medium uppercase tracking-wide text-neutral-500">
                        Evidence sufficiency
                      </dt>
                      <dd className="mt-1 font-semibold">
                        {formatEvidenceSufficiency(competency.evidenceSufficiency)}
                      </dd>
                    </div>
                  </dl>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Rationale</h4>
                    <p className="text-sm leading-6 text-neutral-700">
                      {competency.rationale}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold">Supporting evidence</h4>
                    {competency.evidence.length ? (
                      <ol className="space-y-3">
                        {competency.evidence.map((citation) => (
                          <li
                            key={`${citation.messageSequence}-${citation.excerpt}`}
                            className="rounded-lg bg-neutral-50 p-3"
                          >
                            <p className="text-xs font-semibold uppercase tracking-wide text-neutral-500">
                              Turn {citation.messageSequence}
                            </p>
                            <blockquote className="mt-1 text-sm leading-6 text-neutral-700">
                              {citation.excerpt}
                            </blockquote>
                          </li>
                        ))}
                      </ol>
                    ) : (
                      <p className="text-sm leading-6 text-neutral-600">
                        No validated evidence citation was available for this competency.
                      </p>
                    )}
                  </div>
                </article>
              </li>
            );
          })}
        </ul>
      </section>
    </main>
  );
}
