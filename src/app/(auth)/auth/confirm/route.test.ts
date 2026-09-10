import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

import { GET } from "./route";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

const mockedCreateClient = vi.mocked(createClient);

describe("GET /auth/confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("verifies a recovery token server-side and redirects to the reset form", async () => {
    const verifyOtp = vi.fn().mockResolvedValue({ error: null });
    mockedCreateClient.mockResolvedValue({ auth: { verifyOtp } } as never);

    const response = await GET(
      new Request(
        "https://hire-evidence.example/auth/confirm?token_hash=recovery-secret&type=recovery",
      ),
    );

    expect(verifyOtp).toHaveBeenCalledWith({
      type: "recovery",
      token_hash: "recovery-secret",
    });
    expect(response.headers.get("location")).toBe(
      "https://hire-evidence.example/auth/reset-password",
    );
  });

  it("sends invalid or expired recovery tokens back to the recovery entry point", async () => {
    mockedCreateClient.mockResolvedValue({
      auth: {
        verifyOtp: vi.fn().mockResolvedValue({ error: new Error("expired") }),
      },
    } as never);

    const response = await GET(
      new Request(
        "https://hire-evidence.example/auth/confirm?token_hash=expired&type=recovery",
      ),
    );

    expect(response.headers.get("location")).toBe(
      "https://hire-evidence.example/auth/forgot-password?error=recovery",
    );
  });
});
