"use server";

import { requireUser } from "@/lib/auth/require-user";
import type { OrganizationActionState } from "@/lib/organization/action-state";
import {
  removeOrganizationMember,
  updateOrganizationMemberRole,
} from "@/lib/organization/members";
import { isManageableOrganizationRole } from "@/lib/organization/rbac";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function errorState(message: string): OrganizationActionState {
  return { status: "error", message };
}

export async function updateMemberRoleAction(
  organizationId: string,
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const userId = formData.get("user_id");
  const role = formData.get("role");

  if (
    !UUID_PATTERN.test(organizationId) ||
    typeof userId !== "string" ||
    !UUID_PATTERN.test(userId)
  ) {
    return errorState("Choose a valid team member.");
  }

  if (!isManageableOrganizationRole(role)) {
    return errorState("Choose a valid team role.");
  }

  await requireUser(`/app/o/${organizationId}/team`);

  try {
    await updateOrganizationMemberRole({ organizationId, userId, role });
    return { status: "idle", message: null };
  } catch {
    return errorState("We could not update this team member. Please try again.");
  }
}

export async function removeMemberAction(
  organizationId: string,
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const userId = formData.get("user_id");

  if (
    !UUID_PATTERN.test(organizationId) ||
    typeof userId !== "string" ||
    !UUID_PATTERN.test(userId)
  ) {
    return errorState("Choose a valid team member.");
  }

  await requireUser(`/app/o/${organizationId}/team`);

  try {
    await removeOrganizationMember({ organizationId, userId });
    return { status: "idle", message: null };
  } catch {
    return errorState("We could not remove this team member. Please try again.");
  }
}
