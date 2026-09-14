import { describe, expect, it } from "vitest";

import { createRealtimeSessionHandler } from "./realtime-session-handler";

describe("realtime session handler version binding", () => {
  it("returns the authoritative interviewer version required by the browser authorization contract", async () => {
    const handler = createRealtimeSessionHandler(async () => ({
      status: "authorized",
      attemptId: "attempt-1",
      interviewerVersionId: "version-1",
      durationSeconds: 1800,
      language: "English",
      interviewPlan: {
        versionId: "version-1",
        sections: [],
      },
      providerCredential: {
        credential: "short-lived-provider-credential",
        expiresAt: "2026-09-15T00:00:00.000Z",
      },
    }));

    const response = await handler(new Request("http://localhost"), {
      params: Promise.resolve({ token: "candidate-capability" }),
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      status: "authorized",
      attemptId: "attempt-1",
      interviewerVersionId: "version-1",
    });
  });
});
