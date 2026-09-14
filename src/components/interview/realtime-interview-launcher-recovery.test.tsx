import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

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
    expiresAt: "2026-09-14T13:30:00.000Z",
  },
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("RealtimeInterviewLauncher recovery", () => {
  it("stops the stale runtime and reauthorizes the same candidate capability after a recoverable provider failure", async () => {
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
          transcript: emptyTranscript,
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

  it("persists a provider interruption separately before reconnecting the same attempt", async () => {
    const authorize = vi.fn().mockResolvedValue(authorization);
    const fetchImpl = vi.fn().mockImplementation(async (_url: string, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body)) as { occurredAt: string };
      return new Response(
        JSON.stringify({
          status: "recorded",
          event: {
            id: "technical-event-1",
            category: "provider_disconnect",
            occurredAt: body.occurredAt,
          },
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      );
    });
    vi.stubGlobal("fetch", fetchImpl);

    const recoveryHandlers: Array<((failure: { kind: string }) => void) | undefined> = [];
    const createRuntime = vi.fn((...args: unknown[]) => {
      recoveryHandlers.push(args[3] as ((failure: { kind: string }) => void) | undefined);
      return {
        start: vi.fn(async () => undefined),
        stop: vi.fn(async () => undefined),
        setMuted: vi.fn(),
        completeCurrentQuestion: vi.fn(async () => undefined),
        getSnapshot: vi.fn(() => ({
          status: "active" as const,
          generation: recoveryHandlers.length,
          currentQuestion: null,
          transcript: emptyTranscript,
        })),
      };
    });

    render(
      <RealtimeInterviewLauncher
        token="candidate capability/with spaces"
        authorize={authorize}
        createRuntime={createRuntime}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Start live interview" }));
    await waitFor(() => expect(createRuntime).toHaveBeenCalledTimes(1));

    act(() => {
      recoveryHandlers[0]?.({ kind: "provider-error" });
    });

    await waitFor(() => expect(fetchImpl).toHaveBeenCalledTimes(1));

    const [url, request] = fetchImpl.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(
      "/api/interview/candidate%20capability%2Fwith%20spaces/realtime-technical-event",
    );
    expect(request).toMatchObject({
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    const body = JSON.parse(String(request.body)) as Record<string, unknown>;
    expect(body).toMatchObject({
      attemptId: "attempt-1",
      category: "provider_disconnect",
    });
    expect(typeof body.occurredAt).toBe("string");
    expect(Number.isNaN(Date.parse(String(body.occurredAt)))).toBe(false);
  });
});