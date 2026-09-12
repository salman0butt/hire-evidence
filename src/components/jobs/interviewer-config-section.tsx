"use client";

import { useActionState } from "react";

import type { InterviewerConfig } from "@/lib/interviewer/interviewer-configs";

export type InterviewerConfigActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
}>;

type InterviewerConfigAction = (
  previousState: InterviewerConfigActionState,
  formData: FormData,
) => Promise<InterviewerConfigActionState>;

type InterviewerConfigSectionProps = Readonly<{
  planId: string | null;
  initialConfig?: InterviewerConfig;
  readOnly?: boolean;
  action?: InterviewerConfigAction;
}>;

const initialActionState: InterviewerConfigActionState = {
  status: "idle",
  message: null,
};

const interviewTypes = [
  ["screening", "Screening"],
  ["behavioral", "Behavioral"],
  ["technical", "Technical"],
  ["role_specific", "Role specific"],
  ["leadership", "Leadership"],
  ["case_study", "Case study"],
  ["system_design", "System design"],
  ["values", "Values"],
  ["custom", "Custom"],
] as const;

const personas = [
  ["professional", "Professional"],
  ["friendly", "Friendly"],
  ["direct", "Direct"],
  ["technical", "Technical"],
  ["conversational", "Conversational"],
] as const;

const difficulties = [
  ["easy", "Easy"],
  ["medium", "Medium"],
  ["hard", "Hard"],
] as const;

const questionModes = [
  ["fixed", "Fixed"],
  ["semi_adaptive", "Semi-adaptive"],
  ["adaptive", "Adaptive"],
] as const;

const followUpReasons = [
  ["clarify_ambiguity", "Clarify ambiguity"],
  ["request_example", "Request example"],
  ["explore_reasoning", "Explore reasoning"],
  ["missing_required_dimension", "Missing required dimension"],
] as const;

async function unavailableAction(): Promise<InterviewerConfigActionState> {
  return {
    status: "error",
    message: "Interviewer configuration editing is unavailable for this account.",
  };
}

function labelFor<T extends readonly (readonly [string, string])[]>(
  options: T,
  value: string,
): string {
  return options.find(([candidate]) => candidate === value)?.[1] ?? value;
}

export function InterviewerConfigSection({
  planId,
  initialConfig,
  readOnly = false,
  action,
}: InterviewerConfigSectionProps) {
  const [state, formAction, pending] = useActionState(
    action ?? unavailableAction,
    initialActionState,
  );

  return (
    <section className="space-y-5" aria-labelledby="interviewer-config-heading">
      <div>
        <h2 id="interviewer-config-heading" className="text-xl font-semibold text-slate-950">
          Interviewer configuration
        </h2>
        <p className="mt-1 text-sm text-slate-600">
          Configure the bounded interview experience. Organization-authored text remains subject to platform safety policy.
        </p>
      </div>

      {readOnly ? (
        initialConfig ? (
          <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-4 text-sm text-slate-700 shadow-sm">
            <p className="font-semibold text-slate-950">{initialConfig.name}</p>
            <p>
              {labelFor(interviewTypes, initialConfig.interviewType)} · {labelFor(personas, initialConfig.persona)} · {initialConfig.language}
            </p>
            <p>
              {initialConfig.durationSeconds} seconds · {labelFor(difficulties, initialConfig.difficulty)} · {labelFor(questionModes, initialConfig.questionMode)}
            </p>
            {initialConfig.guidelines ? <p>{initialConfig.guidelines}</p> : null}
            {initialConfig.candidateInstructions ? (
              <p>Candidate instructions: {initialConfig.candidateInstructions}</p>
            ) : null}
          </div>
        ) : (
          <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            No interviewer configuration has been saved yet.
          </p>
        )
      ) : !planId ? (
        <p className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          Save an interview plan before configuring the interviewer.
        </p>
      ) : (
        <form action={formAction} className="space-y-5 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <input type="hidden" name="plan_id" value={planId} readOnly />
          {initialConfig ? (
            <input type="hidden" name="config_id" value={initialConfig.id} readOnly />
          ) : null}

          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1 text-sm font-medium text-slate-800 md:col-span-2">
              Internal interviewer name
              <input
                name="name"
                required
                maxLength={200}
                defaultValue={initialConfig?.name ?? ""}
                className="rounded-md border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-800">
              Interview type
              <select
                name="interview_type"
                defaultValue={initialConfig?.interviewType ?? "technical"}
                className="rounded-md border border-slate-300 px-3 py-2"
              >
                {interviewTypes.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-800">
              Persona
              <select
                name="persona"
                defaultValue={initialConfig?.persona ?? "professional"}
                className="rounded-md border border-slate-300 px-3 py-2"
              >
                {personas.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-800">
              Language
              <input
                name="language"
                required
                maxLength={35}
                defaultValue={initialConfig?.language ?? "English"}
                className="rounded-md border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-800">
              Duration in seconds
              <input
                name="duration_seconds"
                type="number"
                min={900}
                max={3600}
                step={1}
                required
                defaultValue={initialConfig?.durationSeconds ?? 1800}
                className="rounded-md border border-slate-300 px-3 py-2"
              />
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-800">
              Difficulty
              <select
                name="difficulty"
                defaultValue={initialConfig?.difficulty ?? "medium"}
                className="rounded-md border border-slate-300 px-3 py-2"
              >
                {difficulties.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="grid gap-1 text-sm font-medium text-slate-800">
              Question strategy
              <select
                name="question_mode"
                defaultValue={initialConfig?.questionMode ?? "fixed"}
                className="rounded-md border border-slate-300 px-3 py-2"
              >
                {questionModes.map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-1 text-sm font-medium text-slate-800">
            Interview guidelines
            <textarea
              name="guidelines"
              maxLength={8000}
              rows={5}
              defaultValue={initialConfig?.guidelines ?? ""}
              className="rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid gap-1 text-sm font-medium text-slate-800">
            Candidate instructions
            <textarea
              name="candidate_instructions"
              maxLength={4000}
              rows={4}
              defaultValue={initialConfig?.candidateInstructions ?? ""}
              className="rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <label className="grid max-w-sm gap-1 text-sm font-medium text-slate-800">
            Maximum follow-ups per question
            <input
              name="max_follow_ups_per_question"
              type="number"
              min={0}
              max={2}
              step={1}
              required
              defaultValue={initialConfig?.followUpPolicy.maxFollowUpsPerQuestion ?? 1}
              className="rounded-md border border-slate-300 px-3 py-2"
            />
          </label>

          <fieldset className="space-y-2">
            <legend className="text-sm font-semibold text-slate-800">Allowed follow-up reasons</legend>
            {followUpReasons.map(([value, label]) => (
              <label key={value} className="flex items-start gap-2 text-sm text-slate-700">
                <input
                  type="checkbox"
                  name="follow_up_reasons"
                  value={value}
                  defaultChecked={initialConfig?.followUpPolicy.allowedReasons.includes(value) ?? false}
                />
                <span>{label}</span>
              </label>
            ))}
          </fieldset>

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
            className="rounded-md bg-slate-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save interviewer configuration"}
          </button>
        </form>
      )}
    </section>
  );
}
