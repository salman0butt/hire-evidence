import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

import { listPendingOrganizationInvitations } from "./invitations";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const organizationId = "11111111-1111-4111-8111-111111111111";

function createQuery(result: { data: unknown; error: unknown }) {
  const query = {
    select: vi.fn(),
    eq: vi.fn(),
    is: vi.fn(),
    gt: vi.fn(),
    order: vi.fn(),
  };

  query.select.mockReturnValue(query);
  query.eq.mockReturnValue(query);
  query.is.mockReturnValue(query);
  query.gt.mockReturnValue(query);
  query.order
    .mockReturnValueOnce(query)
    .mockResolvedValueOnce(result as never);

  return query;
}

function mockSupabase(result: { data: unknown; error: unknown }) {
  const query = createQuery(result);
  const from = vi.fn().mockReturnValue(query);
  mockedCreateClient.mockResolvedValue({ from } as never);
  return { from, query };
}

describe("pending organization invitation repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists only active invitations for the route-bound organization in deterministic order", async () => {
    const { from, query } = mockSupabase({
      data: [
        {
          id: "22222222-2222-4222-8222-222222222222",
          email: "person@example.com",
          role: "reviewer",
          expires_at: "2026-09-18T12:00:00.000Z",
        },
      ],
      error: null,
    });

    const invitations = await listPendingOrganizationInvitations(organizationId);

    expect(from).toHaveBeenCalledWith("organization_invitations");
    expect(query.select).toHaveBeenCalledWith("id,email,role,expires_at");
    expect(query.eq).toHaveBeenCalledWith("organization_id", organizationId);
    expect(query.is).toHaveBeenNthCalledWith(1, "accepted_at", null);
    expect(query.is).toHaveBeenNthCalledWith(2, "revoked_at", null);
    expect(query.gt).toHaveBeenCalledWith("expires_at", expect.any(String));
    expect(query.order).toHaveBeenNthCalledWith(1, "created_at", { ascending: true });
    expect(query.order).toHaveBeenNthCalledWith(2, "id", { ascending: true });
    expect(invitations).toEqual([
      {
        id: "22222222-2222-4222-8222-222222222222",
        email: "person@example.com",
        role: "reviewer",
        expiresAt: "2026-09-18T12:00:00.000Z",
      },
    ]);
  });

  it("fails closed when the provider query fails", async () => {
    mockSupabase({ data: null, error: { message: "policy internals" } });

    await expect(listPendingOrganizationInvitations(organizationId)).rejects.toThrow(
      "Unable to load organization invitations.",
    );
  });

  it("rejects malformed provider rows instead of rendering untrusted role data", async () => {
    mockSupabase({
      data: [
        {
          id: "22222222-2222-4222-8222-222222222222",
          email: "person@example.com",
          role: "owner",
          expires_at: "2026-09-18T12:00:00.000Z",
        },
      ],
      error: null,
    });

    await expect(listPendingOrganizationInvitations(organizationId)).rejects.toThrow(
      "Invalid organization invitation data.",
    );
  });
});
