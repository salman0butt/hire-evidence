export type JobRequirementKind = "must_have" | "nice_to_have";

export type JobRequirementInput = Readonly<{
  kind: JobRequirementKind;
  requirement: string;
}>;

export type JobInput = Readonly<{
  title: string;
  department: string | null;
  description: string | null;
  responsibilities: string | null;
  seniority: string | null;
  employmentType: string | null;
  location: string | null;
  salaryRange: string | null;
  interviewInstructions: string | null;
  requirements: readonly JobRequirementInput[];
}>;

type JobValidationSuccess = Readonly<{
  ok: true;
  value: JobInput;
}>;

type JobValidationFailure = Readonly<{
  ok: false;
  message: string;
}>;

export type JobValidationResult = JobValidationSuccess | JobValidationFailure;

type RawJobInput = Readonly<{
  title: unknown;
  department?: unknown;
  description?: unknown;
  responsibilities?: unknown;
  seniority?: unknown;
  employmentType?: unknown;
  location?: unknown;
  salaryRange?: unknown;
  interviewInstructions?: unknown;
  requirements: unknown;
}>;

function normalizeOptionalText(
  value: unknown,
  fieldName: string,
  maxLength: number,
): { ok: true; value: string | null } | JobValidationFailure {
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

export function validateJobInput(input: RawJobInput): JobValidationResult {
  if (typeof input.title !== "string") {
    return { ok: false, message: "Job title must be text." };
  }

  const title = input.title.trim();
  if (!title) {
    return { ok: false, message: "Job title is required." };
  }
  if (title.length > 160) {
    return {
      ok: false,
      message: "Job title must be 160 characters or fewer.",
    };
  }

  const optionalFields = [
    ["department", "Department", 120],
    ["description", "Description", 10000],
    ["responsibilities", "Responsibilities", 10000],
    ["seniority", "Seniority", 80],
    ["employmentType", "Employment type", 80],
    ["location", "Location", 160],
    ["salaryRange", "Salary range", 160],
    ["interviewInstructions", "Interview instructions", 5000],
  ] as const;

  const normalizedOptional: Record<string, string | null> = {};
  for (const [key, label, maxLength] of optionalFields) {
    const result = normalizeOptionalText(input[key], label, maxLength);
    if (!result.ok) {
      return result;
    }
    normalizedOptional[key] = result.value;
  }

  if (!Array.isArray(input.requirements)) {
    return { ok: false, message: "Job requirements must be a list." };
  }

  const requirements: JobRequirementInput[] = [];
  for (const item of input.requirements) {
    if (item === null || typeof item !== "object" || Array.isArray(item)) {
      return { ok: false, message: "Each job requirement must be an object." };
    }

    const candidate = item as { kind?: unknown; requirement?: unknown };
    if (candidate.kind !== "must_have" && candidate.kind !== "nice_to_have") {
      return {
        ok: false,
        message: "Job requirement kind must be must_have or nice_to_have.",
      };
    }

    if (typeof candidate.requirement !== "string") {
      return { ok: false, message: "Job requirement must be text." };
    }

    const requirement = candidate.requirement.trim();
    if (!requirement) {
      return { ok: false, message: "Job requirement is required." };
    }
    if (requirement.length > 500) {
      return {
        ok: false,
        message: "Job requirement must be 500 characters or fewer.",
      };
    }

    requirements.push({ kind: candidate.kind, requirement });
  }

  return {
    ok: true,
    value: {
      title,
      department: normalizedOptional.department,
      description: normalizedOptional.description,
      responsibilities: normalizedOptional.responsibilities,
      seniority: normalizedOptional.seniority,
      employmentType: normalizedOptional.employmentType,
      location: normalizedOptional.location,
      salaryRange: normalizedOptional.salaryRange,
      interviewInstructions: normalizedOptional.interviewInstructions,
      requirements,
    },
  };
}
