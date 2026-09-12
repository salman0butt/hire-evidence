import { hashInvitationToken } from "./invitation-token";
import { createClient } from "@/lib/supabase/server";

export type CandidateConsentResult =
  | Readonly<{ status: "recorded" }>
  | Readonly<{ status: "unavailable" }>;

const unavailable: CandidateConsentResult = { status: "unavailable" };

export async function recordCandidateConsent(
  rawToken: string,
): Promise<CandidateConsentResult> {
  if (!rawToken) return unavailable;

  const supabase = await createClient();
  const { data, error } = await supabase.rpc("record_candidate_invitation_consent", {
    p_token_hash: hashInvitationToken(rawToken),
    p_disclosure_version: "candidate-interview-v1",
  });

  if (error || data !== true) return unavailable;

  return { status: "recorded" };
}
