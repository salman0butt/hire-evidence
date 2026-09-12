import { beforeEach, describe, expect, it, vi } from "vitest";

import { recordCandidateConsent } from "@/lib/candidates/candidate-consent";

vi.mock("@/lib/candidates/candidate-consent", () => ({
  recordCandidateConsent: vi.fn(),
}));

const mockedRecordCandidateConsent = vi.mocked(recordCandidateConsent);
const token = "route-bound-candidate-token";
const idleState = { status: "idle" as const, message: null };

async function loadConsentAction() {
  const modulePath = "./consent-actions";
  return (await import(modulePath)) as {
    recordCandidateConsentAction: (
      token: string,
      previousState: typeof idleState,
      formData: FormData,
    ) => Promise<{
      status: "idle" | "success" | "error";
      message: string | null;
    }>;
  };
}

describe("candidate consent server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("requires an explicit consent checkbox before persistence", async () => {
    const { recordCandidateConsentAction } = await loadConsentAction();

    await expect(
      recordCandidateConsentAction(token, idleState, new FormData()),
    ).resolves.toEqual({
      status: "error",
      message: "Confirm the disclosures before continuing.",
    });
    expect(mockedRecordCandidateConsent).not.toHaveBeenCalled();
  });

  it("records consent only against the route-bound invitation token", async () => {
    mockedRecordCandidateConsent.mockResolvedValue({ status: "recorded" });
    const { recordCandidateConsentAction } = await loadConsentAction();
    const formData = new FormData();
    formData.set("consent", "accepted");
    formData.set("token", "forged-form-token");

    await expect(
      recordCandidateConsentAction(token, idleState, formData),
    ).resolves.toEqual({
      status: "success",
      message: "Consent recorded.",
    });
    expect(mockedRecordCandidateConsent).toHaveBeenCalledWith(token);
    expect(mockedRecordCandidateConsent).not.toHaveBeenCalledWith("forged-form-token");
  });

  it("returns one safe error when the invitation cannot record consent", async () => {
    mockedRecordCandidateConsent.mockResolvedValue({ status: "unavailable" });
    const { recordCandidateConsentAction } = await loadConsentAction();
    const formData = new FormData();
    formData.set("consent", "accepted");

    await expect(
      recordCandidateConsentAction(token, idleState, formData),
    ).resolves.toEqual({
      status: "error",
      message: "This invitation is no longer available for consent.",
    });
  });
});
