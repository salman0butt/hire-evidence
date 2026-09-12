"use client";

import { useActionState } from "react";

export type CandidateConsentActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
}>;

type CandidateConsentAction = (
  previousState: CandidateConsentActionState,
  formData: FormData,
) => Promise<CandidateConsentActionState>;

type CandidateConsentFormProps = Readonly<{
  action: CandidateConsentAction;
}>;

const idleState: CandidateConsentActionState = {
  status: "idle",
  message: null,
};

const disclosures = [
  {
    title: "AI-assisted interview",
    body: "AI may help present interview questions and organize job-related evidence. It does not make the final hiring decision.",
  },
  {
    title: "Transcription",
    body: "Your interview responses may be transcribed so they can be reviewed as part of the interview record.",
  },
  {
    title: "Data processing",
    body: "Your interview responses and transcript may be processed to produce structured, job-related evidence for human review.",
  },
  {
    title: "Retention",
    body: "Interview data is retained according to the hiring organization's applicable retention policy and privacy requirements.",
  },
] as const;

export function CandidateConsentForm({ action }: CandidateConsentFormProps) {
  const [state, formAction, pending] = useActionState(action, idleState);

  return (
    <section
      aria-labelledby="candidate-consent-title"
      className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"
    >
      <div className="space-y-2">
        <h2
          id="candidate-consent-title"
          className="text-xl font-semibold text-zinc-950"
        >
          AI and privacy disclosures
        </h2>
        <p className="text-sm leading-6 text-zinc-600">
          Review each disclosure before deciding whether to consent. Consent is required before the interview can start.
        </p>
      </div>

      <dl className="space-y-4">
        {disclosures.map((disclosure) => (
          <div key={disclosure.title} className="space-y-1">
            <dt className="text-sm font-semibold text-zinc-900">
              {disclosure.title}
            </dt>
            <dd className="text-sm leading-6 text-zinc-600">
              {disclosure.body}
            </dd>
          </div>
        ))}
      </dl>

      <form action={formAction} className="space-y-4">
        <label className="flex items-start gap-3 text-sm leading-6 text-zinc-700">
          <input
            name="consent"
            type="checkbox"
            value="accepted"
            required
            className="mt-1 h-4 w-4 rounded border-zinc-300"
          />
          <span>I have read these disclosures and consent to the described AI-assisted interview, transcription, data processing, and retention.</span>
        </label>

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
          disabled={pending || state.status === "success"}
          className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Recording…" : state.status === "success" ? "Consent recorded" : "Record consent"}
        </button>
      </form>
    </section>
  );
}
