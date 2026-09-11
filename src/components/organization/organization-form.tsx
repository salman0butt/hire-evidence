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

type OrganizationFormProps = Readonly<{
  action?: OrganizationAction;
  message?: string;
  messageRole?: "alert" | "status";
}>;

async function idleAction(
  state: OrganizationActionState,
): Promise<OrganizationActionState> {
  return state;
}

export function OrganizationForm({
  action = idleAction,
  message,
  messageRole,
}: OrganizationFormProps) {
  const [state, formAction, pending] = useActionState(
    action,
    idleOrganizationActionState,
  );
  const activeMessage = message ?? state.message ?? null;
  const role = messageRole ?? "alert";

  return (
    <section aria-labelledby="create-organization-title" className="max-w-2xl space-y-8">
      <div className="space-y-3">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-zinc-500">
          Workspace setup
        </p>
        <h1
          id="create-organization-title"
          className="text-3xl font-semibold tracking-tight text-zinc-950"
        >
          Create organization
        </h1>
        <p className="text-sm leading-6 text-zinc-600">
          Start a shared hiring workspace. You will become its owner and can invite teammates later.
        </p>
      </div>

      <form
        action={formAction}
        className="space-y-5 rounded-2xl border border-zinc-200 bg-white p-6"
        noValidate
      >
        <div className="space-y-2">
          <label htmlFor="organization-name" className="block text-sm font-medium text-zinc-800">
            Organization name
          </label>
          <input
            id="organization-name"
            name="name"
            type="text"
            required
            maxLength={120}
            autoComplete="organization"
            aria-describedby="organization-name-help"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          />
          <p id="organization-name-help" className="text-xs leading-5 text-zinc-500">
            Required. Use 120 characters or fewer.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="organization-company-size" className="block text-sm font-medium text-zinc-800">
            Company size
          </label>
          <input
            id="organization-company-size"
            name="company_size"
            type="text"
            maxLength={80}
            aria-describedby="organization-company-size-help"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          />
          <p id="organization-company-size-help" className="text-xs leading-5 text-zinc-500">
            Optional. For example, 51-200 employees.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="organization-hiring-use-case" className="block text-sm font-medium text-zinc-800">
            Hiring use case
          </label>
          <textarea
            id="organization-hiring-use-case"
            name="hiring_use_case"
            maxLength={500}
            rows={5}
            aria-describedby="organization-hiring-use-case-help"
            className="w-full rounded-xl border border-zinc-300 bg-white px-4 py-3 text-zinc-950 outline-none transition focus:border-zinc-950 focus:ring-2 focus:ring-zinc-950/10"
          />
          <p id="organization-hiring-use-case-help" className="text-xs leading-5 text-zinc-500">
            Optional. Describe the hiring workflow this workspace will support in 500 characters or fewer.
          </p>
        </div>

        {activeMessage ? (
          <p
            role={role}
            className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-700"
          >
            {activeMessage}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="rounded-xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create organization"}
        </button>
      </form>
    </section>
  );
}
