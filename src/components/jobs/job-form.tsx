"use client";

import { useActionState } from "react";

import type { Job } from "@/lib/jobs/jobs";

export type JobActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
}>;

type JobAction = (
  previousState: JobActionState,
  formData: FormData,
) => Promise<JobActionState>;

type JobFormProps = Readonly<{
  mode: "create" | "edit";
  initialJob?: Job;
  readOnly?: boolean;
  action?: JobAction;
  message?: string;
  messageRole?: "alert" | "status";
}>;

const idleState: JobActionState = { status: "idle", message: null };

async function idleAction(state: JobActionState): Promise<JobActionState> {
  return state;
}

function requirementsText(job: Job | undefined, kind: "must_have" | "nice_to_have") {
  return job?.requirements
    .filter((requirement) => requirement.kind === kind)
    .map((requirement) => requirement.requirement)
    .join("\n") ?? "";
}

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-600";

export function JobForm({
  mode,
  initialJob,
  readOnly = false,
  action = idleAction,
  message,
  messageRole,
}: JobFormProps) {
  const [state, formAction, pending] = useActionState(action, idleState);
  const activeMessage = message ?? state.message ?? null;
  const role = messageRole ?? (state.status === "success" ? "status" : "alert");
  const editing = mode === "edit";

  return (
    <section aria-labelledby="job-form-title" className="max-w-3xl space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          Job configuration
        </p>
        <h1
          id="job-form-title"
          className="text-3xl font-semibold tracking-tight text-zinc-950"
        >
          {editing ? "Edit job" : "Create job"}
        </h1>
        <p className="text-sm leading-6 text-zinc-600">
          Define only job-related criteria. Must-have and nice-to-have requirements stay distinct throughout interview configuration.
        </p>
      </div>

      <form
        action={formAction}
        className="space-y-6 rounded-2xl border border-zinc-200 bg-white p-6"
        noValidate
      >
        <div className="space-y-2">
          <label htmlFor="job-title" className="block text-sm font-medium text-zinc-800">
            Job title
          </label>
          <input
            id="job-title"
            name="title"
            type="text"
            required
            maxLength={160}
            defaultValue={initialJob?.title ?? ""}
            disabled={readOnly}
            className={inputClass}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="job-department" className="block text-sm font-medium text-zinc-800">
              Department
            </label>
            <input id="job-department" name="department" type="text" maxLength={120} defaultValue={initialJob?.department ?? ""} disabled={readOnly} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label htmlFor="job-seniority" className="block text-sm font-medium text-zinc-800">
              Seniority
            </label>
            <input id="job-seniority" name="seniority" type="text" maxLength={80} defaultValue={initialJob?.seniority ?? ""} disabled={readOnly} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label htmlFor="job-employment-type" className="block text-sm font-medium text-zinc-800">
              Employment type
            </label>
            <input id="job-employment-type" name="employment_type" type="text" maxLength={80} defaultValue={initialJob?.employmentType ?? ""} disabled={readOnly} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label htmlFor="job-location" className="block text-sm font-medium text-zinc-800">
              Location
            </label>
            <input id="job-location" name="location" type="text" maxLength={160} defaultValue={initialJob?.location ?? ""} disabled={readOnly} className={inputClass} />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <label htmlFor="job-salary-range" className="block text-sm font-medium text-zinc-800">
              Salary range
            </label>
            <input id="job-salary-range" name="salary_range" type="text" maxLength={160} defaultValue={initialJob?.salaryRange ?? ""} disabled={readOnly} className={inputClass} />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="job-description" className="block text-sm font-medium text-zinc-800">
            Description
          </label>
          <textarea id="job-description" name="description" maxLength={10000} rows={6} defaultValue={initialJob?.description ?? ""} disabled={readOnly} className={inputClass} />
        </div>

        <div className="space-y-2">
          <label htmlFor="job-responsibilities" className="block text-sm font-medium text-zinc-800">
            Responsibilities
          </label>
          <textarea id="job-responsibilities" name="responsibilities" maxLength={10000} rows={6} defaultValue={initialJob?.responsibilities ?? ""} disabled={readOnly} className={inputClass} />
        </div>

        <fieldset className="space-y-5 rounded-xl border border-zinc-200 p-4">
          <legend className="px-1 text-sm font-semibold text-zinc-900">Requirements</legend>
          <p className="text-xs leading-5 text-zinc-500">
            Put one requirement on each line. Criteria should describe evidence relevant to this job only.
          </p>
          <div className="space-y-2">
            <label htmlFor="job-must-have-requirements" className="block text-sm font-medium text-zinc-800">
              Must-have requirements
            </label>
            <textarea id="job-must-have-requirements" name="must_have_requirements" rows={5} defaultValue={requirementsText(initialJob, "must_have")} disabled={readOnly} className={inputClass} />
          </div>
          <div className="space-y-2">
            <label htmlFor="job-nice-to-have-requirements" className="block text-sm font-medium text-zinc-800">
              Nice-to-have requirements
            </label>
            <textarea id="job-nice-to-have-requirements" name="nice_to_have_requirements" rows={5} defaultValue={requirementsText(initialJob, "nice_to_have")} disabled={readOnly} className={inputClass} />
          </div>
        </fieldset>

        <div className="space-y-2">
          <label htmlFor="job-interview-instructions" className="block text-sm font-medium text-zinc-800">
            Interview instructions
          </label>
          <textarea id="job-interview-instructions" name="interview_instructions" maxLength={5000} rows={5} defaultValue={initialJob?.interviewInstructions ?? ""} disabled={readOnly} className={inputClass} />
          <p className="text-xs leading-5 text-zinc-500">
            Organization instructions are treated as untrusted input and cannot override platform safety or fairness policy.
          </p>
        </div>

        {activeMessage ? (
          <p role={role} className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
            {activeMessage}
          </p>
        ) : null}

        {!readOnly ? (
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Saving…" : editing ? "Save changes" : "Create job"}
          </button>
        ) : null}
      </form>
    </section>
  );
}
