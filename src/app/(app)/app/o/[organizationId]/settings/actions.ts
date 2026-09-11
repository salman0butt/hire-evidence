"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import type { OrganizationActionState } from "@/lib/organization/action-state";
import { hasOrganizationCapability } from "@/lib/organization/rbac";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";
import { updateOrganizationSettings } from "@/lib/organization/repository";
import { validateOrganizationInput } from "@/lib/organization/validation";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function settingsPath(organizationId: string): string {
  return `/app/o/${organizationId}/settings`;
}

function errorState(message: string): OrganizationActionState {
  return { status: "error", message };
}

export async function updateOrganizationSettingsAction(
  organizationId: string,
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  if (!UUID_PATTERN.test(organizationId)) {
    return errorState("Choose a valid organization.");
  }

  const validation = validateOrganizationInput({
    name: formData.get("name"),
    companySize: formData.get("company_size"),
    hiringUseCase: formData.get("hiring_use_case"),
  });

  if (!validation.ok) {
    return errorState(validation.message);
  }

  await requireUser(settingsPath(organizationId));
  const organization = await requireOrganizationMembership(organizationId);

  if (!hasOrganizationCapability(organization.role, "organization:update")) {
    return errorState("You do not have permission to update organization settings.");
  }

  try {
    await updateOrganizationSettings({
      organizationId,
      ...validation.value,
    });
  } catch {
    return errorState("We could not update organization settings. Please try again.");
  }

  revalidatePath(`/app/o/${organizationId}`);
  revalidatePath(settingsPath(organizationId));

  return { status: "success", message: "Organization settings updated." };
}
