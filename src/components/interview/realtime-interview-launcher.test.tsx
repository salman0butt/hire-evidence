import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { RealtimeInterviewSessionSnapshot } from "@/lib/realtime/interview-session";

import { RealtimeInterviewLauncher } from "./realtime-interview-launcher";

describe("RealtimeInterviewLauncher", () => {
  it("authorizes the candidate capability and starts production runtime only after an explicit start action", async () => {
    const authorization = {
      status: "authorized" as const,
      attemptId: "attempt-1",
      interviewerVersionId: "version-1",
      durationSeconds: 1800,
      language: "en",
      interviewPlan: {
        versionId: "version-1",
        sections: [],
      },
      providerCredential: {
        credential: "ephemeral-secret",
        expiresAt: "2026-09-14T11:30:00.000Z",
      },
    };
    const authorize = vi.fn().mockResolvedValue(authorization);
    const start = vi.fn(async () => undefined);
    const createRuntime = vi.fn(() => ({
      start,
      stop: vi.fn(async () => undefined),
      setMuted: vi.fn(),
      completeCurrentQuestion: vi.fn(async () => undefined),
      getSnapshot: vi.fn(() => ({
        status: "active" as const,
        generation: 1,
        currentQuestion: null,
      })),
    }));

    render(
      <RealtimeInterviewLauncher
        token="candidate-capability"
        authorize={authorize}
        createRuntime={createRuntime}
      />,
    );

    expect(authorize).not.toHaveBeenCalled();
    expect(createRuntime).not.toHaveBeenCalled();

    fireEvent.click(screen.getByRole("button", { name: "Start live interview" }));

    await waitFor(() => {
      expect(authorize).toHaveBeenCalledWith("candidate-capability");
      expect(createRuntime).toHaveBeenCalledWith(
        authorization,
        expect.any(Function),
        "candidate-capability",
      );
      expect(start).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Live interview connected",
    );
    expect(screen.queryByText("ephemeral-secret")).not.toBeInTheDocument();
  });

  it("shows the authorized current question and candidate controls after connection", async () => {
    const authorize = vi.fn().mockResolvedValue({
      status: "authorized" as const,
      attemptId: "attempt-1",
      interviewerVersionId: "version-1",
      durationSeconds: 1800,
      language: "en",
      interviewPlan: { versionId: "version-1", sections: [] },
      providerCredential: {
        credential: "ephemeral-secret",
        expiresAt: "2026-09-14T11:30:00.000Z",
      },
    });
    const stop = vi.fn(async () => undefined);
    const setMuted = vi.fn();
    const createRuntime = vi.fn(() => ({
      start: vi.fn(async () => undefined),
      stop,
      setMuted,
      completeCurrentQuestion: vi.fn(async () => undefined),
      getSnapshot: vi.fn(() => ({
        status: "active" as const,
        generation: 3,
        currentQuestion: {
          sectionId: "section-1",
          sectionTitle: "Systems design",
          questionId: "question-1",
          prompt: "Describe a production system design decision you owned.",
        },
      })),
    }));

    render(
      <RealtimeInterviewLauncher
        token="candidate-capability"
        authorize={authorize}
        createRuntime={createRuntime}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start live interview" }));

    expect(await screen.findByText("Systems design")).toBeVisible();
    expect(
      screen.getByText("Describe a production system design decision you owned."),
    ).toBeVisible();

    fireEvent.click(screen.getByRole("button", { name: "Mute microphone" }));
    expect(setMuted).toHaveBeenCalledWith(true);

    fireEvent.click(screen.getByRole("button", { name: "End interview" }));
    await waitFor(() => expect(stop).toHaveBeenCalledTimes(1));
  });

  it("updates the visible question when the runtime publishes a new authoritative snapshot", async () => {
    const authorize = vi.fn().mockResolvedValue({
      status: "authorized" as const,
      attemptId: "attempt-1",
      interviewerVersionId: "version-1",
      durationSeconds: 1800,
      language: "en",
      interviewPlan: { versionId: "version-1", sections: [] },
      providerCredential: {
        credential: "ephemeral-secret",
        expiresAt: "2026-09-14T11:30:00.000Z",
      },
    });
    let publishSnapshot:
      | ((snapshot: RealtimeInterviewSessionSnapshot) => void)
      | undefined;
    const initialSnapshot: RealtimeInterviewSessionSnapshot = {
      status: "active",
      generation: 1,
      currentQuestion: {
        sectionId: "section-1",
        sectionTitle: "Experience",
        questionId: "question-1",
        prompt: "Describe a relevant project.",
      },
    };
    const createRuntime = vi.fn(
      (
        _authorization: unknown,
        onSnapshot?: (snapshot: RealtimeInterviewSessionSnapshot) => void,
      ) => {
        publishSnapshot = onSnapshot;
        return {
          start: vi.fn(async () => undefined),
          stop: vi.fn(async () => undefined),
          setMuted: vi.fn(),
          completeCurrentQuestion: vi.fn(async () => undefined),
          getSnapshot: vi.fn(() => initialSnapshot),
        };
      },
    );

    render(
      <RealtimeInterviewLauncher
        token="candidate-capability"
        authorize={authorize}
        createRuntime={createRuntime}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start live interview" }));
    expect(await screen.findByText("Describe a relevant project.")).toBeVisible();
    expect(publishSnapshot).toEqual(expect.any(Function));

    act(() => {
      publishSnapshot?.({
        status: "active",
        generation: 1,
        currentQuestion: {
          sectionId: "section-1",
          sectionTitle: "Experience",
          questionId: "question-2",
          prompt: "What trade-off did you make?",
        },
      });
    });

    expect(await screen.findByText("What trade-off did you make?")).toBeVisible();
    expect(screen.queryByText("Describe a relevant project.")).not.toBeInTheDocument();
  });

  it("shows one constant-safe failure when authorization is unavailable", async () => {
    const authorize = vi.fn().mockResolvedValue({ status: "unavailable" });
    const createRuntime = vi.fn();

    render(
      <RealtimeInterviewLauncher
        token="candidate-capability"
        authorize={authorize}
        createRuntime={createRuntime}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start live interview" }));

    expect(
      await screen.findByRole("alert"),
    ).toHaveTextContent("The live interview could not be started. Please try again.");
    expect(createRuntime).not.toHaveBeenCalled();
  });

  it("fails safely when the production runtime cannot start", async () => {
    const authorize = vi.fn().mockResolvedValue({
      status: "authorized" as const,
      attemptId: "attempt-1",
      interviewerVersionId: "version-1",
      durationSeconds: 1800,
      language: "en",
      interviewPlan: { versionId: "version-1", sections: [] },
      providerCredential: {
        credential: "ephemeral-secret",
        expiresAt: "2026-09-14T11:30:00.000Z",
      },
    });
    const createRuntime = vi.fn(() => ({
      start: vi.fn(async () => {
        throw new Error("provider-specific secret detail");
      }),
      stop: vi.fn(async () => undefined),
      setMuted: vi.fn(),
      completeCurrentQuestion: vi.fn(async () => undefined),
      getSnapshot: vi.fn(() => ({
        status: "active" as const,
        generation: 1,
        currentQuestion: null,
      })),
    }));

    render(
      <RealtimeInterviewLauncher
        token="candidate-capability"
        authorize={authorize}
        createRuntime={createRuntime}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start live interview" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "The live interview could not be started. Please try again.",
    );
    expect(screen.queryByText(/provider-specific/i)).not.toBeInTheDocument();
  });
});