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

type RealtimeMediaDevicesProbe = Readonly<{
  getUserMedia?: unknown;
  enumerateDevices?: (() => Promise<readonly { kind: string }[]>) | undefined;
}>;

type RealtimeAudioContextProbe = Readonly<{
  audioWorklet?: unknown;
  close: () => void | Promise<void>;
}>;

export type RealtimeBrowserRuntime = Readonly<{
  isSecureContext: boolean;
  mediaDevices?: RealtimeMediaDevicesProbe | undefined;
  createAudioContext?: (() => RealtimeAudioContextProbe) | undefined;
  queryMicrophonePermission?: (() => Promise<MicrophonePermissionState>) | undefined;
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

export async function collectRealtimeBrowserCapabilities(
  runtime: RealtimeBrowserRuntime,
): Promise<RealtimeBrowserCapabilities> {
  const mediaDevices = runtime.mediaDevices;
  const hasMediaDevices = Boolean(mediaDevices);
  const hasGetUserMedia = typeof mediaDevices?.getUserMedia === "function";

  let microphonePermission: MicrophonePermissionState = "prompt";
  if (runtime.queryMicrophonePermission) {
    try {
      microphonePermission = await runtime.queryMicrophonePermission();
    } catch {
      microphonePermission = "prompt";
    }
  }

  let inputDeviceCount = 0;
  if (mediaDevices?.enumerateDevices) {
    try {
      const devices = await mediaDevices.enumerateDevices();
      inputDeviceCount = devices.filter((device) => device.kind === "audioinput").length;
    } catch {
      inputDeviceCount = 0;
    }
  }

  let hasAudioContext = false;
  let hasAudioWorklet = false;
  let audioContext: RealtimeAudioContextProbe | undefined;

  if (runtime.createAudioContext) {
    try {
      audioContext = runtime.createAudioContext();
      hasAudioContext = true;
      hasAudioWorklet = Boolean(audioContext.audioWorklet);
    } catch {
      hasAudioContext = false;
      hasAudioWorklet = false;
    } finally {
      if (audioContext) {
        try {
          await audioContext.close();
        } catch {
          // Capability probing must not fail solely because context cleanup rejected.
        }
      }
    }
  }

  return {
    isSecureContext: runtime.isSecureContext,
    hasMediaDevices,
    hasGetUserMedia,
    hasAudioContext,
    hasAudioWorklet,
    microphonePermission,
    inputDeviceCount,
  };
}

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
