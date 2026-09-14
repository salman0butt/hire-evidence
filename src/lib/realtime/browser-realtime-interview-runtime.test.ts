import { afterEach, describe, expect, it, vi } from "vitest";

import { createBrowserRealtimeInterviewRuntime } from "./browser-realtime-interview-runtime";
import type { RealtimeSessionAuthorization } from "./session-authorization";

const authorization: Extract<
  RealtimeSessionAuthorization,
  { status: "authorized" }
> = {
  status: "authorized",
  attemptId: "attempt-1",
  interviewerVersionId: "version-1",
  durationSeconds: 1800,
  language: "en",
  interviewPlan: {
    versionId: "version-1",
    sections: [
      {
        id: "section-1",
        title: "Experience",
        questions: [
          {
            id: "question-1",
            prompt: "Describe a relevant project.",
            required: true,
            followUpLimit: 1,
          },
        ],
      },
    ],
  },
  providerCredential: {
    credential: "ephemeral-provider-token",
    expiresAt: "2026-09-14T13:00:00.000Z",
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("browser realtime interview runtime", () => {
  it("persists explicit question completion through the capability-bound progress route", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ status: "completed" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchImpl);

    const runtime = createBrowserRealtimeInterviewRuntime(
      authorization,
      undefined,
      "candidate capability/with spaces",
    );

    await runtime.completeCurrentQuestion("turn-1");

    expect(fetchImpl).toHaveBeenCalledWith(
      "/api/interview/candidate%20capability%2Fwith%20spaces/realtime-progress",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attemptId: "attempt-1",
          eventId: "turn-1",
          questionId: "question-1",
        }),
      },
    );
    expect(runtime.getSnapshot()).toMatchObject({
      status: "completed",
      currentQuestion: null,
    });
  });
});