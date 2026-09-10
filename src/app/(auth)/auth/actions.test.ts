import { beforeEach, describe, expect, it, vi } from "vitest";

import { idleAuthActionState } from "@/lib/auth/action-state";
import { createClient } from "@/lib/supabase/server";

import { loginAction, signupAction } from "./actions";

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

describe("authentication server actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
});
