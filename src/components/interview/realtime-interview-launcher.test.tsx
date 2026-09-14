import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

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
      expect(createRuntime).toHaveBeenCalledWith(authorization);
      expect(start).toHaveBeenCalledTimes(1);
    });
    expect(screen.getByRole("status")).toHaveTextContent(
      "Live interview connected",
    );
    expect(screen.queryByText("ephemeral-secret")).not.toBeInTheDocument();
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
