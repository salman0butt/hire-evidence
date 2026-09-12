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
const SUPPORT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+$/;

function settingsPath(organizationId: string): string {
  return `/app/o/${organizationId}/settings`;
}

function errorState(message: string): OrganizationActionState {
  return { status: "error", message };
}

function optionalFormText(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized || null;
}

function isValidSupportEmail(value: string): boolean {
  return value.length <= 254 && SUPPORT_EMAIL_PATTERN.test(value);
}

function isSafeSupportUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
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

  const candidateSupportEmail = optionalFormText(
    formData.get("candidate_support_email"),
  );
  const candidateSupportUrl = optionalFormText(
    formData.get("candidate_support_url"),
  );

  if (candidateSupportEmail && !isValidSupportEmail(candidateSupportEmail)) {
    return errorState("Candidate support email must be valid.");
  }

  if (candidateSupportUrl && !isSafeSupportUrl(candidateSupportUrl)) {
    return errorState("Candidate support URL must use http or https.");
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
      candidateSupportEmail,
      candidateSupportUrl,
    });
  } catch {
    return errorState("We could not update organization settings. Please try again.");
  }

  revalidatePath(`/app/o/${organizationId}`);
  revalidatePath(settingsPath(organizationId));

  return { status: "success", message: "Organization settings updated." };
}
