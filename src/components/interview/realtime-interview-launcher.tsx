"use client";

import { useState } from "react";

type AuthorizedRealtimeSession = Readonly<{
  status: "authorized";
  attemptId: string;
  durationSeconds: number;
  language: string;
  interviewPlan: unknown;
  providerCredential: unknown;
  resumeCheckpoint?: unknown;
}>;

type RealtimeAuthorizationResult =
  | AuthorizedRealtimeSession
  | Readonly<{ status: "unavailable" }>;

type RealtimeInterviewLauncherProps = Readonly<{
  token: string;
  authorize?: (token: string) => Promise<RealtimeAuthorizationResult>;
}>;

type LauncherState = "idle" | "authorizing" | "authorized" | "error";

async function authorizeRealtimeInterview(
  token: string,
): Promise<RealtimeAuthorizationResult> {
  try {
    const response = await fetch(
      `/api/interview/${encodeURIComponent(token)}/realtime-session`,
      { method: "POST" },
    );

    if (!response.ok) {
      return { status: "unavailable" };
    }

    const body = (await response.json()) as { status?: unknown };
    if (body.status !== "authorized") {
      return { status: "unavailable" };
    }

    return body as AuthorizedRealtimeSession;
  } catch {
    return { status: "unavailable" };
  }
}

export function RealtimeInterviewLauncher({
  token,
  authorize = authorizeRealtimeInterview,
}: RealtimeInterviewLauncherProps) {
  const [state, setState] = useState<LauncherState>("idle");

  async function handleStart() {
    if (state === "authorizing") return;

    setState("authorizing");
    const result = await authorize(token);
    setState(result.status === "authorized" ? "authorized" : "error");
  }

  return (
    <section
      aria-labelledby="live-interview-heading"
      className="space-y-4 rounded-2xl border border-slate-200 p-5"
    >
      <div className="space-y-2">
        <h2 id="live-interview-heading" className="text-xl font-semibold">
          Live interview
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Start only after you have completed the technical check and recorded consent.
          Authorization is verified again by the server before a live session can begin.
        </p>
      </div>

      {state === "authorized" ? (
        <p role="status" aria-live="polite" className="text-sm text-slate-700">
          Realtime session authorized
        </p>
      ) : state === "error" ? (
        <p role="alert" className="text-sm text-slate-700">
          The live interview could not be started. Please try again.
        </p>
      ) : (
        <button
          type="button"
          onClick={handleStart}
          disabled={state === "authorizing"}
          className="rounded-lg bg-slate-950 px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
        >
          {state === "authorizing" ? "Starting live interview…" : "Start live interview"}
        </button>
      )}
    </section>
  );
}
