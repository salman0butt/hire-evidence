export type MicrophonePermissionState = "granted" | "prompt" | "denied";

export type RealtimeBrowserCapabilities = Readonly<{
  isSecureContext: boolean;
  hasMediaDevices: boolean;
  hasGetUserMedia: boolean;
  hasAudioContext: boolean;
  hasAudioWorklet: boolean;
  microphonePermission: MicrophonePermissionState;
  inputDeviceCount: number;
}>;

export type RealtimeDiagnosticFailureReason =
  | "insecure-context"
  | "media-devices-unavailable"
  | "get-user-media-unavailable"
  | "audio-context-unavailable"
  | "audio-worklet-unavailable"
  | "microphone-permission-denied"
  | "microphone-permission-required"
  | "microphone-input-unavailable";

export type RealtimeDiagnosticResult =
  | Readonly<{ status: "ready" }>
  | Readonly<{
      status: "blocked";
      reason: RealtimeDiagnosticFailureReason;
      recoverable: boolean;
    }>;

export function diagnoseRealtimeBrowser(
  capabilities: RealtimeBrowserCapabilities,
): RealtimeDiagnosticResult {
  if (!capabilities.isSecureContext) {
    return { status: "blocked", reason: "insecure-context", recoverable: false };
  }

  if (!capabilities.hasMediaDevices) {
    return {
      status: "blocked",
      reason: "media-devices-unavailable",
      recoverable: false,
    };
  }

  if (!capabilities.hasGetUserMedia) {
    return {
      status: "blocked",
      reason: "get-user-media-unavailable",
      recoverable: false,
    };
  }

  if (!capabilities.hasAudioContext) {
    return {
      status: "blocked",
      reason: "audio-context-unavailable",
      recoverable: false,
    };
  }

  if (!capabilities.hasAudioWorklet) {
    return {
      status: "blocked",
      reason: "audio-worklet-unavailable",
      recoverable: false,
    };
  }

  if (capabilities.microphonePermission === "denied") {
    return {
      status: "blocked",
      reason: "microphone-permission-denied",
      recoverable: true,
    };
  }

  if (capabilities.microphonePermission === "prompt") {
    return {
      status: "blocked",
      reason: "microphone-permission-required",
      recoverable: true,
    };
  }

  if (capabilities.inputDeviceCount < 1) {
    return {
      status: "blocked",
      reason: "microphone-input-unavailable",
      recoverable: true,
    };
  }

  return { status: "ready" };
}
