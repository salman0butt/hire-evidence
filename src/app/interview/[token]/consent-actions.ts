"use server";

import { recordCandidateConsent } from "@/lib/candidates/candidate-consent";

export type CandidateConsentActionState = Readonly<{
  status: "idle" | "success" | "error";
  message: string | null;
}>;

function errorState(message: string): CandidateConsentActionState {
  return { status: "error", message };
}

export async function recordCandidateConsentAction(
  token: string,
  _previousState: CandidateConsentActionState,
  formData: FormData,
): Promise<CandidateConsentActionState> {
  if (formData.get("consent") !== "accepted") {
    return errorState("Confirm the disclosures before continuing.");
  }

  const result = await recordCandidateConsent(token);
  if (result.status !== "recorded") {
    return errorState("This invitation is no longer available for consent.");
  }

  return { status: "success", message: "Consent recorded." };
}
