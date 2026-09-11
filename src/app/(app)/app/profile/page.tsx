import { ProfileForm } from "@/components/profile/profile-form";
import { requireUser } from "@/lib/auth/require-user";
import { getOwnProfile } from "@/lib/profile/repository";

import { updateProfileAction } from "./actions";

export default async function ProfilePage() {
  const user = await requireUser("/app/profile");
  const profile = await getOwnProfile(user.id);

  return (
    <ProfileForm
      action={updateProfileAction}
      initialDisplayName={profile?.displayName ?? null}
    />
  );
}
