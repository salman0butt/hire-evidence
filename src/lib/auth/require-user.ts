import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { safeInternalPath } from "./safe-redirect";

export async function requireUser(nextPath = "/app") {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    const safeNextPath = safeInternalPath(nextPath, "/app");
    redirect(`/auth/login?next=${safeNextPath}`);
  }

  return user;
}
