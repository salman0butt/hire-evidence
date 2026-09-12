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
          invitation: { organizationName: string; jobTitle: string };
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

describe("public invitation resolver", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("hashes the raw token server-side and returns only the safe public projection", async () => {
    const rpc = rpcClient({
      data: [{ organization_name: "Evidence Labs", job_title: "Senior Engineer" }],
      error: null,
    });
    const { resolvePublicInvitation } = await loadResolver();

    await expect(resolvePublicInvitation(rawToken)).resolves.toEqual({
      status: "available",
      invitation: {
        organizationName: "Evidence Labs",
        jobTitle: "Senior Engineer",
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
    { data: null, error: { message: "provider details" } },
  ])("returns one constant unavailable shape for unusable invitations", async (result) => {
    rpcClient(result);
    const { resolvePublicInvitation } = await loadResolver();

    await expect(resolvePublicInvitation(rawToken)).resolves.toEqual({
      status: "unavailable",
    });
  });
});
