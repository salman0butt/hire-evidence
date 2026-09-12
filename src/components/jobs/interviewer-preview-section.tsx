"use client";

import { useActionState } from "react";

export type InterviewerPreviewSummary = Readonly<{
  interviewerName: string;
  jobTitle: string;
  questionCount: number;
  sectionCount: number;
  billable: false;
  persisted: false;
}>;

export type InterviewerPreviewActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
  preview: InterviewerPreviewSummary | null;
}>;

type InterviewerPreviewAction = (
  previousState: InterviewerPreviewActionState,
  formData: FormData,
) => Promise<InterviewerPreviewActionState>;

type InterviewerPreviewSectionProps = Readonly<{
  action: InterviewerPreviewAction;
}>;

const initialState: InterviewerPreviewActionState = {
  status: "idle",
  message: null,
  preview: null,
};

export function InterviewerPreviewSection({
  action,
}: InterviewerPreviewSectionProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <section className="space-y-4" aria-labelledby="interviewer-preview-heading">
      <div>
        <h2
          id="interviewer-preview-heading"
          className="text-xl font-semibold text-slate-950"
        >
          Simulated interviewer preview
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          This uses the same validated configuration composition as publication,
          but does not create a candidate interview, assessment evidence, or
          billable usage.
        </p>
      </div>

      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Generating preview…" : "Generate simulated preview"}
        </button>
      </form>

      {state.message ? (
        <p
          aria-live="polite"
          className={
            state.status === "error"
              ? "text-sm text-red-700"
              : "text-sm text-slate-700"
          }
        >
          {state.message}
        </p>
      ) : null}

      {state.preview ? (
        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap gap-2 text-xs font-medium text-slate-700">
            <span className="rounded-full bg-slate-100 px-2.5 py-1">Simulated</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1">Non-billable</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1">Not persisted</span>
          </div>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-500">Interviewer</dt>
              <dd className="text-slate-950">{state.preview.interviewerName}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Job</dt>
              <dd className="text-slate-950">{state.preview.jobTitle}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Questions</dt>
              <dd className="text-slate-950">{state.preview.questionCount}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Sections</dt>
              <dd className="text-slate-950">{state.preview.sectionCount}</dd>
            </div>
          </dl>
        </div>
      ) : null}
    </section>
  );
}
