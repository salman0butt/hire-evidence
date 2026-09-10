import { describe, expect, it } from "vitest";

import { parseEnvironment } from "./env";

describe("parseEnvironment", () => {
  it("uses safe local defaults when foundation variables are omitted", () => {
    const env = parseEnvironment({});
    expect(env.nodeEnv).toBe("development");
    expect(env.appUrl.href).toBe("http://localhost:3000/");
  });

  it("accepts a valid absolute http or https application URL", () => {
    const env = parseEnvironment({ NODE_ENV: "production", NEXT_PUBLIC_APP_URL: "https://interviews.example.com/base" });
    expect(env.nodeEnv).toBe("production");
    expect(env.appUrl.href).toBe("https://interviews.example.com/base");
  });

  it("rejects malformed application URLs", () => {
    expect(() => parseEnvironment({ NEXT_PUBLIC_APP_URL: "not-a-url" })).toThrow("NEXT_PUBLIC_APP_URL must be an absolute http(s) URL");
  });

  it("rejects non-http protocols", () => {
    expect(() => parseEnvironment({ NEXT_PUBLIC_APP_URL: "javascript:alert(1)" })).toThrow("NEXT_PUBLIC_APP_URL must be an absolute http(s) URL");
  });
});
