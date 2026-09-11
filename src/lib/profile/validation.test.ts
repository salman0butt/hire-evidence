import { describe, expect, it } from "vitest";

import { validateDisplayName } from "./validation";

describe("validateDisplayName", () => {
  it("normalizes missing and blank display names to null", () => {
    expect(validateDisplayName(null)).toEqual({
      ok: true,
      value: { displayName: null },
    });
    expect(validateDisplayName("   ")).toEqual({
      ok: true,
      value: { displayName: null },
    });
  });

  it("trims a valid display name", () => {
    expect(validateDisplayName("  Salman Butt  ")).toEqual({
      ok: true,
      value: { displayName: "Salman Butt" },
    });
  });

  it("accepts exactly 120 characters", () => {
    const displayName = "a".repeat(120);

    expect(validateDisplayName(displayName)).toEqual({
      ok: true,
      value: { displayName },
    });
  });

  it("rejects display names longer than 120 characters after trimming", () => {
    expect(validateDisplayName(` ${"a".repeat(121)} `)).toEqual({
      ok: false,
      message: "Display name must be 120 characters or fewer.",
    });
  });

  it("rejects non-string form values", () => {
    const file = new File(["name"], "name.txt", { type: "text/plain" });

    expect(validateDisplayName(file)).toEqual({
      ok: false,
      message: "Display name must be text.",
    });
  });
});
