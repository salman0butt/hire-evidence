import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

import { requireUser } from "./require-user";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn((destination: string) => {
    throw new Error(`NEXT_REDIRECT:${destination}`);
  }),
}));

const mockedCreateClient = vi.mocked(createClient);

describe("requireUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns the server-validated authenticated user", async () => {
    const user = { id: "user-1", email: "person@example.com" };
    mockedCreateClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user }, error: null }) },
    } as never);

    await expect(requireUser("/app")).resolves.toEqual(user);
  });

  it("redirects unauthenticated requests to login with an internal next path", async () => {
    mockedCreateClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }) },
    } as never);

    await expect(requireUser("/app")).rejects.toThrow(
      "NEXT_REDIRECT:/auth/login?next=/app",
    );
  });
});
