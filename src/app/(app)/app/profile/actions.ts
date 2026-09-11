"use server";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import type { ProfileActionState } from "@/lib/profile/action-state";
import { upsertOwnProfile } from "@/lib/profile/repository";
import { validateDisplayName } from "@/lib/profile/validation";

export async function updateProfileAction(
  _previousState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const validation = validateDisplayName(formData.get("display_name"));

  if (!validation.ok) {
    return { status: "error", message: validation.message };
  }

  const user = await requireUser("/app/profile");

  try {
    await upsertOwnProfile(user.id, validation.value.displayName);
  } catch {
    return {
      status: "error",
      message: "We could not save your profile. Please try again.",
    };
  }

  revalidatePath("/app/profile");

  return { status: "saved", message: "Profile saved." };
}
