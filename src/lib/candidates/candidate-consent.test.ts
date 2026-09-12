import { beforeEach, describe, expect, it, vi } from "vitest";

import { hashInvitationToken } from "./invitation-token";
import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const rawToken = "candidate-consent-token";

async function loadConsentBoundary() {
  const modulePath = "./candidate-consent";
  return (await import(modulePath)) as {
    recordCandidateConsent: (
      token: string,
    ) => Promise<{ status: "recorded" } | { status: "unavailable" }>;
  };
}

function rpcClient(result: { data: unknown; error: unknown }) {
  const rpc = vi.fn().mockResolvedValue(result);
  mockedCreateClient.mockResolvedValue({ rpc } as never);
  return rpc;
}

describe("candidate consent boundary", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hashes the raw token and records the current disclosure version", async () => {
    const rpc = rpcClient({ data: true, error: null });
    const { recordCandidateConsent } = await loadConsentBoundary();

    await expect(recordCandidateConsent(rawToken)).resolves.toEqual({
      status: "recorded",
    });
    expect(rpc).toHaveBeenCalledWith("record_candidate_invitation_consent", {
      p_token_hash: hashInvitationToken(rawToken),
      p_disclosure_version: "candidate-interview-v1",
    });
  });

  it.each([
    { data: false, error: null },
    { data: null, error: { message: "provider details" } },
  ])("returns one safe unavailable shape when consent cannot be recorded", async (result) => {
    rpcClient(result);
    const { recordCandidateConsent } = await loadConsentBoundary();

    await expect(recordCandidateConsent(rawToken)).resolves.toEqual({
      status: "unavailable",
    });
  });
});
