"use client";

import { useActionState } from "react";

import {
  idleInvitationActionState,
  type InvitationActionState,
} from "@/lib/organization/invitation-action-state";
import type { InvitationAction } from "@/components/organization/invite-form";

type AcceptInvitationFormProps = Readonly<{
  action: InvitationAction;
  initialState?: InvitationActionState;
}>;

export function AcceptInvitationForm({
  action,
  initialState = idleInvitationActionState,
}: AcceptInvitationFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <section aria-labelledby="accept-invitation-heading" className="mx-auto max-w-xl space-y-5 rounded-2xl border border-zinc-200 bg-white p-6">
      <div className="space-y-2">
        <h1 id="accept-invitation-heading" className="text-2xl font-semibold tracking-tight text-zinc-950">
          Join organization
        </h1>
        <p className="text-sm text-zinc-600">
          Your signed-in account must match the invited email address before the invitation can be accepted.
        </p>
      </div>

      <form action={formAction}>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-zinc-950 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
        >
          {pending ? "Accepting…" : "Accept invitation"}
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
    </section>
  );
}
