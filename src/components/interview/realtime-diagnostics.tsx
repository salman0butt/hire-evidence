"use client";

import type {
  RealtimeDiagnosticFailureReason,
  RealtimeDiagnosticResult,
} from "@/lib/realtime/diagnostics";

type RealtimeDiagnosticsProps = Readonly<{
  result: RealtimeDiagnosticResult;
  onRetry?: (() => void) | undefined;
}>;

const FAILURE_MESSAGES: Record<RealtimeDiagnosticFailureReason, string> = {
  "insecure-context":
    "This interview needs a secure browser connection. Open the interview over HTTPS and try again.",
  "media-devices-unavailable":
    "This browser cannot access media devices. Use a supported modern browser to continue.",
  "get-user-media-unavailable":
    "This browser cannot request microphone access. Use a supported modern browser to continue.",
  "audio-context-unavailable":
    "This browser cannot prepare interview audio. Use a supported modern browser to continue.",
  "audio-worklet-unavailable":
    "This browser does not support the required audio processing. Use a supported modern browser to continue.",
  "microphone-permission-denied":
    "Microphone access is blocked. Allow microphone access in your browser settings, then retry the microphone check.",
  "microphone-permission-required":
    "Microphone access is required before the interview can start. Allow access when your browser asks, then retry the microphone check.",
  "microphone-input-unavailable":
    "No microphone input is available. Connect or enable a microphone, then retry the microphone check.",
};

export function RealtimeDiagnostics({ result, onRetry }: RealtimeDiagnosticsProps) {
  if (result.status === "ready") {
    return (
      <div role="status" aria-live="polite" className="rounded-lg border border-slate-200 p-4">
        <p className="font-medium text-slate-950">Ready for the microphone check.</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Browser audio prerequisites are available. No recording has started.
        </p>
      </div>
    );
  }

  return (
    <div role="alert" className="rounded-lg border border-slate-200 p-4">
      <p className="font-medium text-slate-950">Technical check needs attention</p>
      <p className="mt-1 text-sm leading-6 text-slate-600">
        {FAILURE_MESSAGES[result.reason]}
      </p>
      {result.recoverable && onRetry ? (
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900"
        >
          Retry microphone check
        </button>
      ) : null}
    </div>
  );
}
