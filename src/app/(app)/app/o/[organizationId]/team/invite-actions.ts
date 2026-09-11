"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/require-user";
import type { InvitationActionState } from "@/lib/organization/invitation-action-state";
import {
  acceptOrganizationInvitation,
  createOrganizationInvitation,
  revokeOrganizationInvitation,
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

function normalizeUuid(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const candidate = value.trim();
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    candidate,
  )
    ? candidate
    : null;
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

export async function revokeInvitationAction(
  organizationId: string,
  _previousState: InvitationActionState,
  formData: FormData,
): Promise<InvitationActionState> {
  const invitationId = normalizeUuid(formData.get("invitation_id"));
  if (!invitationId) {
    return errorState("We could not revoke this invitation. Please try again.");
  }

  await requireUser(`/app/o/${organizationId}/team`);

  try {
    await revokeOrganizationInvitation({ organizationId, invitationId });
    revalidatePath(`/app/o/${organizationId}/team`);
    return {
      status: "success",
      message: "Invitation revoked.",
      invitationUrl: null,
    };
  } catch {
    return errorState("We could not revoke this invitation. Please try again.");
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
