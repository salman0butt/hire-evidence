export type CompetencyInput = Readonly<{
  name: string;
  description: string | null;
  weight: number;
  position: number;
}>;

type CompetencyValidationSuccess = Readonly<{
  ok: true;
  value: CompetencyInput;
}>;

type CompetencyValidationFailure = Readonly<{
  ok: false;
  message: string;
}>;

export type CompetencyValidationResult =
  | CompetencyValidationSuccess
  | CompetencyValidationFailure;

type RawCompetencyInput = Readonly<{
  name: unknown;
  description?: unknown;
  weight: unknown;
  position: unknown;
}>;

export function validateCompetencyInput(
  input: RawCompetencyInput,
): CompetencyValidationResult {
  if (typeof input.name !== "string") {
    return { ok: false, message: "Competency name must be text." };
  }

  const name = input.name.trim();
  if (!name) {
    return { ok: false, message: "Competency name is required." };
  }
  if (name.length > 160) {
    return {
      ok: false,
      message: "Competency name must be 160 characters or fewer.",
    };
  }

  let description: string | null = null;
  if (input.description !== null && input.description !== undefined) {
    if (typeof input.description !== "string") {
      return { ok: false, message: "Competency description must be text." };
    }

    const normalizedDescription = input.description.trim();
    if (normalizedDescription.length > 2000) {
      return {
        ok: false,
        message: "Competency description must be 2000 characters or fewer.",
      };
    }
    description = normalizedDescription || null;
  }

  if (
    typeof input.weight !== "number" ||
    !Number.isFinite(input.weight) ||
    input.weight <= 0 ||
    input.weight > 100
  ) {
    return {
      ok: false,
      message: "Competency weight must be greater than 0 and at most 100.",
    };
  }

  if (
    typeof input.position !== "number" ||
    !Number.isInteger(input.position) ||
    input.position < 0
  ) {
    return {
      ok: false,
      message: "Competency position must be a non-negative integer.",
    };
  }

  return {
    ok: true,
    value: {
      name,
      description,
      weight: input.weight,
      position: input.position,
    },
  };
}
