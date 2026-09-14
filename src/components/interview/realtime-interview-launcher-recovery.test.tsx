import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RealtimeInterviewLauncher } from "./realtime-interview-launcher";

describe("RealtimeInterviewLauncher recovery", () => {
  it("stops the stale runtime and reauthorizes the same candidate capability after a recoverable provider failure", async () => {
    const authorization = {
      status: "authorized" as const,
      attemptId: "attempt-1",
      interviewerVersionId: "version-1",
      durationSeconds: 1800,
      language: "en",
      interviewPlan: { versionId: "version-1", sections: [] },
      providerCredential: {
        credential: "ephemeral-secret",
        expiresAt: "2026-09-14T13:30:00.000Z",
      },
    };
    const authorize = vi.fn().mockResolvedValue(authorization);
    const stops = [vi.fn(async () => undefined), vi.fn(async () => undefined)];
    const starts = [vi.fn(async () => undefined), vi.fn(async () => undefined)];
    const recoveryHandlers: Array<((failure: { kind: string }) => void) | undefined> = [];
    let runtimeIndex = 0;
    const createRuntime = vi.fn((...args: unknown[]) => {
      recoveryHandlers.push(args[3] as ((failure: { kind: string }) => void) | undefined);
      const index = runtimeIndex++;
      return {
        start: starts[index] ?? vi.fn(async () => undefined),
        stop: stops[index] ?? vi.fn(async () => undefined),
        setMuted: vi.fn(),
        completeCurrentQuestion: vi.fn(async () => undefined),
        getSnapshot: vi.fn(() => ({
          status: "active" as const,
          generation: index + 1,
          currentQuestion: null,
        })),
      };
    });

    render(
      <RealtimeInterviewLauncher
        token="candidate-capability"
        authorize={authorize}
        createRuntime={createRuntime}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start live interview" }));
    await waitFor(() => expect(starts[0]).toHaveBeenCalledTimes(1));

    expect(recoveryHandlers[0]).toEqual(expect.any(Function));

    act(() => {
      recoveryHandlers[0]?.({ kind: "provider-error" });
    });

    await waitFor(() => {
      expect(stops[0]).toHaveBeenCalledTimes(1);
      expect(authorize).toHaveBeenCalledTimes(2);
      expect(authorize).toHaveBeenNthCalledWith(1, "candidate-capability");
      expect(authorize).toHaveBeenNthCalledWith(2, "candidate-capability");
      expect(createRuntime).toHaveBeenCalledTimes(2);
      expect(starts[1]).toHaveBeenCalledTimes(1);
    });

    expect(screen.getByRole("status")).toHaveTextContent("Live interview connected");
  });
});
