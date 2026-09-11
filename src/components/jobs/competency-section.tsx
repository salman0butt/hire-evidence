"use client";

import { useActionState } from "react";

import type { Competency } from "@/lib/interviewer/competencies";

export type CompetencyActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
}>;

type CompetencyAction = (
  previousState: CompetencyActionState,
  formData: FormData,
) => Promise<CompetencyActionState>;

type CompetencySectionProps = Readonly<{
  competencies: readonly Competency[];
  readOnly?: boolean;
  action?: CompetencyAction;
}>;

const idleState: CompetencyActionState = { status: "idle", message: null };

async function idleAction(state: CompetencyActionState): Promise<CompetencyActionState> {
  return state;
}

const inputClass =
  "w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10";

function nextPosition(competencies: readonly Competency[]): number {
  return competencies.reduce(
    (highest, competency) => Math.max(highest, competency.position),
    -1,
  ) + 1;
}

function RubricEditor({ competency }: Readonly<{ competency: Competency }>) {
  return (
    <fieldset className="mt-5 space-y-4 border-t border-zinc-200 pt-5">
      <legend className="text-sm font-semibold text-zinc-900">
        Observable scoring rubric
      </legend>
      <p className="text-xs leading-5 text-zinc-500">
        Describe job-related evidence an interviewer can directly observe at every score level.
      </p>

      <div className="grid gap-4">
        {[1, 2, 3, 4, 5].map((level) => {
          const inputId = `rubric-${competency.id}-level-${level}`;
          return (
            <div key={level} className="space-y-2">
              <label
                htmlFor={inputId}
                className="block text-sm font-medium text-zinc-800"
              >
                {competency.name} score {level}
              </label>
              <textarea
                id={inputId}
                name={`level_${level}`}
                rows={3}
                maxLength={2000}
                className={inputClass}
              />
            </div>
          );
        })}
      </div>

      <button
        type="button"
        aria-label={`Save ${competency.name} rubric`}
        className="rounded-xl bg-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-500"
        disabled
      >
        Save rubric
      </button>
      <p className="text-xs leading-5 text-zinc-500">
        Saving will be enabled after the server-side rubric action is connected and verified.
      </p>
    </fieldset>
  );
}

export function CompetencySection({
  competencies,
  readOnly = false,
  action = idleAction,
}: CompetencySectionProps) {
  const [state, formAction, pending] = useActionState(action, idleState);

  return (
    <section aria-labelledby="competencies-title" className="max-w-3xl space-y-6">
      <div className="space-y-2">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          Interview evidence
        </p>
        <h2
          id="competencies-title"
          className="text-2xl font-semibold tracking-tight text-zinc-950"
        >
          Competencies
        </h2>
        <p className="text-sm leading-6 text-zinc-600">
          Define job-related dimensions the interview should evaluate. Observable scoring rubrics are configured for every competency below.
        </p>
      </div>

      {competencies.length ? (
        <ul className="space-y-3" aria-label="Job competencies">
          {competencies.map((competency) => (
            <li
              key={competency.id}
              className="rounded-2xl border border-zinc-200 bg-white p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <h3 className="font-semibold text-zinc-950">{competency.name}</h3>
                  {competency.description ? (
                    <p className="text-sm leading-6 text-zinc-600">
                      {competency.description}
                    </p>
                  ) : null}
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                  Weight: {competency.weight}
                </span>
              </div>

              {!readOnly ? <RubricEditor competency={competency} /> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 px-5 py-6 text-sm text-zinc-600">
          No competencies have been defined for this job yet.
        </p>
      )}

      {!readOnly ? (
        <form
          action={formAction}
          className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"
          noValidate
        >
          <input type="hidden" name="position" value={nextPosition(competencies)} />

          <div className="space-y-2">
            <label
              htmlFor="competency-name"
              className="block text-sm font-medium text-zinc-800"
            >
              Competency name
            </label>
            <input
              id="competency-name"
              name="name"
              type="text"
              required
              maxLength={160}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="competency-description"
              className="block text-sm font-medium text-zinc-800"
            >
              Description
            </label>
            <textarea
              id="competency-description"
              name="description"
              maxLength={2000}
              rows={4}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="competency-weight"
              className="block text-sm font-medium text-zinc-800"
            >
              Weight
            </label>
            <input
              id="competency-weight"
              name="weight"
              type="number"
              required
              min="0.01"
              max="100"
              step="0.01"
              className={inputClass}
            />
            <p className="text-xs leading-5 text-zinc-500">
              Use a relative weight greater than 0 and at most 100. The platform does not silently normalize hiring criteria.
            </p>
          </div>

          {state.message ? (
            <p
              role={state.status === "success" ? "status" : "alert"}
              className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
            >
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Adding…" : "Add competency"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
