import { describe, expect, it, vi } from "vitest";

import { createRealtimeSessionHandler } from "./route";

function request() {
  return new Request("https://hire-evidence.example/api/interview/capability-secret/realtime-session", {
    method: "POST",
  });
}

const context = {
  params: Promise.resolve({ token: "capability-secret" }),
};

describe("POST /api/interview/[token]/realtime-session", () => {
  it("returns one constant-safe unavailable response without echoing or logging the capability", async () => {
    const authorize = vi.fn().mockResolvedValue({ status: "unavailable" });
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => undefined);
    const consoleLog = vi.spyOn(console, "log").mockImplementation(() => undefined);

    const response = await createRealtimeSessionHandler(authorize)(request(), context);
    const body = await response.text();

    expect(authorize).toHaveBeenCalledWith("capability-secret");
    expect(response.status).toBe(404);
    expect(JSON.parse(body)).toEqual({ status: "unavailable" });
    expect(body).not.toContain("capability-secret");
    expect(consoleError).not.toHaveBeenCalled();
    expect(consoleLog).not.toHaveBeenCalled();

    consoleError.mockRestore();
    consoleLog.mockRestore();
  });

  it("returns only the narrow candidate session projection on success", async () => {
    const authorize = vi.fn().mockResolvedValue({
      status: "authorized",
      attemptId: "attempt-1",
      interviewerVersionId: "internal-version-1",
      durationSeconds: 1800,
      language: "en",
      providerCredential: {
        credential: "short-lived-provider-token",
        expiresAt: "2026-09-12T13:00:00.000Z",
      },
    });

    const response = await createRealtimeSessionHandler(authorize)(request(), context);

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      status: "authorized",
      attemptId: "attempt-1",
      durationSeconds: 1800,
      language: "en",
      providerCredential: {
        credential: "short-lived-provider-token",
        expiresAt: "2026-09-12T13:00:00.000Z",
      },
    });
  });

  it("maps unexpected server/provider failures to a constant-safe retryable response", async () => {
    const authorize = vi.fn().mockRejectedValue(new Error("provider-secret details"));

    const response = await createRealtimeSessionHandler(authorize)(request(), context);
    const body = await response.text();

    expect(response.status).toBe(503);
    expect(JSON.parse(body)).toEqual({ status: "unavailable" });
    expect(body).not.toContain("provider-secret details");
    expect(body).not.toContain("capability-secret");
  });
});
