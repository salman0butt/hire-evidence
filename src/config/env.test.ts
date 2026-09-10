import { describe, expect, it } from "vitest";

import { parseEnvironment } from "./env";

const validSupabaseInput = {
  NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
} as const;

describe("parseEnvironment", () => {
  it("uses safe local defaults for non-auth foundation variables", () => {
    const env = parseEnvironment(validSupabaseInput);
    expect(env.nodeEnv).toBe("development");
    expect(env.appUrl.href).toBe("http://localhost:3000/");
  });

  it("accepts valid application and Supabase environment values", () => {
    const env = parseEnvironment({
      NODE_ENV: "production",
      NEXT_PUBLIC_APP_URL: "https://interviews.example.com/base",
      ...validSupabaseInput,
    });

    expect(env.nodeEnv).toBe("production");
    expect(env.appUrl.href).toBe("https://interviews.example.com/base");
    expect(env.supabaseUrl.href).toBe("https://project.supabase.co/");
    expect(env.supabasePublishableKey).toBe("sb_publishable_example");
  });

  it("rejects malformed application URLs", () => {
    expect(() =>
      parseEnvironment({
        NEXT_PUBLIC_APP_URL: "not-a-url",
        ...validSupabaseInput,
      }),
    ).toThrow("NEXT_PUBLIC_APP_URL must be an absolute http(s) URL");
  });

  it("rejects non-http application protocols", () => {
    expect(() =>
      parseEnvironment({
        NEXT_PUBLIC_APP_URL: "javascript:alert(1)",
        ...validSupabaseInput,
      }),
    ).toThrow("NEXT_PUBLIC_APP_URL must be an absolute http(s) URL");
  });

  it("rejects a missing Supabase URL", () => {
    expect(() =>
      parseEnvironment({
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
      }),
    ).toThrow("NEXT_PUBLIC_SUPABASE_URL must be an absolute http(s) URL");
  });

  it("rejects malformed or non-http Supabase URLs", () => {
    for (const value of ["not-a-url", "javascript:alert(1)"]) {
      expect(() =>
        parseEnvironment({
          NEXT_PUBLIC_SUPABASE_URL: value,
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_example",
        }),
      ).toThrow("NEXT_PUBLIC_SUPABASE_URL must be an absolute http(s) URL");
    }
  });

  it("rejects a missing Supabase publishable key", () => {
    expect(() =>
      parseEnvironment({
        NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
      }),
    ).toThrow("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be non-empty");
  });

  it("rejects a blank Supabase publishable key", () => {
    for (const value of ["", "   "]) {
      expect(() =>
        parseEnvironment({
          NEXT_PUBLIC_SUPABASE_URL: "https://project.supabase.co",
          NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: value,
        }),
      ).toThrow("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be non-empty");
    }
  });
});
