import { hashInvitationToken } from "./invitation-token";
import { createClient } from "@/lib/supabase/server";

export type PublicInvitationProjection = Readonly<{
  organizationName: string;
  jobTitle: string;
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
}>;

const unavailable: PublicInvitationResolution = { status: "unavailable" };

function parseProjection(row: PublicInvitationRow): PublicInvitationProjection | null {
  if (
    typeof row.organization_name !== "string" ||
    !row.organization_name.trim() ||
    typeof row.job_title !== "string" ||
    !row.job_title.trim()
  ) {
    return null;
  }

  return {
    organizationName: row.organization_name,
    jobTitle: row.job_title,
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
