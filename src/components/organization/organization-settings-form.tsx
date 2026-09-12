"use client";

import { useActionState } from "react";

import {
  idleOrganizationActionState,
  type OrganizationActionState,
} from "@/lib/organization/action-state";

type OrganizationAction = (
  previousState: OrganizationActionState,
  formData: FormData,
) => Promise<OrganizationActionState>;

type OrganizationSettingsFormProps = Readonly<{
  organization: Readonly<{
    name: string;
    companySize: string | null;
    hiringUseCase: string | null;
    candidateSupportEmail?: string | null;
    candidateSupportUrl?: string | null;
  }>;
  action?: OrganizationAction;
  canUpdate?: boolean;
}>;

async function idleAction(
  state: OrganizationActionState,
): Promise<OrganizationActionState> {
  return state;
}

export function OrganizationSettingsForm({
  organization,
  action = idleAction,
  canUpdate = true,
}: OrganizationSettingsFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    idleOrganizationActionState,
  );

  return (
    <section aria-labelledby="organization-settings-title" className="max-w-2xl space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          Workspace
        </p>
        <h1
          id="organization-settings-title"
          className="text-3xl font-semibold tracking-tight text-zinc-950"
        >
          Organization settings
        </h1>
        <p className="text-sm leading-6 text-zinc-600">
          Keep the shared workspace details current. Membership roles and ownership are managed separately.
        </p>
      </div>

      {!canUpdate ? (
        <p className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700">
          Only organization owners and admins can change these settings.
        </p>
      ) : null}

      <form
        action={formAction}
        className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"
        noValidate
      >
        <div className="space-y-2">
          <label htmlFor="settings-organization-name" className="block text-sm font-medium text-zinc-800">
            Organization name
          </label>
          <input
            id="settings-organization-name"
            name="name"
            type="text"
            required
            maxLength={120}
            defaultValue={organization.name}
            disabled={!canUpdate || pending}
            autoComplete="organization"
            aria-describedby="settings-organization-name-help"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 disabled:bg-zinc-100 disabled:text-zinc-600"
          />
          <p id="settings-organization-name-help" className="text-xs leading-5 text-zinc-500">
            Required. Use 120 characters or fewer.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="settings-company-size" className="block text-sm font-medium text-zinc-800">
            Company size
          </label>
          <input
            id="settings-company-size"
            name="company_size"
            type="text"
            maxLength={80}
            defaultValue={organization.companySize ?? ""}
            disabled={!canUpdate || pending}
            aria-describedby="settings-company-size-help"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 disabled:bg-zinc-100 disabled:text-zinc-600"
          />
          <p id="settings-company-size-help" className="text-xs leading-5 text-zinc-500">
            Optional. Use 80 characters or fewer.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="settings-hiring-use-case" className="block text-sm font-medium text-zinc-800">
            Hiring use case
          </label>
          <textarea
            id="settings-hiring-use-case"
            name="hiring_use_case"
            maxLength={500}
            rows={5}
            defaultValue={organization.hiringUseCase ?? ""}
            disabled={!canUpdate || pending}
            aria-describedby="settings-hiring-use-case-help"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 disabled:bg-zinc-100 disabled:text-zinc-600"
          />
          <p id="settings-hiring-use-case-help" className="text-xs leading-5 text-zinc-500">
            Optional. Describe the hiring workflow in 500 characters or fewer.
          </p>
        </div>

        <div className="space-y-2 border-t border-zinc-200 pt-5">
          <label htmlFor="settings-candidate-support-email" className="block text-sm font-medium text-zinc-800">
            Candidate support email
          </label>
          <input
            id="settings-candidate-support-email"
            name="candidate_support_email"
            type="email"
            maxLength={254}
            defaultValue={organization.candidateSupportEmail ?? ""}
            disabled={!canUpdate || pending}
            autoComplete="email"
            aria-describedby="settings-candidate-support-email-help"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 disabled:bg-zinc-100 disabled:text-zinc-600"
          />
          <p id="settings-candidate-support-email-help" className="text-xs leading-5 text-zinc-500">
            Optional. Shown to invited candidates as a trusted contact for accommodation or interview support.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="settings-candidate-support-url" className="block text-sm font-medium text-zinc-800">
            Candidate support URL
          </label>
          <input
            id="settings-candidate-support-url"
            name="candidate_support_url"
            type="url"
            maxLength={2048}
            defaultValue={organization.candidateSupportUrl ?? ""}
            disabled={!canUpdate || pending}
            aria-describedby="settings-candidate-support-url-help"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10 disabled:bg-zinc-100 disabled:text-zinc-600"
          />
          <p id="settings-candidate-support-url-help" className="text-xs leading-5 text-zinc-500">
            Optional. Use an http or https page controlled by your organization for candidate support.
          </p>
        </div>

        {state.message ? (
          <p
            role={state.status === "error" ? "alert" : "status"}
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
          >
            {state.message}
          </p>
        ) : null}

        {canUpdate ? (
          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save settings"}
          </button>
        ) : null}
      </form>
    </section>
  );
}
