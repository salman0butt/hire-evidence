import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { idleAuthActionState } from "@/lib/auth/action-state";
import { createClient } from "@/lib/supabase/server";

import {
  loginAction,
  requestPasswordResetAction,
  resetPasswordAction,
  signupAction,
} from "./actions";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((destination: string) => {
    throw new Error(`NEXT_REDIRECT:${destination}`);
  }),
}));

const mockedCreateClient = vi.mocked(createClient);

function credentials(email = "person@example.com", password = "correct-horse") {
  const formData = new FormData();
  formData.set("email", email);
  formData.set("password", password);
  return formData;
}

function emailOnly(email = "person@example.com") {
  const formData = new FormData();
  formData.set("email", email);
  return formData;
}

function passwordOnly(password = "new-correct-horse") {
  const formData = new FormData();
  formData.set("password", password);
  return formData;
}

describe("authentication server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://hire-evidence.example");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("rejects invalid credentials before calling Supabase", async () => {
    const result = await loginAction(
      idleAuthActionState,
      credentials("not-an-email"),
    );

    expect(result).toEqual({
      status: "error",
      message: "Enter a valid email address.",
    });
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("maps login provider failures to a stable user-safe error", async () => {
    mockedCreateClient.mockResolvedValue({
      auth: {
        signInWithPassword: vi.fn().mockResolvedValue({
          error: new Error("provider internals that must not reach the UI"),
        }),
      },
    } as never);

    const result = await loginAction(idleAuthActionState, credentials());

    expect(result).toEqual({
      status: "error",
      message: "We could not sign you in. Check your details and try again.",
    });
  });

  it("maps signup provider failures to a stable user-safe error", async () => {
    mockedCreateClient.mockResolvedValue({
      auth: {
        signUp: vi.fn().mockResolvedValue({
          data: { session: null },
          error: new Error("provider internals that must not reach the UI"),
        }),
      },
    } as never);

    const result = await signupAction(idleAuthActionState, credentials());

    expect(result).toEqual({
      status: "error",
      message: "We could not create your account. Please try again.",
    });
  });

  it("rejects an invalid recovery email before calling Supabase", async () => {
    const result = await requestPasswordResetAction(
      idleAuthActionState,
      emailOnly("not-an-email"),
    );

    expect(result).toEqual({
      status: "error",
      message: "Enter a valid email address.",
    });
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("returns account-enumeration-safe copy even when reset email delivery fails", async () => {
    const resetPasswordForEmail = vi.fn().mockResolvedValue({
      error: new Error("user does not exist"),
    });
    mockedCreateClient.mockResolvedValue({ auth: { resetPasswordForEmail } } as never);

    const result = await requestPasswordResetAction(
      idleAuthActionState,
      emailOnly(),
    );

    expect(resetPasswordForEmail).toHaveBeenCalledWith("person@example.com", {
      redirectTo: "https://hire-evidence.example/auth/reset-password",
    });
    expect(result).toEqual({
      status: "recovery-requested",
      message:
        "If an account exists for that email, a password reset link has been sent.",
    });
  });

  it("rejects a short new password before calling Supabase", async () => {
    const result = await resetPasswordAction(
      idleAuthActionState,
      passwordOnly("short"),
    );

    expect(result).toEqual({
      status: "error",
      message: "Use at least 8 characters for your password.",
    });
    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("maps an invalid recovery session to a safe retry path", async () => {
    mockedCreateClient.mockResolvedValue({
      auth: {
        updateUser: vi.fn().mockResolvedValue({
          error: new Error("Auth session missing"),
        }),
      },
    } as never);

    const result = await resetPasswordAction(
      idleAuthActionState,
      passwordOnly(),
    );

    expect(result).toEqual({
      status: "error",
      message:
        "Your password reset link is invalid or expired. Request a new reset link.",
    });
  });
});
