"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/require-user";
import type { InvitationActionState } from "@/lib/organization/invitation-action-state";
import {
  acceptOrganizationInvitation,
  createOrganizationInvitation,
} from "@/lib/organization/invitations";
import { isManageableOrganizationRole } from "@/lib/organization/rbac";

function errorState(message: string): InvitationActionState {
  return { status: "error", message, invitationUrl: null };
}

function normalizeEmail(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  if (
    email.length < 3 ||
    email.length > 254 ||
    !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)
  ) {
    return null;
  }
  return email;
}

export async function createInvitationAction(
  organizationId: string,
  _previousState: InvitationActionState,
  formData: FormData,
): Promise<InvitationActionState> {
  const email = normalizeEmail(formData.get("email"));
  const role = formData.get("role");

  if (!email) return errorState("Enter a valid email address.");
  if (!isManageableOrganizationRole(role)) {
    return errorState("Choose a valid invitation role.");
  }

  await requireUser(`/app/o/${organizationId}/team`);

  try {
    const rawToken = await createOrganizationInvitation({
      organizationId,
      email,
      role,
    });
    return {
      status: "success",
      message: "Invitation link created.",
      invitationUrl: `/app/invitations/${rawToken}`,
    };
  } catch {
    return errorState("We could not create this invitation. Please try again.");
  }
}

export async function acceptInvitationAction(
  rawToken: string,
  _previousState: InvitationActionState,
  _formData: FormData,
): Promise<InvitationActionState> {
  await requireUser(`/app/invitations/${rawToken}`);

  let organizationId: string;
  try {
    organizationId = await acceptOrganizationInvitation(rawToken);
  } catch {
    return errorState("This invitation is invalid or no longer available.");
  }

  redirect(`/app/o/${organizationId}`);
}
