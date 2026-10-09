type OrganizationInput = Readonly<{
  name: unknown;
  companySize: unknown;
  hiringUseCase: unknown;
  logoUrl?: unknown;
  accentColor?: unknown;
  welcomeText?: unknown;
}>;

type OrganizationValidationSuccess = Readonly<{
  ok: true;
  value: Readonly<{
    name: string;
    companySize: string | null;
    hiringUseCase: string | null;
    logoUrl?: string | null;
    accentColor?: string | null;
    welcomeText?: string | null;
  }>;
}>;

type OrganizationValidationFailure = Readonly<{
  ok: false;
  message: string;
}>;

export type OrganizationValidationResult =
  | OrganizationValidationSuccess
  | OrganizationValidationFailure;

function normalizeOptionalText(
  value: unknown,
  fieldName: string,
  maxLength: number,
): { ok: true; value: string | null } | OrganizationValidationFailure {
  if (value === null || value === undefined) {
    return { ok: true, value: null };
  }

  if (typeof value !== "string") {
    return { ok: false, message: `${fieldName} must be text.` };
  }

  const normalized = value.trim();
  if (!normalized) {
    return { ok: true, value: null };
  }

  if (normalized.length > maxLength) {
    return {
      ok: false,
      message: `${fieldName} must be ${maxLength} characters or fewer.`,
    };
  }

  return { ok: true, value: normalized };
}

function normalizeLogoUrl(
  value: unknown,
): { ok: true; value: string | null } | OrganizationValidationFailure {
  const normalized = normalizeOptionalText(value, "Organization logo URL", 2048);
  if (!normalized.ok || normalized.value === null) {
    return normalized;
  }

  try {
    const url = new URL(normalized.value);
    if (url.protocol !== "https:") {
      return { ok: false, message: "Organization logo URL must use https." };
    }
  } catch {
    return { ok: false, message: "Organization logo URL must use https." };
  }

  return normalized;
}

function normalizeAccentColor(
  value: unknown,
): { ok: true; value: string | null } | OrganizationValidationFailure {
  const normalized = normalizeOptionalText(value, "Organization accent color", 7);
  if (!normalized.ok || normalized.value === null) {
    return normalized;
  }

  if (!/^#[0-9a-fA-F]{6}$/.test(normalized.value)) {
    return {
      ok: false,
      message: "Organization accent color must be a #RRGGBB hex color.",
    };
  }

  return normalized;
}

export function validateOrganizationInput(
  input: OrganizationInput,
): OrganizationValidationResult {
  if (typeof input.name !== "string") {
    return { ok: false, message: "Organization name must be text." };
  }

  const name = input.name.trim();
  if (!name) {
    return { ok: false, message: "Organization name is required." };
  }

  if (name.length > 120) {
    return {
      ok: false,
      message: "Organization name must be 120 characters or fewer.",
    };
  }

  const companySize = normalizeOptionalText(
    input.companySize,
    "Company size",
    80,
  );
  if (!companySize.ok) {
    return companySize;
  }

  const hiringUseCase = normalizeOptionalText(
    input.hiringUseCase,
    "Hiring use case",
    500,
  );
  if (!hiringUseCase.ok) {
    return hiringUseCase;
  }

  const value: OrganizationValidationSuccess["value"] = {
    name,
    companySize: companySize.value,
    hiringUseCase: hiringUseCase.value,
  };

  if ("logoUrl" in input) {
    const logoUrl = normalizeLogoUrl(input.logoUrl);
    if (!logoUrl.ok) {
      return logoUrl;
    }
    Object.assign(value, { logoUrl: logoUrl.value });
  }

  if ("accentColor" in input) {
    const accentColor = normalizeAccentColor(input.accentColor);
    if (!accentColor.ok) {
      return accentColor;
    }
    Object.assign(value, { accentColor: accentColor.value });
  }

  if ("welcomeText" in input) {
    const welcomeText = normalizeOptionalText(
      input.welcomeText,
      "Organization welcome text",
      500,
    );
    if (!welcomeText.ok) {
      return welcomeText;
    }
    Object.assign(value, { welcomeText: welcomeText.value });
  }

  return { ok: true, value };
}
