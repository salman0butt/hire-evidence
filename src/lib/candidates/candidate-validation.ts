export type CandidateInput = {
  fullName?: unknown;
  email?: unknown;
};

export type CandidateValidationResult =
  | {
      ok: true;
      value: {
        fullName: string;
        email: string;
      };
    }
  | {
      ok: false;
      message: string;
    };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateCandidateInput(
  input: CandidateInput,
): CandidateValidationResult {
  const fullName = typeof input.fullName === "string" ? input.fullName.trim() : "";
  const email =
    typeof input.email === "string" ? input.email.trim().toLowerCase() : "";

  if (!fullName) {
    return { ok: false, message: "Candidate name is required." };
  }

  if (fullName.length > 200) {
    return {
      ok: false,
      message: "Candidate name must be 200 characters or fewer.",
    };
  }

  if (!email) {
    return { ok: false, message: "Candidate email is required." };
  }

  if (email.length > 320) {
    return {
      ok: false,
      message: "Candidate email must be 320 characters or fewer.",
    };
  }

  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, message: "Candidate email must be valid." };
  }

  return {
    ok: true,
    value: {
      fullName,
      email,
    },
  };
}
