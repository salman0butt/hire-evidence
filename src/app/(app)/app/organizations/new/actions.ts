"use server";

import { redirect } from "next/navigation";

import { requireUser } from "@/lib/auth/require-user";
import {
  idleOrganizationActionState,
  type OrganizationActionState,
} from "@/lib/organization/action-state";
import { createOrganization } from "@/lib/organization/repository";
import { validateOrganizationInput } from "@/lib/organization/validation";

export { idleOrganizationActionState };

export async function createOrganizationAction(
  _previousState: OrganizationActionState,
  formData: FormData,
): Promise<OrganizationActionState> {
  const validation = validateOrganizationInput({
    name: formData.get("name"),
    companySize: formData.get("company_size"),
    hiringUseCase: formData.get("hiring_use_case"),
  });

  if (!validation.ok) {
    return { status: "error", message: validation.message };
  }

  await requireUser("/app/organizations/new");

  let organizationId: string;
  try {
    organizationId = await createOrganization(validation.value);
  } catch {
    return {
      status: "error",
      message: "We could not create your organization. Please try again.",
    };
  }

  redirect(`/app/o/${organizationId}`);
}
