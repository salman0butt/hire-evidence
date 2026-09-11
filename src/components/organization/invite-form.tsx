"use client";

import { useActionState } from "react";

import {
  idleInvitationActionState,
  type InvitationActionState,
} from "@/lib/organization/invitation-action-state";
import { MANAGEABLE_ORGANIZATION_ROLES } from "@/lib/organization/rbac";

export type InvitationAction = (
  previousState: InvitationActionState,
  formData: FormData,
) => Promise<InvitationActionState>;

type InviteFormProps = Readonly<{
  action: InvitationAction;
  initialState?: InvitationActionState;
}>;

function formatRole(role: string): string {
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function InviteForm({
  action,
  initialState = idleInvitationActionState,
}: InviteFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <section aria-labelledby="invite-teammate-heading" className="space-y-4 rounded-2xl border border-zinc-200 bg-white p-5">
      <div className="space-y-1">
        <h2 id="invite-teammate-heading" className="text-xl font-semibold text-zinc-950">
          Invite teammate
        </h2>
        <p className="text-sm text-zinc-600">
          Create a seven-day invitation link for a non-owner organization role.
        </p>
      </div>

      <form action={formAction} className="grid gap-4 md:grid-cols-[1fr_220px_auto] md:items-end">
        <div className="space-y-1">
          <label htmlFor="invitation-email" className="block text-sm font-medium text-zinc-800">
            Email
          </label>
          <input
            id="invitation-email"
            name="email"
            type="email"
            required
            maxLength={254}
            autoComplete="email"
            disabled={pending}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="invitation-role" className="block text-sm font-medium text-zinc-800">
            Role
          </label>
          <select
            id="invitation-role"
            name="role"
            defaultValue="reviewer"
            disabled={pending}
            className="w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-950"
          >
            {MANAGEABLE_ORGANIZATION_ROLES.map((role) => (
              <option key={role} value={role}>
                {formatRole(role)}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Creating…" : "Create invitation link"}
        </button>
      </form>

      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={state.status === "error" ? "text-sm text-red-700" : "text-sm text-zinc-700"}
        >
          {state.message}
        </p>
      ) : null}

      {state.invitationUrl ? (
        <a
          href={state.invitationUrl}
          className="inline-flex text-sm font-semibold text-zinc-950 underline underline-offset-4"
        >
          Open invitation link
        </a>
      ) : null}
    </section>
  );
}
