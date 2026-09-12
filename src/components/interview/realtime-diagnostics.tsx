"use client";

import { useState } from "react";

import {
  collectRealtimeBrowserCapabilities,
  diagnoseRealtimeBrowser,
  listRealtimeAudioInputs,
  verifyRealtimeMicrophoneAccess,
  verifyRealtimeMicrophoneInputLevel,
} from "@/lib/realtime/diagnostics";
import type {
  RealtimeAudioInputDevice,
  RealtimeDiagnosticFailureReason,
  RealtimeDiagnosticResult,
} from "@/lib/realtime/diagnostics";

type RealtimeDiagnosticsProps = Readonly<{
  result: RealtimeDiagnosticResult;
  onRetry?: (() => void) | undefined;
}>;

type RealtimeReadinessCheckProps = Readonly<{
  runCheck?: ((selectedInputDeviceId?: string) => Promise<RealtimeDiagnosticResult>) | undefined;
  listInputs?: (() => Promise<readonly RealtimeAudioInputDevice[]>) | undefined;
  runInputLevelCheck?:
    | ((selectedInputDeviceId?: string) => Promise<RealtimeDiagnosticResult>)
    | undefined;
}>;

const FAILURE_MESSAGES: Record<RealtimeDiagnosticFailureReason, string> = {
  "insecure-context":
    "This interview needs a secure browser connection. Open the interview over HTTPS and try again.",
  "network-offline":
    "This device appears to be offline. Restore your network connection, then retry the technical check.",
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
  "microphone-input-silent":
    "The microphone is connected, but no usable input was detected. Speak normally near the microphone, then retry the microphone check.",
};

function isAcquisitionRecoverablePrerequisite(result: RealtimeDiagnosticResult) {
  return (
    result.status === "blocked" &&
    (result.reason === "microphone-permission-required" ||
      result.reason === "microphone-input-unavailable")
  );
}

async function runBrowserRealtimeReadinessCheck(
  selectedInputDeviceId?: string,
): Promise<RealtimeDiagnosticResult> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      status: "blocked",
      reason: "media-devices-unavailable",
      recoverable: false,
    };
  }

  const mediaDevices = navigator.mediaDevices;
  const capabilities = await collectRealtimeBrowserCapabilities({
    isSecureContext: window.isSecureContext,
    isOnline: navigator.onLine,
    mediaDevices,
    createAudioContext:
      typeof window.AudioContext === "function"
        ? () => new window.AudioContext()
        : undefined,
  });
  const prerequisiteResult = diagnoseRealtimeBrowser(capabilities);

  if (
    prerequisiteResult.status === "blocked" &&
    !isAcquisitionRecoverablePrerequisite(prerequisiteResult)
  ) {
    return prerequisiteResult;
  }

  return verifyRealtimeMicrophoneAccess(
    {
      getUserMedia:
        typeof mediaDevices?.getUserMedia === "function"
          ? (constraints) => mediaDevices.getUserMedia(constraints)
          : undefined,
    },
    selectedInputDeviceId,
  );
}

async function listBrowserRealtimeAudioInputs(): Promise<readonly RealtimeAudioInputDevice[]> {
  if (typeof navigator === "undefined" || !navigator.mediaDevices) {
    return [];
  }

  return listRealtimeAudioInputs(navigator.mediaDevices);
}

async function measureBrowserRealtimeInputLevel(stream: MediaStream): Promise<number> {
  const context = new window.AudioContext();
  const source = context.createMediaStreamSource(stream);
  const analyser = context.createAnalyser();
  analyser.fftSize = 256;
  source.connect(analyser);

  const samples = new Uint8Array(analyser.fftSize);
  let peak = 0;

  try {
    if (context.state === "suspended") {
      await context.resume();
    }

    for (let index = 0; index < 6; index += 1) {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 50));
      analyser.getByteTimeDomainData(samples);
      for (const sample of samples) {
        peak = Math.max(peak, Math.abs(sample - 128) / 128);
      }
    }

    return peak;
  } finally {
    source.disconnect();
    analyser.disconnect();
    await context.close();
  }
}

async function runBrowserRealtimeInputLevelCheck(
  selectedInputDeviceId?: string,
): Promise<RealtimeDiagnosticResult> {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return {
      status: "blocked",
      reason: "media-devices-unavailable",
      recoverable: false,
    };
  }

  const mediaDevices = navigator.mediaDevices;

  return verifyRealtimeMicrophoneInputLevel(
    {
      getUserMedia:
        typeof mediaDevices?.getUserMedia === "function"
          ? (constraints) => mediaDevices.getUserMedia(constraints)
          : undefined,
      measureInputLevel: (stream) =>
        measureBrowserRealtimeInputLevel(stream as unknown as MediaStream),
    },
    selectedInputDeviceId,
  );
}

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

export function RealtimeReadinessCheck({
  runCheck = runBrowserRealtimeReadinessCheck,
  listInputs = listBrowserRealtimeAudioInputs,
  runInputLevelCheck = runBrowserRealtimeInputLevelCheck,
}: RealtimeReadinessCheckProps) {
  const [result, setResult] = useState<RealtimeDiagnosticResult | null>(null);
  const [checking, setChecking] = useState(false);
  const [inputs, setInputs] = useState<readonly RealtimeAudioInputDevice[]>([]);
  const [selectedInputDeviceId, setSelectedInputDeviceId] = useState("");
  const [inputLevelResult, setInputLevelResult] = useState<RealtimeDiagnosticResult | null>(null);
  const [inputLevelChecking, setInputLevelChecking] = useState(false);

  async function handleCheck(inputDeviceId?: string) {
    if (checking) {
      return;
    }

    setChecking(true);
    setInputLevelResult(null);
    try {
      const nextResult = await runCheck(inputDeviceId);
      setResult(nextResult);

      if (nextResult.status === "ready" && inputs.length === 0) {
        const nextInputs = await listInputs();
        setInputs(nextInputs);
        const firstInput = nextInputs[0];
        if (firstInput) {
          setSelectedInputDeviceId((current) => current || firstInput.deviceId);
        }
      }
    } catch {
      setResult({
        status: "blocked",
        reason: "microphone-input-unavailable",
        recoverable: true,
      });
    } finally {
      setChecking(false);
    }
  }

  async function handleInputLevelCheck() {
    if (inputLevelChecking || !selectedInputDeviceId) {
      return;
    }

    setInputLevelChecking(true);
    try {
      setInputLevelResult(await runInputLevelCheck(selectedInputDeviceId));
    } catch {
      setInputLevelResult({
        status: "blocked",
        reason: "microphone-input-unavailable",
        recoverable: true,
      });
    } finally {
      setInputLevelChecking(false);
    }
  }

  return (
    <section className="space-y-4" aria-labelledby="technical-check-heading">
      <div className="space-y-2">
        <h2 id="technical-check-heading" className="text-xl font-semibold">
          Technical check
        </h2>
        <p className="text-sm leading-6 text-slate-600">
          Check browser audio and microphone access before the interview starts. The check
          releases the microphone immediately and does not start recording or an interview
          attempt.
        </p>
      </div>

      {result ? (
        <RealtimeDiagnostics
          result={result}
          onRetry={
            result.status === "blocked" && result.recoverable
              ? () => handleCheck(selectedInputDeviceId || undefined)
              : undefined
          }
        />
      ) : (
        <button
          type="button"
          onClick={() => handleCheck()}
          disabled={checking}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {checking ? "Checking microphone…" : "Run microphone check"}
        </button>
      )}

      {result?.status === "ready" && inputs.length > 0 ? (
        <div className="space-y-3 rounded-lg border border-slate-200 p-4">
          <div className="space-y-1">
            <label htmlFor="realtime-microphone" className="text-sm font-medium text-slate-950">
              Microphone
            </label>
            <select
              id="realtime-microphone"
              value={selectedInputDeviceId}
              onChange={(event) => {
                setSelectedInputDeviceId(event.target.value);
                setInputLevelResult(null);
              }}
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950"
            >
              {inputs.map((input) => (
                <option key={input.deviceId} value={input.deviceId}>
                  {input.label}
                </option>
              ))}
            </select>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Speak normally while checking. Audio is sampled only for technical readiness and is
            not saved or used as candidate evidence.
          </p>
          <button
            type="button"
            onClick={handleInputLevelCheck}
            disabled={inputLevelChecking || !selectedInputDeviceId}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {inputLevelChecking ? "Checking selected microphone…" : "Check selected microphone"}
          </button>
          {inputLevelResult?.status === "ready" ? (
            <div
              role="status"
              aria-label="Microphone input"
              aria-live="polite"
              className="rounded-lg border border-slate-200 p-3 text-sm text-slate-700"
            >
              Microphone input detected. This signal was used only for technical readiness.
            </div>
          ) : inputLevelResult ? (
            <RealtimeDiagnostics
              result={inputLevelResult}
              onRetry={inputLevelResult.recoverable ? handleInputLevelCheck : undefined}
            />
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
