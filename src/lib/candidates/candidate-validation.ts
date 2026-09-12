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

export function validateCandidateInput(
  _input: CandidateInput,
): CandidateValidationResult {
  return {
    ok: false,
    message: "Candidate validation is not implemented.",
  };
}
