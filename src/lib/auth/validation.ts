export type AuthCredentials = Readonly<{
  email: string;
  password: string;
}>;

export type AuthValidationResult =
  | Readonly<{ ok: true; value: AuthCredentials }>
  | Readonly<{ ok: false; message: string }>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 8;

export function validateAuthCredentials(input: {
  email: unknown;
  password: unknown;
}): AuthValidationResult {
  const email = typeof input.email === "string" ? input.email.trim() : "";
  const password = typeof input.password === "string" ? input.password : "";

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, message: "Enter a valid email address." };
  }

  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      message: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  return {
    ok: true,
    value: { email, password },
  };
}
