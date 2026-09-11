"use client";

import { useActionState } from "react";

import {
  idleOrganizationActionState,
  type OrganizationActionState,
} from "@/lib/organization/action-state";
import {
  MANAGEABLE_ORGANIZATION_ROLES,
  type OrganizationMember,
} from "@/lib/organization/members";

export type MembershipAction = (
  previousState: OrganizationActionState,
  formData: FormData,
) => Promise<OrganizationActionState>;

type TeamMembersProps = Readonly<{
  members: readonly OrganizationMember[];
  canManage: boolean;
  updateAction?: MembershipAction;
  removeAction?: MembershipAction;
}>;

async function idleAction(
  state: OrganizationActionState,
): Promise<OrganizationActionState> {
  return state;
}

function formatRole(role: string): string {
  return role
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function MemberControls({
  member,
  updateAction,
  removeAction,
}: Readonly<{
  member: OrganizationMember;
  updateAction: MembershipAction;
  removeAction: MembershipAction;
}>) {
  const [updateState, updateFormAction, updatePending] = useActionState(
    updateAction,
    idleOrganizationActionState,
  );
  const [removeState, removeFormAction, removePending] = useActionState(
    removeAction,
    idleOrganizationActionState,
  );
  const message = updateState.message ?? removeState.message;

  return (
    <div className="space-y-3">
      <form action={updateFormAction} className="flex flex-wrap items-end gap-2">
        <input type="hidden" name="user_id" value={member.userId} />
        <div className="space-y-1">
          <label htmlFor={`member-role-${member.userId}`} className="block text-xs font-medium text-zinc-600">
            Role
          </label>
          <select
            id={`member-role-${member.userId}`}
            name="role"
            defaultValue={member.role}
            disabled={updatePending || removePending}
            className="rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-900"
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
          disabled={updatePending || removePending}
          className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 disabled:opacity-60"
        >
          {updatePending ? "Saving…" : "Save role"}
        </button>
      </form>

      <form action={removeFormAction}>
        <input type="hidden" name="user_id" value={member.userId} />
        <button
          type="submit"
          disabled={updatePending || removePending}
          aria-label={`Remove member ${member.userId}`}
          className="text-sm font-medium text-red-700 disabled:opacity-60"
        >
          {removePending ? "Removing…" : "Remove member"}
        </button>
      </form>

      {message ? (
        <p role="alert" className="text-sm text-red-700">
          {message}
        </p>
      ) : null}
    </div>
  );
}

export function TeamMembers({
  members,
  canManage,
  updateAction = idleAction,
  removeAction = idleAction,
}: TeamMembersProps) {
  return (
    <section aria-labelledby="team-members-heading" className="space-y-4">
      <div className="space-y-2">
        <h1 id="team-members-heading" className="text-3xl font-semibold tracking-tight text-zinc-950">
          Team
        </h1>
        <p className="text-sm text-zinc-600">
          Organization roles control access. Ownership cannot be reassigned or removed in this milestone.
        </p>
      </div>

      <ul className="divide-y divide-zinc-200 rounded-2xl border border-zinc-200 bg-white">
        {members.map((member) => (
          <li key={member.userId} className="grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0 space-y-1">
              <p className="truncate font-mono text-xs text-zinc-500">{member.userId}</p>
              <p className="text-sm font-semibold text-zinc-900">{formatRole(member.role)}</p>
            </div>

            {canManage && member.role !== "owner" ? (
              <MemberControls
                member={member}
                updateAction={updateAction}
                removeAction={removeAction}
              />
            ) : member.role === "owner" ? (
              <p className="text-sm text-zinc-500">Owner membership is protected.</p>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
