"use client";

import { useActionState } from "react";

import type { InterviewerPublishActionState } from "@/app/(app)/app/o/[organizationId]/jobs/[jobId]/interviewer-publish-actions";

type InterviewerPublishAction = (
  previousState: InterviewerPublishActionState,
  formData: FormData,
) => Promise<InterviewerPublishActionState>;

type InterviewerPublicationSectionProps = Readonly<{
  status: "draft" | "published";
  publishedAt: string | null;
  readOnly?: boolean;
  action?: InterviewerPublishAction;
}>;

const initialActionState: InterviewerPublishActionState = {
  status: "idle",
  message: null,
  versionId: null,
};

async function unavailableAction(): Promise<InterviewerPublishActionState> {
  return {
    status: "error",
    message: "Publishing is unavailable for this account.",
    versionId: null,
  };
}

export function InterviewerPublicationSection({
  status,
  publishedAt,
  readOnly = false,
  action,
}: InterviewerPublicationSectionProps) {
  const [state, formAction, pending] = useActionState(
    action ?? unavailableAction,
    initialActionState,
  );

  const published = status === "published";

  return (
    <section className="space-y-3" aria-labelledby="interviewer-publication-heading">
      <div>
        <h2 id="interviewer-publication-heading" className="text-xl font-semibold text-slate-950">
          Publication
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Publishing validates the complete interviewer configuration and creates an immutable version for later interview attempts.
        </p>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm font-semibold text-slate-950">
          Status: {published ? "Published" : "Draft"}
        </p>
        {published && publishedAt ? (
          <p className="mt-1 text-sm text-slate-600">
            Published {new Date(publishedAt).toLocaleString()}.
          </p>
        ) : null}

        {state.message ? (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className={state.status === "error" ? "mt-3 text-sm text-red-700" : "mt-3 text-sm text-emerald-700"}
          >
            {state.message}
          </p>
        ) : null}

        {!readOnly && !published ? (
          <form action={formAction} className="mt-4">
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? "Publishing…" : "Publish interviewer configuration"}
            </button>
          </form>
        ) : null}
      </div>
    </section>
  );
}
