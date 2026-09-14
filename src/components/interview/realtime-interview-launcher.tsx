"use client";

import { useEffect, useRef, useState } from "react";

import { createBrowserRealtimeInterviewRuntime } from "@/lib/realtime/browser-realtime-interview-runtime";
import type { RealtimeConnectionState } from "@/lib/realtime/connection-machine";
import type { RealtimeInterviewSessionSnapshot } from "@/lib/realtime/interview-session";
import type { RealtimeInterviewRuntime } from "@/lib/realtime/realtime-interview-runtime";
import type { RealtimeTechnicalFailure } from "@/lib/realtime/recovery";
import type { RealtimeSessionAuthorization } from "@/lib/realtime/session-authorization";
import { createRealtimeTechnicalEventClient } from "@/lib/realtime/technical-event-client";
import type { TechnicalEventCategory } from "@/lib/realtime/technical-event-repository";

import { RealtimeInterview } from "./realtime-interview";

type AuthorizedRealtimeSession = Extract<
  RealtimeSessionAuthorization,
  { status: "authorized" }
>;

type RealtimeInterviewLauncherProps = Readonly<{
  token: string;
  authorize?: (token: string) => Promise<RealtimeSessionAuthorization>;
  createRuntime?: (
    authorization: AuthorizedRealtimeSession,
    onSnapshot: (snapshot: RealtimeInterviewSessionSnapshot) => void,
    rawToken: string,
    onRecoverableFailure: (failure: RealtimeTechnicalFailure) => void,
  ) => RealtimeInterviewRuntime;
}>;

type LauncherState =
  | "idle"
  | "authorizing"
  | "recovering"
  | "connected"
  | "ended"
  | "error";

const MAX_RECOVERY_ATTEMPTS = 2;

function technicalEventCategoryForFailure(
  failure: RealtimeTechnicalFailure,
): TechnicalEventCategory {
  if (failure.kind === "microphone-lost") return "microphone_failure";
  if (failure.kind === "browser-unsupported") return "browser_disconnect";
  if (
    failure.kind === "provider-closed" ||
    failure.kind === "provider-error" ||
    failure.kind === "credential-expired" ||
    failure.kind === "send-failed" ||
    failure.kind === "decode-failed"
  ) {
    return "provider_disconnect";
  }

  return "reconnect_failure";
}

function isAuthorizedRealtimeSession(value: unknown): value is AuthorizedRealtimeSession {
  if (!value || typeof value !== "object") return false;
  const body = value as Record<string, unknown>;
  if (
    body.status !== "authorized" ||
    typeof body.attemptId !== "string" ||
    typeof body.interviewerVersionId !== "string" ||
    typeof body.durationSeconds !== "number" ||
    typeof body.language !== "string" ||
    !body.interviewPlan ||
    typeof body.interviewPlan !== "object" ||
    !body.providerCredential ||
    typeof body.providerCredential !== "object"
  ) {
    return false;
  }

  const credential = body.providerCredential as Record<string, unknown>;
  return (
    typeof credential.credential === "string" &&
    credential.credential.length > 0 &&
    typeof credential.expiresAt === "string"
  );
}

async function authorizeRealtimeInterview(
  token: string,
): Promise<RealtimeSessionAuthorization> {
  try {
    const response = await fetch(
      `/api/interview/${encodeURIComponent(token)}/realtime-session`,
      { method: "POST" },
    );

    if (!response.ok) {
      return { status: "unavailable" };
    }

    const body: unknown = await response.json();
    return isAuthorizedRealtimeSession(body)
      ? body
      : { status: "unavailable" };
  } catch {
    return { status: "unavailable" };
  }
}

function connectedState(snapshot: RealtimeInterviewSessionSnapshot): RealtimeConnectionState {
  return {
    connection: snapshot.status === "ended" ? "ended" : "connected",
    presentation: "listening",
    generation: snapshot.generation,
    error: undefined,
  };
}

export function RealtimeInterviewLauncher({
  token,
  authorize = authorizeRealtimeInterview,
  createRuntime = createBrowserRealtimeInterviewRuntime,
}: RealtimeInterviewLauncherProps) {
  const [state, setState] = useState<LauncherState>("idle");
  const [muted, setMuted] = useState(false);
  const [sessionSnapshot, setSessionSnapshot] =
    useState<RealtimeInterviewSessionSnapshot | null>(null);
  const runtimeRef = useRef<RealtimeInterviewRuntime | null>(null);
  const operationGenerationRef = useRef(0);

  useEffect(
    () => () => {
      operationGenerationRef.current += 1;
      const runtime = runtimeRef.current;
      runtimeRef.current = null;
      void runtime?.stop();
    },
    [],
  );

  async function connectRuntime(recoveryAttempt: number) {
    const operationGeneration = ++operationGenerationRef.current;
    setState(recoveryAttempt === 0 ? "authorizing" : "recovering");

    const result = await authorize(token);
    if (operationGenerationRef.current !== operationGeneration) return;
    if (result.status !== "authorized") {
      setState("error");
      return;
    }

    const recordTechnicalEvent = createRealtimeTechnicalEventClient({
      rawToken: token,
      attemptId: result.attemptId,
    });
    const runtime = createRuntime(
      result,
      (snapshot) => {
        if (runtimeRef.current === runtime) {
          setSessionSnapshot(snapshot);
        }
      },
      token,
      (failure) => {
        if (runtimeRef.current === runtime) {
          void recordTechnicalEvent({
            category: technicalEventCategoryForFailure(failure),
            occurredAt: new Date().toISOString(),
          }).catch(() => undefined);
          void recoverRuntime(runtime, recoveryAttempt, () => {
            void recordTechnicalEvent({
              category: "reconnect_failure",
              occurredAt: new Date().toISOString(),
            }).catch(() => undefined);
          });
        }
      },
    );
    runtimeRef.current = runtime;

    try {
      await runtime.start();
      if (
        operationGenerationRef.current === operationGeneration &&
        runtimeRef.current === runtime
      ) {
        setSessionSnapshot(runtime.getSnapshot());
        setMuted(false);
        setState("connected");
      }
    } catch {
      if (
        operationGenerationRef.current === operationGeneration &&
        runtimeRef.current === runtime
      ) {
        runtimeRef.current = null;
        await runtime.stop();
        if (operationGenerationRef.current === operationGeneration) {
          setState("error");
        }
      }
    }
  }

  async function recoverRuntime(
    runtime: RealtimeInterviewRuntime,
    recoveryAttempt: number,
    recordReconnectFailure: () => void,
  ) {
    if (runtimeRef.current !== runtime) return;

    runtimeRef.current = null;
    const stopGeneration = ++operationGenerationRef.current;
    setState("recovering");
    await runtime.stop();

    if (operationGenerationRef.current !== stopGeneration) return;
    if (recoveryAttempt >= MAX_RECOVERY_ATTEMPTS) {
      recordReconnectFailure();
      setState("error");
      return;
    }

    await connectRuntime(recoveryAttempt + 1);
  }

  function handleStart() {
    if (
      state === "authorizing" ||
      state === "recovering" ||
      state === "connected"
    ) {
      return;
    }

    void connectRuntime(0);
  }

  function handleMutedChange(nextMuted: boolean) {
    const runtime = runtimeRef.current;
    if (!runtime) return;
    runtime.setMuted(nextMuted);
    setMuted(nextMuted);
  }

  async function handleEnd() {
    operationGenerationRef.current += 1;
    const runtime = runtimeRef.current;
    runtimeRef.current = null;
    await runtime?.stop();
    setState("ended");
  }

  const showInterview =
    state === "connected" &&
    sessionSnapshot !== null &&
    (sessionSnapshot.currentQuestion !== null || sessionSnapshot.status === "completed");

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

      {showInterview && sessionSnapshot ? (
        <RealtimeInterview
          connectionState={connectedState(sessionSnapshot)}
          sessionSnapshot={sessionSnapshot}
          muted={muted}
          onMutedChange={handleMutedChange}
          onEnd={() => void handleEnd()}
        />
      ) : state === "connected" ? (
        <p role="status" aria-live="polite" className="text-sm text-slate-700">
          Live interview connected
        </p>
      ) : state === "recovering" ? (
        <p role="status" aria-live="polite" className="text-sm text-slate-700">
          Reconnecting live interview…
        </p>
      ) : state === "ended" ? (
        <p role="status" aria-live="polite" className="text-sm text-slate-700">
          Interview ended
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
