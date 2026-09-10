import { createClient } from "@/lib/supabase/server";

export type UserProfile = Readonly<{
  displayName: string | null;
}>;

export async function getOwnProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw new Error("Unable to load profile.");
  }

  if (!data) {
    return null;
  }

  return { displayName: data.display_name };
}

export async function upsertOwnProfile(
  userId: string,
  displayName: string | null,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").upsert(
    {
      id: userId,
      display_name: displayName,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );

  if (error) {
    throw new Error("Unable to save profile.");
  }
}
