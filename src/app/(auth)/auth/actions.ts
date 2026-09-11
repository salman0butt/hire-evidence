"use server";

import { redirect } from "next/navigation";

import { parseEnvironment } from "@/config/env";
import type { AuthActionState } from "@/lib/auth/action-state";
import { safeInternalPath } from "@/lib/auth/safe-redirect";
import { validateAuthCredentials } from "@/lib/auth/validation";
import { createClient } from "@/lib/supabase/server";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;
const RECOVERY_REQUESTED_MESSAGE =
  "If an account exists for that email, a password reset link has been sent.";

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

function readRecoveryEmail(value: FormDataEntryValue | null): string | null {
  const email = typeof value === "string" ? value.trim() : "";
  return EMAIL_PATTERN.test(email) ? email : null;
}

function readNewPassword(value: FormDataEntryValue | null): string | null {
  const password = typeof value === "string" ? value : "";
  return password.length >= MIN_PASSWORD_LENGTH ? password : null;
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

export async function requestPasswordResetAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = readRecoveryEmail(formData.get("email"));

  if (!email) {
    return errorState("Enter a valid email address.");
  }

  try {
    const supabase = await createClient();
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${getAppOrigin()}/auth/reset-password`,
    });
  } catch {
    return errorState("We could not send a reset link. Please try again.");
  }

  return {
    status: "recovery-requested",
    message: RECOVERY_REQUESTED_MESSAGE,
  };
}

export async function resetPasswordAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const password = readNewPassword(formData.get("password"));

  if (!password) {
    return errorState("Use at least 8 characters for your password.");
  }

  try {
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      return errorState(
        "Your password reset link is invalid or expired. Request a new reset link.",
      );
    }
  } catch {
    return errorState(
      "We could not update your password. Request a new reset link and try again.",
    );
  }

  redirect("/app");
}

export async function logoutAction(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/auth/login");
}
