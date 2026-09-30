import { describe, expect, it } from "vitest";

import { validateOrganizationInput } from "./validation";

describe("validateOrganizationInput", () => {
  it("normalizes valid organization fields", () => {
    expect(
      validateOrganizationInput({
        name: "  Acme Hiring  ",
        companySize: "  51-200  ",
        hiringUseCase: "  Structured engineering interviews  ",
      }),
    ).toEqual({
      ok: true,
      value: {
        name: "Acme Hiring",
        companySize: "51-200",
        hiringUseCase: "Structured engineering interviews",
      },
    });
  });


  it("normalizes bounded inert organization branding fields", () => {
    const input = {
      name: "Acme",
      companySize: null,
      hiringUseCase: null,
      logoUrl: "  https://cdn.acme.test/logo.svg  ",
      accentColor: "  #1A2B3C  ",
      welcomeText: "  Welcome to your structured interview.  ",
    };

    expect(validateOrganizationInput(input)).toEqual({
      ok: true,
      value: {
        name: "Acme",
        companySize: null,
        hiringUseCase: null,
        logoUrl: "https://cdn.acme.test/logo.svg",
        accentColor: "#1A2B3C",
        welcomeText: "Welcome to your structured interview.",
      },
    });
  });

  it.each([
    ["http://cdn.acme.test/logo.svg", null, null, "Organization logo URL must use https."],
    ["javascript:alert(1)", null, null, "Organization logo URL must use https."],
    [null, "red", null, "Organization accent color must be a #RRGGBB hex color."],
    [null, "#12345G", null, "Organization accent color must be a #RRGGBB hex color."],
    [null, null, "x".repeat(501), "Organization welcome text must be 500 characters or fewer."],
  ])("rejects unsafe or unbounded branding values", (logoUrl, accentColor, welcomeText, message) => {
    const input = {
      name: "Acme",
      companySize: null,
      hiringUseCase: null,
      logoUrl,
      accentColor,
      welcomeText,
    };

    expect(validateOrganizationInput(input)).toEqual({ ok: false, message });
  });

  it("normalizes optional blank fields to null", () => {
    expect(
      validateOrganizationInput({
        name: "Acme",
        companySize: "   ",
        hiringUseCase: null,
      }),
    ).toEqual({
      ok: true,
      value: { name: "Acme", companySize: null, hiringUseCase: null },
    });
  });

  it.each([
    [{ name: "", companySize: null, hiringUseCase: null }, "Organization name is required."],
    [
      { name: "x".repeat(121), companySize: null, hiringUseCase: null },
      "Organization name must be 120 characters or fewer.",
    ],
    [
      { name: "Acme", companySize: "x".repeat(81), hiringUseCase: null },
      "Company size must be 80 characters or fewer.",
    ],
    [
      { name: "Acme", companySize: null, hiringUseCase: "x".repeat(501) },
      "Hiring use case must be 500 characters or fewer.",
    ],
  ] as const)("rejects invalid bounded text", (input, message) => {
    expect(validateOrganizationInput(input)).toEqual({ ok: false, message });
  });

  it.each([
    [{ name: 42, companySize: null, hiringUseCase: null }, "Organization name must be text."],
    [{ name: "Acme", companySize: 42, hiringUseCase: null }, "Company size must be text."],
    [{ name: "Acme", companySize: null, hiringUseCase: 42 }, "Hiring use case must be text."],
  ] as const)("rejects non-text form values", (input, message) => {
    expect(validateOrganizationInput(input)).toEqual({ ok: false, message });
  });
});
