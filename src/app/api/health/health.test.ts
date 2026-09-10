import { describe, expect, it } from "vitest";

import { getHealthPayload } from "./health";

describe("getHealthPayload", () => {
  it("returns a stable non-sensitive M00 health payload", () => {
    expect(getHealthPayload()).toEqual({ status: "ok", service: "hire-evidence", milestone: "M00" });
  });
});
