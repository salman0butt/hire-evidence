export function safeInternalPath(
  value: FormDataEntryValue | string | null | undefined,
  fallback: string,
): string {
  if (typeof value !== "string") {
    return fallback;
  }

  const candidate = value.trim();

  if (
    !candidate.startsWith("/") ||
    candidate.startsWith("//") ||
    candidate.includes("\\")
  ) {
    return fallback;
  }

  return candidate;
}
