import { hashInvitationToken } from "./invitation-token";
import { createClient } from "@/lib/supabase/server";

export type PublicInvitationProjection = Readonly<{
  organizationName: string;
  jobTitle: string;
  durationSeconds: number;
  interviewType: string;
  language: string;
  candidateInstructions: string;
  candidateSupportEmail: string | null;
  candidateSupportUrl: string | null;
}>;

export type PublicInvitationResolution =
  | Readonly<{
      status: "available";
      invitation: PublicInvitationProjection;
    }>
  | Readonly<{ status: "unavailable" }>;

type PublicInvitationRow = Readonly<{
  organization_name?: unknown;
  job_title?: unknown;
  duration_seconds?: unknown;
  interview_type?: unknown;
  language?: unknown;
  candidate_instructions?: unknown;
  candidate_support_email?: unknown;
  candidate_support_url?: unknown;
}>;

const unavailable: PublicInvitationResolution = { status: "unavailable" };
const SUPPORT_EMAIL_PATTERN = /^[^\s@]+@[^\s@]+$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && Boolean(value.trim());
}

function parseOptionalSupportEmail(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized.length <= 254 && SUPPORT_EMAIL_PATTERN.test(normalized)
    ? normalized
    : null;
}

function parseOptionalSupportUrl(value: unknown): string | null {
  if (value == null) return null;
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  if (!normalized || normalized.length > 2048) return null;

  try {
    const url = new URL(normalized);
    return url.protocol === "http:" || url.protocol === "https:"
      ? normalized
      : null;
  } catch {
    return null;
  }
}

function parseProjection(row: PublicInvitationRow): PublicInvitationProjection | null {
  if (
    !isNonEmptyString(row.organization_name) ||
    !isNonEmptyString(row.job_title) ||
    !Number.isInteger(row.duration_seconds) ||
    (row.duration_seconds as number) < 900 ||
    (row.duration_seconds as number) > 3600 ||
    !isNonEmptyString(row.interview_type) ||
    !isNonEmptyString(row.language) ||
    typeof row.candidate_instructions !== "string"
  ) {
    return null;
  }

  return {
    organizationName: row.organization_name,
    jobTitle: row.job_title,
    durationSeconds: row.duration_seconds as number,
    interviewType: row.interview_type,
    language: row.language,
    candidateInstructions: row.candidate_instructions,
    candidateSupportEmail: parseOptionalSupportEmail(row.candidate_support_email),
    candidateSupportUrl: parseOptionalSupportUrl(row.candidate_support_url),
  };
}

export async function resolvePublicInvitation(
  rawToken: string,
): Promise<PublicInvitationResolution> {
  if (!rawToken) return unavailable;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("resolve_public_candidate_invitation", {
    p_token_hash: hashInvitationToken(rawToken),
  });

  if (error || !Array.isArray(data) || data.length !== 1) return unavailable;

  const invitation = parseProjection(data[0] as PublicInvitationRow);
  if (!invitation) return unavailable;

  return { status: "available", invitation };
}
