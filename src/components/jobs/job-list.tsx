import Link from "next/link";

import type { Job } from "@/lib/jobs/jobs";

type JobListProps = Readonly<{
  organizationId: string;
  jobs: readonly Job[];
  canManage: boolean;
}>;

export function JobList({ organizationId, jobs, canManage }: JobListProps) {
  const createHref = `/app/o/${organizationId}/jobs/new`;

  if (jobs.length === 0) {
    return (
      <section aria-labelledby="jobs-title" className="space-y-5">
        <div className="space-y-2">
          <h1 id="jobs-title" className="text-3xl font-semibold tracking-tight text-zinc-950">
            Jobs
          </h1>
          <p className="text-sm leading-6 text-zinc-600">No jobs yet.</p>
        </div>
        {canManage ? (
          <Link href={createHref} className="inline-flex rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white">
            Create job
          </Link>
        ) : null}
      </section>
    );
  }

  return (
    <section aria-labelledby="jobs-title" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2">
          <h1 id="jobs-title" className="text-3xl font-semibold tracking-tight text-zinc-950">Jobs</h1>
          <p className="text-sm leading-6 text-zinc-600">Job-related evidence criteria remain explicit and reviewable.</p>
        </div>
        {canManage ? (
          <Link href={createHref} className="inline-flex rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white">Create job</Link>
        ) : null}
      </div>

      <ul className="grid gap-4">
        {jobs.map((job) => {
          const mustHaveCount = job.requirements.filter((item) => item.kind === "must_have").length;
          const niceToHaveCount = job.requirements.filter((item) => item.kind === "nice_to_have").length;
          const href = `/app/o/${organizationId}/jobs/${job.id}`;
          return (
            <li key={job.id} className="rounded-2xl border border-zinc-200 bg-white p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0 space-y-2">
                  <h2 className="break-words text-xl font-semibold text-zinc-950">{job.title}</h2>
                  {job.department ? <p className="text-sm text-zinc-600">{job.department}</p> : null}
                  <div className="flex flex-wrap gap-3 text-xs font-medium text-zinc-600">
                    <span>Must-have: {mustHaveCount}</span>
                    <span>Nice-to-have: {niceToHaveCount}</span>
                  </div>
                </div>
                <Link href={href} className="rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-900">
                  {canManage ? `Edit ${job.title}` : `View ${job.title}`}
                </Link>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
