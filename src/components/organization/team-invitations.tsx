"use client";

import { useActionState } from "react";

import {
  idleInvitationActionState,
  type InvitationActionState,
} from "@/lib/organization/invitation-action-state";
import type { ManageableOrganizationRole } from "@/lib/organization/rbac";

export type InvitationAction = (
  previousState: InvitationActionState,
  formData: FormData,
) => Promise<InvitationActionState>;

export type PendingOrganizationInvitation = Readonly<{
  id: string;
  email: string;
  role: ManageableOrganizationRole;
  expiresAt: string;
}>;

type TeamInvitationsProps = Readonly<{
  invitations: readonly PendingOrganizationInvitation[];
  revokeAction: InvitationAction;
}>;

function formatRole(role: string): string {
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function RevokeInvitationControl({
  invitation,
  action,
}: Readonly<{
  invitation: PendingOrganizationInvitation;
  action: InvitationAction;
}>) {
  const [state, formAction, pending] = useActionState(
    action,
    idleInvitationActionState,
  );

  return (
    <div className="space-y-2">
      <form action={formAction}>
        <input type="hidden" name="invitation_id" value={invitation.id} />
        <button
          type="submit"
          disabled={pending}
          aria-label={`Revoke invitation for ${invitation.email}`}
          className="text-sm font-medium text-red-700 disabled:opacity-60"
        >
          {pending ? "Revoking…" : "Revoke invitation"}
        </button>
      </form>

      {state.message ? (
        <p
          role={state.status === "error" ? "alert" : "status"}
          className={state.status === "error" ? "text-sm text-red-700" : "text-sm text-zinc-600"}
        >
          {state.message}
        </p>
      ) : null}
    </div>
  );
}

export function TeamInvitations({
  invitations,
  revokeAction,
}: TeamInvitationsProps) {
  return (
    <section aria-labelledby="pending-invitations-heading" className="space-y-4">
      <div className="space-y-1">
        <h2
          id="pending-invitations-heading"
          className="text-xl font-semibold text-zinc-950"
        >
          Pending invitations
        </h2>
        <p className="text-sm text-zinc-600">
          Invitation links expire after seven days and can be revoked before acceptance.
        </p>
      </div>

      {invitations.length === 0 ? (
        <p className="rounded-2xl border border-zinc-200 bg-white p-5 text-sm text-zinc-600">
          No pending invitations.
        </p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
          {invitations.map((invitation) => (
            <li
              key={invitation.id}
              className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center"
            >
              <div className="min-w-0 space-y-1">
                <p className="truncate text-sm font-medium text-zinc-950">
                  {invitation.email}
                </p>
                <p className="text-sm text-zinc-700">
                  {formatRole(invitation.role)}
                </p>
                <p className="text-xs text-zinc-500">
                  Expires <time dateTime={invitation.expiresAt}>{invitation.expiresAt}</time>
                </p>
              </div>

              <RevokeInvitationControl invitation={invitation} action={revokeAction} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
