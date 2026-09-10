const MAX_DISPLAY_NAME_LENGTH = 120;

type ProfileValidationSuccess = Readonly<{
  ok: true;
  value: Readonly<{
    displayName: string | null;
  }>;
}>;

type ProfileValidationFailure = Readonly<{
  ok: false;
  message: string;
}>;

export type ProfileValidationResult =
  | ProfileValidationSuccess
  | ProfileValidationFailure;

export function validateDisplayName(
  value: FormDataEntryValue | null,
): ProfileValidationResult {
  if (value === null) {
    return { ok: true, value: { displayName: null } };
  }

  if (typeof value !== "string") {
    return { ok: false, message: "Display name must be text." };
  }

  const displayName = value.trim();

  if (!displayName) {
    return { ok: true, value: { displayName: null } };
  }

  if (displayName.length > MAX_DISPLAY_NAME_LENGTH) {
    return {
      ok: false,
      message: "Display name must be 120 characters or fewer.",
    };
  }

  return { ok: true, value: { displayName } };
}
