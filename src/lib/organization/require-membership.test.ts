import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

import { requireOrganizationMembership } from "./require-membership";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  notFound: vi.fn(() => {
    throw new Error("NEXT_NOT_FOUND");
  }),
}));

const mockedCreateClient = vi.mocked(createClient);

function membershipClient(result: {
  data: unknown;
  error: unknown;
}) {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const eq = vi.fn(() => ({ maybeSingle }));
  const select = vi.fn(() => ({ eq }));
  const from = vi.fn(() => ({ select }));

  mockedCreateClient.mockResolvedValue({ from } as never);

  return { from, select, eq, maybeSingle };
}

describe("requireOrganizationMembership", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("rejects malformed organization ids before querying Supabase", async () => {
    await expect(requireOrganizationMembership("not-a-uuid")).rejects.toThrow(
      "NEXT_NOT_FOUND",
    );

    expect(mockedCreateClient).not.toHaveBeenCalled();
  });

  it("returns the RLS-visible organization context for a membership", async () => {
    const query = membershipClient({
      data: {
        role: "admin",
        organization: {
          id: "11111111-1111-4111-8111-111111111111",
          name: "Acme Hiring",
        },
      },
      error: null,
    });

    await expect(
      requireOrganizationMembership("11111111-1111-4111-8111-111111111111"),
    ).resolves.toEqual({
      organizationId: "11111111-1111-4111-8111-111111111111",
      organizationName: "Acme Hiring",
      role: "admin",
    });

    expect(query.from).toHaveBeenCalledWith("organization_memberships");
    expect(query.eq).toHaveBeenCalledWith(
      "organization_id",
      "11111111-1111-4111-8111-111111111111",
    );
  });

  it.each([
    { data: null, error: null },
    { data: null, error: new Error("row hidden by RLS") },
  ])("fails inaccessible and missing organizations uniformly", async (result) => {
    membershipClient(result);

    await expect(
      requireOrganizationMembership("11111111-1111-4111-8111-111111111111"),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });

  it("rejects unexpected role data rather than widening authorization", async () => {
    membershipClient({
      data: {
        role: "super_admin",
        organization: {
          id: "11111111-1111-4111-8111-111111111111",
          name: "Acme Hiring",
        },
      },
      error: null,
    });

    await expect(
      requireOrganizationMembership("11111111-1111-4111-8111-111111111111"),
    ).rejects.toThrow("NEXT_NOT_FOUND");
  });
});
