"use client";

import { useActionState, useMemo, useState } from "react";

import type { Competency } from "@/lib/interviewer/competencies";
import type { InterviewPlanInput } from "@/lib/interviewer/interview-plan-validation";
import type { Question } from "@/lib/interviewer/questions";

export type InterviewPlanActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
}>;

type InterviewPlanAction = (
  previousState: InterviewPlanActionState,
  formData: FormData,
) => Promise<InterviewPlanActionState>;

type DraftSection = Readonly<{
  purpose: string;
  durationSeconds: number;
  questionIds: string[];
  competencyIds: string[];
}>;

type InterviewPlanSectionProps = Readonly<{
  questions: Question[];
  competencies: Competency[];
  maxTotalDurationSeconds: number;
  initialPlan?: InterviewPlanInput;
  readOnly?: boolean;
  action?: InterviewPlanAction;
}>;

const initialActionState: InterviewPlanActionState = {
  status: "idle",
  message: null,
};

async function unavailableAction(): Promise<InterviewPlanActionState> {
  return {
    status: "error",
    message: "Interview plan editing is unavailable for this account.",
  };
}

function defaultDuration(maximum: number): number {
  return Math.max(1, Math.min(300, maximum));
}

function initialSections(
  initialPlan: InterviewPlanInput | undefined,
  maximum: number,
): DraftSection[] {
  if (initialPlan?.sections.length) {
    return initialPlan.sections.map((section) => ({
      purpose: section.purpose,
      durationSeconds: section.durationSeconds,
      questionIds: [...section.questionIds],
      competencyIds: [...section.competencyIds],
    }));
  }

  return [
    {
      purpose: "",
      durationSeconds: defaultDuration(maximum),
      questionIds: [],
      competencyIds: [],
    },
  ];
}

export function InterviewPlanSection({
  questions,
  competencies,
  maxTotalDurationSeconds,
  initialPlan,
  readOnly = false,
  action,
}: InterviewPlanSectionProps) {
  const [sections, setSections] = useState<DraftSection[]>(() =>
    initialSections(initialPlan, maxTotalDurationSeconds),
  );
  const [state, formAction, pending] = useActionState(
    action ?? unavailableAction,
    initialActionState,
  );

  const plan = useMemo<InterviewPlanInput>(
    () => ({
      totalDurationSeconds: sections.reduce(
        (total, section) => total + section.durationSeconds,
        0,
      ),
      sections: sections.map((section, position) => ({
        ...section,
        position,
      })),
    }),
    [sections],
  );

  function updateSection(index: number, patch: Partial<DraftSection>) {
    setSections((current) =>
      current.map((section, sectionIndex) =>
        sectionIndex === index ? { ...section, ...patch } : section,
      ),
    );
  }

  function toggleSectionId(
    index: number,
    field: "questionIds" | "competencyIds",
    id: string,
  ) {
    setSections((current) =>
      current.map((section, sectionIndex) => {
        if (sectionIndex !== index) return section;
        const values = section[field];
        const next = values.includes(id)
          ? values.filter((value) => value !== id)
          : [...values, id];
        return { ...section, [field]: next };
      }),
    );
  }

  function addSection() {
    const remaining = maxTotalDurationSeconds - plan.totalDurationSeconds;
    if (remaining <= 0) return;

    setSections((current) => [
      ...current,
      {
        purpose: "",
        durationSeconds: Math.min(300, remaining),
        questionIds: [],
        competencyIds: [],
      },
    ]);
  }

  const questionNames = new Map(
    questions.map((question) => [question.id, question.questionText]),
  );
  const competencyNames = new Map(
    competencies.map((competency) => [competency.id, competency.name]),
  );

  return (
    <section className="space-y-5" aria-labelledby="interview-plan-heading">
      <div>
        <h2 id="interview-plan-heading" className="text-xl font-semibold text-slate-950">
          Interview plan
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Define an ordered, duration-bounded plan using only job-related questions and competencies.
        </p>
      </div>

      {readOnly ? (
        initialPlan?.sections.length ? (
          <ol className="space-y-3">
            {initialPlan.sections.map((section) => (
              <li key={section.position} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
                <h3 className="font-medium text-slate-950">{section.purpose}</h3>
                <p className="mt-1 text-sm text-slate-600">{section.durationSeconds} seconds</p>
                {section.questionIds.length ? (
                  <p className="mt-2 text-sm text-slate-700">
                    Questions: {section.questionIds.map((id) => questionNames.get(id) ?? "Unknown question").join(", ")}
                  </p>
                ) : null}
                {section.competencyIds.length ? (
                  <p className="mt-1 text-sm text-slate-700">
                    Competencies: {section.competencyIds.map((id) => competencyNames.get(id) ?? "Unknown competency").join(", ")}
                  </p>
                ) : null}
              </li>
            ))}
          </ol>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            No interview plan has been configured yet.
          </p>
        )
      ) : (
        <form action={formAction} className="space-y-5">
          {sections.map((section, index) => (
            <fieldset key={index} className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <legend className="px-1 text-sm font-semibold text-slate-800">Section {index + 1}</legend>

              <label className="grid gap-1 text-sm font-medium text-slate-800">
                Section {index + 1} purpose
                <input
                  required
                  value={section.purpose}
                  onChange={(event) => updateSection(index, { purpose: event.target.value })}
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <label className="grid gap-1 text-sm font-medium text-slate-800">
                Section {index + 1} duration in seconds
                <input
                  type="number"
                  min={1}
                  max={maxTotalDurationSeconds}
                  step={1}
                  required
                  value={section.durationSeconds}
                  onChange={(event) =>
                    updateSection(index, {
                      durationSeconds: Number(event.target.value),
                    })
                  }
                  className="rounded-md border border-slate-300 px-3 py-2"
                />
              </label>

              <fieldset className="space-y-2">
                <legend className="text-sm font-semibold text-slate-800">Questions</legend>
                {questions.map((question) => (
                  <label key={question.id} className="flex items-start gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={section.questionIds.includes(question.id)}
                      onChange={() => toggleSectionId(index, "questionIds", question.id)}
                    />
                    <span>{question.questionText}</span>
                  </label>
                ))}
              </fieldset>

              <fieldset className="space-y-2">
                <legend className="text-sm font-semibold text-slate-800">Competencies</legend>
                {competencies.map((competency) => (
                  <label key={competency.id} className="flex items-start gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={section.competencyIds.includes(competency.id)}
                      onChange={() => toggleSectionId(index, "competencyIds", competency.id)}
                    />
                    <span>{competency.name}</span>
                  </label>
                ))}
              </fieldset>
            </fieldset>
          ))}

          <input name="plan_json" type="hidden" value={JSON.stringify(plan)} readOnly />

          <p className="text-sm text-slate-600">
            Total duration: {plan.totalDurationSeconds} seconds
          </p>

          {state.message ? (
            <p
              role={state.status === "error" ? "alert" : "status"}
              className={state.status === "error" ? "text-sm text-red-700" : "text-sm text-emerald-700"}
            >
              {state.message}
            </p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={addSection}
              disabled={plan.totalDurationSeconds >= maxTotalDurationSeconds}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-800 disabled:opacity-60"
            >
              Add section
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save interview plan"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
