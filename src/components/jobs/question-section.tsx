"use client";

import { useActionState } from "react";

import type { QuestionActionState } from "@/app/(app)/app/o/[organizationId]/jobs/[jobId]/question-actions";
import type { Competency } from "@/lib/interviewer/competencies";
import type { Question } from "@/lib/interviewer/questions";

type QuestionAction = (
  previousState: QuestionActionState,
  formData: FormData,
) => Promise<QuestionActionState>;

type QuestionSectionProps = Readonly<{
  questions: Question[];
  competencies: Competency[];
  readOnly?: boolean;
  action?: QuestionAction;
}>;

const initialState: QuestionActionState = { status: "idle", message: null };

async function unavailableAction(): Promise<QuestionActionState> {
  return {
    status: "error",
    message: "Question authoring is unavailable for this account.",
  };
}

function difficultyLabel(value: Question["difficulty"]): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function QuestionSection({
  questions,
  competencies,
  readOnly = false,
  action,
}: QuestionSectionProps) {
  const [state, formAction, pending] = useActionState(action ?? unavailableAction, initialState);
  const competencyNames = new Map(competencies.map((competency) => [competency.id, competency.name]));
  const nextPosition = questions.reduce((max, question) => Math.max(max, question.position), -1) + 1;
  const canAuthor = !readOnly && competencies.length > 0 && Boolean(action);

  return (
    <section className="space-y-5" aria-labelledby="question-bank-heading">
      <div>
        <h2 id="question-bank-heading" className="text-xl font-semibold text-slate-950">
          Question bank
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Keep interview questions job-related, observable, and tied to an explicit competency.
        </p>
      </div>

      {questions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          No interview questions have been added yet.
        </p>
      ) : (
        <ol className="space-y-3">
          {questions.map((question) => (
            <li key={question.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <p className="font-medium text-slate-950">{question.questionText}</p>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
                <span>Competency: {competencyNames.get(question.competencyId) ?? "Unknown competency"}</span>
                <span aria-hidden="true">·</span>
                <span>{difficultyLabel(question.difficulty)}</span>
                <span aria-hidden="true">·</span>
                <span>{question.isRequired ? "Required" : "Optional"}</span>
                <span aria-hidden="true">·</span>
                <span>{question.maxDurationSeconds}s max</span>
              </div>
              {question.expectedAreas.length > 0 ? (
                <p className="mt-2 text-sm text-slate-700">
                  Expected areas: {question.expectedAreas.join(", ")}
                </p>
              ) : null}
            </li>
          ))}
        </ol>
      )}

      {!readOnly && competencies.length === 0 ? (
        <p className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Add at least one competency before adding interview questions.
        </p>
      ) : null}

      {canAuthor ? (
        <form action={formAction} className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4">
          <label className="grid gap-1 text-sm font-medium text-slate-800">
            Competency
            <select
              name="competency_id"
              required
              defaultValue={competencies[0]?.id}
              className="rounded-md border border-slate-300 bg-white px-3 py-2"
            >
              {competencies.map((competency) => (
                <option key={competency.id} value={competency.id}>
                  {competency.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-800">
            Question text
            <textarea
              name="question_text"
              required
              rows={3}
              maxLength={4000}
              className="rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-800">
            Difficulty
            <select
              name="difficulty"
              defaultValue="medium"
              className="rounded-md border border-slate-300 bg-white px-3 py-2"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-800">
            Expected areas
            <textarea
              name="expected_areas"
              rows={3}
              placeholder="One expected area per line"
              className="rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-800">
            Follow-up hints
            <textarea
              name="follow_up_hints"
              rows={3}
              placeholder="One follow-up hint per line"
              className="rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-800">
            Maximum duration in seconds
            <input
              name="max_duration_seconds"
              type="number"
              min={1}
              max={3600}
              step={1}
              defaultValue={300}
              required
              className="rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="flex items-center gap-2 text-sm font-medium text-slate-800">
            <input name="is_required" type="checkbox" defaultChecked />
            Required question
          </label>

          <input name="position" type="number" value={nextPosition} readOnly hidden />

          {state.message ? (
            <p
              role={state.status === "error" ? "alert" : "status"}
              className={state.status === "error" ? "text-sm text-red-700" : "text-sm text-emerald-700"}
            >
              {state.message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={pending}
            className="w-fit rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Adding…" : "Add question"}
          </button>
        </form>
      ) : null}
    </section>
  );
}
