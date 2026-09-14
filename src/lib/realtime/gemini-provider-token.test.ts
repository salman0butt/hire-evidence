import { describe, expect, it, vi } from "vitest";

import { createGeminiProviderTokenAdapter } from "./gemini-provider-token";

const request = {
  attemptId: "attempt-1",
  interviewerVersionId: "version-1",
  durationSeconds: 1800,
  language: "en",
} as const;

describe("Gemini Live ephemeral credential adapter", () => {
  it("mints one constrained short-lived Live API credential without exposing the API key", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        JSON.stringify({
          name: "ephemeral-gemini-token",
          expireTime: "2026-09-14T08:04:00.000Z",
        }),
        { status: 200, headers: { "content-type": "application/json" } },
      ),
    );

    const issue = createGeminiProviderTokenAdapter({
      apiKey: "server-only-gemini-key",
      fetchImpl,
      now: () => new Date("2026-09-14T08:00:00.000Z"),
    });

    await expect(issue(request)).resolves.toEqual({
      credential: "ephemeral-gemini-token",
      expiresAt: "2026-09-14T08:04:00.000Z",
    });

    expect(fetchImpl).toHaveBeenCalledTimes(1);
    const [url, init] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe("https://generativelanguage.googleapis.com/v1beta/auth_tokens");
    expect(init.method).toBe("POST");
    expect(init.headers).toEqual({
      "Content-Type": "application/json",
      "x-goog-api-key": "server-only-gemini-key",
    });
    expect(String(init.body)).not.toContain("server-only-gemini-key");
    expect(JSON.parse(String(init.body))).toEqual({
      uses: 1,
      expireTime: "2026-09-14T08:04:00.000Z",
      newSessionExpireTime: "2026-09-14T08:01:00.000Z",
      liveConnectConstraints: {
        model: "models/gemini-3.1-flash-live-preview",
        config: {
          sessionResumption: {},
          responseModalities: ["AUDIO"],
        },
      },
    });
  });
});
