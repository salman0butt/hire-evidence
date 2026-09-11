import { describe, expect, it } from "vitest";

import { safeInternalPath } from "./safe-redirect";

describe("safeInternalPath", () => {
  it("accepts internal application paths", () => {
    expect(safeInternalPath("/app", "/fallback")).toBe("/app");
    expect(safeInternalPath("/app/profile", "/fallback")).toBe("/app/profile");
  });

  it("rejects protocol-relative and absolute external destinations", () => {
    expect(safeInternalPath("//evil.example", "/fallback")).toBe("/fallback");
    expect(safeInternalPath("https://evil.example", "/fallback")).toBe("/fallback");
  });

  it("rejects backslash network-path variants", () => {
    expect(safeInternalPath("/\\evil.example", "/fallback")).toBe("/fallback");
  });

  it("rejects empty and non-slash paths", () => {
    expect(safeInternalPath("", "/fallback")).toBe("/fallback");
    expect(safeInternalPath("app/profile", "/fallback")).toBe("/fallback");
  });
});
