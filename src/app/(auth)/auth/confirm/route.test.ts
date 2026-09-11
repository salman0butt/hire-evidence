import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

import { GET } from "./route";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(),
}));

const mockedCreateClient = vi.mocked(createClient);

describe("GET /auth/confirm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://hire-evidence.example");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_URL", "https://project.supabase.co");
    vi.stubEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY", "sb_publishable_test");
  });

  afterEach(() => {
    vi.unstubAllEnvs();
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

  it("keeps successful confirmation redirects on the configured application origin", async () => {
    const verifyOtp = vi.fn().mockResolvedValue({ error: null });
    mockedCreateClient.mockResolvedValue({ auth: { verifyOtp } } as never);

    const response = await GET(
      new Request(
        "https://attacker.example/auth/confirm?token_hash=recovery-secret&type=recovery",
      ),
    );

    expect(response.headers.get("location")).toBe(
      "https://hire-evidence.example/auth/reset-password",
    );
  });

  it("keeps failed confirmation redirects on the configured application origin", async () => {
    mockedCreateClient.mockResolvedValue({
      auth: {
        verifyOtp: vi.fn().mockResolvedValue({ error: new Error("expired") }),
      },
    } as never);

    const response = await GET(
      new Request(
        "https://attacker.example/auth/confirm?token_hash=expired&type=recovery",
      ),
    );

    expect(response.headers.get("location")).toBe(
      "https://hire-evidence.example/auth/forgot-password?error=recovery",
    );
  });
});
