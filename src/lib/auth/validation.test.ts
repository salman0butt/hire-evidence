import { describe, expect, it } from "vitest";

import { validateAuthCredentials } from "./validation";

describe("validateAuthCredentials", () => {
  it("normalizes a valid email and preserves the password", () => {
    expect(
      validateAuthCredentials({
        email: "  Person@Example.com  ",
        password: "correct-horse",
      }),
    ).toEqual({
      ok: true,
      value: {
        email: "Person@Example.com",
        password: "correct-horse",
      },
    });
  });

  it("rejects an invalid email", () => {
    expect(
      validateAuthCredentials({
        email: "not-an-email",
        password: "correct-horse",
      }),
    ).toEqual({
      ok: false,
      message: "Enter a valid email address.",
    });
  });

  it("requires a password with at least eight characters", () => {
    expect(
      validateAuthCredentials({
        email: "person@example.com",
        password: "short",
      }),
    ).toEqual({
      ok: false,
      message: "Password must be at least 8 characters.",
    });
  });
});
