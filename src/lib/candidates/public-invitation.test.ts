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
      },
    });

    expect(rpc).toHaveBeenCalledWith("resolve_public_candidate_invitation", {
      p_token_hash: hashInvitationToken(rawToken),
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
