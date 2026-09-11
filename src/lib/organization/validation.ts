type OrganizationInput = Readonly<{
  name: unknown;
  companySize: unknown;
  hiringUseCase: unknown;
}>;

type OrganizationValidationSuccess = Readonly<{
  ok: true;
  value: Readonly<{
    name: string;
    companySize: string | null;
    hiringUseCase: string | null;
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

  return {
    ok: true,
    value: {
      name,
      companySize: companySize.value,
      hiringUseCase: hiringUseCase.value,
    },
  };
}
