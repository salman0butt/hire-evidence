import { beforeEach, describe, expect, it, vi } from "vitest";

import { hashInvitationToken } from "./invitation-token";
import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const rawToken = "candidate-public-invitation-token";

async function loadResolver() {
  const modulePath = "./public-invitation";
  return (await import(modulePath)) as {
    resolvePublicInvitation: (token: string) => Promise<
      | {
          status: "available";
          invitation: {
            organizationName: string;
            jobTitle: string;
            durationSeconds: number;
            interviewType: string;
            language: string;
            candidateInstructions: string;
            candidateSupportEmail: string | null;
            candidateSupportUrl: string | null;
          };
        }
      | { status: "unavailable" }
    >;
  };
}

function rpcClient(result: { data: unknown; error: unknown }) {
  const rpc = vi.fn().mockResolvedValue(result);
  mockedCreateClient.mockResolvedValue({ rpc } as never);
  return rpc;
}

const validRow = {
  organization_name: "Evidence Labs",
  job_title: "Senior Engineer",
  duration_seconds: 2700,
  interview_type: "technical",
  language: "English",
  candidate_instructions: "Use a quiet room.",
  candidate_support_email: "candidates@evidence.test",
  candidate_support_url: "https://evidence.test/interview-support",
};

describe("public invitation resolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hashes the raw token server-side and returns only the safe public projection", async () => {
    const rpc = rpcClient({ data: [validRow], error: null });
    const { resolvePublicInvitation } = await loadResolver();

    await expect(resolvePublicInvitation(rawToken)).resolves.toEqual({
      status: "available",
      invitation: {
        organizationName: "Evidence Labs",
        jobTitle: "Senior Engineer",
        durationSeconds: 2700,
        interviewType: "technical",
        language: "English",
        candidateInstructions: "Use a quiet room.",
        candidateSupportEmail: "candidates@evidence.test",
        candidateSupportUrl: "https://evidence.test/interview-support",
      },
    });

    expect(rpc).toHaveBeenCalledWith("resolve_public_candidate_invitation", {
      p_token_hash: hashInvitationToken(rawToken),
    });
  });

  it("drops unsafe optional candidate support URLs without making the invitation unusable", async () => {
    rpcClient({
      data: [{ ...validRow, candidate_support_url: "javascript:alert(1)" }],
      error: null,
    });
    const { resolvePublicInvitation } = await loadResolver();

    await expect(resolvePublicInvitation(rawToken)).resolves.toMatchObject({
      status: "available",
      invitation: { candidateSupportUrl: null },
    });
  });

  it.each([
    { data: [], error: null },
    { data: null, error: null },
    { data: [{ organization_name: "Evidence Labs" }], error: null },
    { data: [{ ...validRow, duration_seconds: 899 }], error: null },
    { data: [{ ...validRow, duration_seconds: 3601 }], error: null },
    { data: [{ ...validRow, duration_seconds: "2700" }], error: null },
    { data: [{ ...validRow, interview_type: "" }], error: null },
    { data: [{ ...validRow, language: "" }], error: null },
    { data: [{ ...validRow, candidate_instructions: null }], error: null },
    { data: null, error: { message: "provider details" } },
  ])("returns one constant unavailable shape for unusable invitations", async (result) => {
    rpcClient(result);
    const { resolvePublicInvitation } = await loadResolver();

    await expect(resolvePublicInvitation(rawToken)).resolves.toEqual({
      status: "unavailable",
    });
  });
});
