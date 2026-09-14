import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import type { RealtimeInterviewSessionSnapshot } from "@/lib/realtime/interview-session";

import { RealtimeInterviewLauncher } from "./realtime-interview-launcher";

const emptyTranscript = {
  partials: { candidate: "", interviewer: "" },
  finalizedTurns: [],
} as const;

const authorization = {
  status: "authorized" as const,
  attemptId: "attempt-1",
  interviewerVersionId: "version-1",
  durationSeconds: 1800,
  language: "en",
  interviewPlan: { versionId: "version-1", sections: [] },
  providerCredential: {
    credential: "ephemeral-secret",
    expiresAt: "2026-09-15T00:30:00.000Z",
  },
};

const activeSnapshot = {
  status: "active" as const,
  generation: 1,
  currentQuestion: {
    sectionId: "section-1",
    sectionTitle: "Systems design",
    questionId: "question-1",
    prompt: "Describe a production system design decision you owned.",
  },
  transcript: emptyTranscript,
};

function successfulFinalizationResponse() {
  return new Response(
    JSON.stringify({
      status: "completed",
      attemptId: "attempt-1",
      completedAt: "2026-09-14T21:30:00.000Z",
      durationSeconds: 600,
    }),
    { status: 200, headers: { "content-type": "application/json" } },
  );
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("RealtimeInterviewLauncher finalization", () => {
  it("finalizes the authoritative attempt when the candidate ends the interview", async () => {
    const authorize = vi.fn().mockResolvedValue(authorization);
    const stop = vi.fn(async () => undefined);
    const createRuntime = vi.fn(() => ({
      start: vi.fn(async () => undefined),
      stop,
      setMuted: vi.fn(),
      completeCurrentQuestion: vi.fn(async () => undefined),
      getSnapshot: vi.fn(() => activeSnapshot),
    }));
    const fetchMock = vi.fn().mockImplementation(async () => successfulFinalizationResponse());
    vi.stubGlobal("fetch", fetchMock);

    render(
      <RealtimeInterviewLauncher
        token="candidate-capability"
        authorize={authorize}
        createRuntime={createRuntime}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start live interview" }));
    expect(await screen.findByText("Systems design")).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "End interview" }));

    await waitFor(() => {
      expect(stop).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/interview/candidate-capability/realtime-finalize",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ attemptId: "attempt-1" }),
        },
      );
    });
    expect(screen.getByRole("status")).toHaveTextContent("Interview ended");
  });

  it("finalizes the authoritative attempt when the runtime completes naturally", async () => {
    const authorize = vi.fn().mockResolvedValue(authorization);
    const stop = vi.fn(async () => undefined);
    let publishSnapshot: ((snapshot: RealtimeInterviewSessionSnapshot) => void) | undefined;
    const createRuntime = vi.fn((_authorization, onSnapshot) => {
      publishSnapshot = onSnapshot;
      return {
        start: vi.fn(async () => undefined),
        stop,
        setMuted: vi.fn(),
        completeCurrentQuestion: vi.fn(async () => undefined),
        getSnapshot: vi.fn(() => activeSnapshot),
      };
    });
    const fetchMock = vi.fn().mockImplementation(async () => successfulFinalizationResponse());
    vi.stubGlobal("fetch", fetchMock);

    render(
      <RealtimeInterviewLauncher
        token="candidate-capability"
        authorize={authorize}
        createRuntime={createRuntime}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start live interview" }));
    expect(await screen.findByText("Systems design")).toBeVisible();

    await act(async () => {
      publishSnapshot?.({
        status: "completed",
        generation: 1,
        currentQuestion: null,
        transcript: emptyTranscript,
      });
    });

    await waitFor(() => {
      expect(stop).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledTimes(1);
      expect(fetchMock).toHaveBeenCalledWith(
        "/api/interview/candidate-capability/realtime-finalize",
        {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ attemptId: "attempt-1" }),
        },
      );
    });
    expect(screen.getByRole("status")).toHaveTextContent("Interview ended");
  });
});