"use server";

import { redirect } from "next/navigation";

import { parseEnvironment } from "@/config/env";
import type { AuthActionState } from "@/lib/auth/action-state";
import { safeInternalPath } from "@/lib/auth/safe-redirect";
import { validateAuthCredentials } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

function getAppOrigin(): string {
  return parseEnvironment({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  }).appUrl.origin;
}

function errorState(message: string): AuthActionState {
  return { status: "error", message };
}

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validation = validateAuthCredentials({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validation.ok) {
    return errorState(validation.message);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(validation.value);

  if (error) {
    return errorState("We could not sign you in. Check your details and try again.");
  }

  redirect(safeInternalPath(formData.get("next"), "/app"));
}

export async function signupAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const validation = validateAuthCredentials({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validation.ok) {
    return errorState(validation.message);
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    ...validation.value,
    options: {
      emailRedirectTo: `${getAppOrigin()}/auth/confirm`,
    },
  });

  if (error) {
    return errorState("We could not create your account. Please try again.");
  }

  if (data.session) {
    redirect("/app");
  }

  return {
    status: "verification-required",
    message: "Check your email to verify your account, then return here to log in.",
  };
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
