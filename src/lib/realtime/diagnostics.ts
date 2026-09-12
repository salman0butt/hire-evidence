export type MicrophonePermissionState = "granted" | "prompt" | "denied";

export type RealtimeBrowserCapabilities = Readonly<{
  isSecureContext: boolean;
  isOnline: boolean;
  hasMediaDevices: boolean;
  hasGetUserMedia: boolean;
  hasAudioContext: boolean;
  hasAudioWorklet: boolean;
  microphonePermission: MicrophonePermissionState;
  inputDeviceCount: number;
}>;

type RealtimeMediaDeviceInfo = Readonly<{
  kind: string;
  deviceId?: string | undefined;
  label?: string | undefined;
}>;

type RealtimeMediaDevicesProbe = Readonly<{
  getUserMedia?: unknown;
  enumerateDevices?: (() => Promise<readonly RealtimeMediaDeviceInfo[]>) | undefined;
}>;

export type RealtimeAudioInputDevice = Readonly<{
  deviceId: string;
  label: string;
}>;

type RealtimeAudioContextProbe = Readonly<{
  audioWorklet?: unknown;
  close: () => void | Promise<void>;
}>;

export type RealtimeBrowserRuntime = Readonly<{
  isSecureContext: boolean;
  isOnline: boolean;
  mediaDevices?: RealtimeMediaDevicesProbe | undefined;
  createAudioContext?: (() => RealtimeAudioContextProbe) | undefined;
  queryMicrophonePermission?: (() => Promise<MicrophonePermissionState>) | undefined;
}>;

type RealtimeMicrophoneTrack = Readonly<{
  readyState?: string | undefined;
  stop: () => void;
}>;

type RealtimeMicrophoneStream = Readonly<{
  getAudioTracks: () => readonly RealtimeMicrophoneTrack[];
  getTracks: () => readonly RealtimeMicrophoneTrack[];
}>;

type RealtimeAudioConstraint =
  | boolean
  | Readonly<{
      deviceId: Readonly<{ exact: string }>;
    }>;

export type RealtimeMicrophoneAccessRuntime = Readonly<{
  getUserMedia?:
    | ((constraints: Readonly<{ audio: RealtimeAudioConstraint; video: boolean }>) => Promise<RealtimeMicrophoneStream>)
    | undefined;
}>;

export type RealtimeMicrophoneInputLevelRuntime = RealtimeMicrophoneAccessRuntime &
  Readonly<{
    measureInputLevel: (stream: RealtimeMicrophoneStream) => Promise<number>;
  }>;

export type RealtimeDiagnosticFailureReason =
  | "insecure-context"
  | "network-offline"
  | "media-devices-unavailable"
  | "get-user-media-unavailable"
  | "audio-context-unavailable"
  | "audio-worklet-unavailable"
  | "microphone-permission-denied"
  | "microphone-permission-required"
  | "microphone-input-unavailable"
  | "microphone-input-silent";

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
    isOnline: runtime.isOnline,
    hasMediaDevices,
    hasGetUserMedia,
    hasAudioContext,
    hasAudioWorklet,
    microphonePermission,
    inputDeviceCount,
  };
}

export async function listRealtimeAudioInputs(
  mediaDevices: Pick<RealtimeMediaDevicesProbe, "enumerateDevices">,
): Promise<readonly RealtimeAudioInputDevice[]> {
  if (!mediaDevices.enumerateDevices) {
    return [];
  }

  try {
    const devices = await mediaDevices.enumerateDevices();
    return devices
      .filter(
        (device): device is RealtimeMediaDeviceInfo & { deviceId: string } =>
          device.kind === "audioinput" && Boolean(device.deviceId),
      )
      .map((device, index) => ({
        deviceId: device.deviceId,
        label: device.label?.trim() || `Microphone ${index + 1}`,
      }));
  } catch {
    return [];
  }
}

export function diagnoseRealtimeBrowser(
  capabilities: RealtimeBrowserCapabilities,
): RealtimeDiagnosticResult {
  if (!capabilities.isSecureContext) {
    return { status: "blocked", reason: "insecure-context", recoverable: false };
  }

  if (!capabilities.isOnline) {
    return { status: "blocked", reason: "network-offline", recoverable: true };
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

function microphoneConstraints(selectedInputDeviceId?: string) {
  const audio: RealtimeAudioConstraint = selectedInputDeviceId
    ? { deviceId: { exact: selectedInputDeviceId } }
    : true;

  return { audio, video: false } as const;
}

function microphoneFailure(error: unknown): RealtimeDiagnosticResult {
  const name = error instanceof Error ? error.name : "";

  if (name === "NotAllowedError" || name === "PermissionDeniedError") {
    return {
      status: "blocked",
      reason: "microphone-permission-denied",
      recoverable: true,
    };
  }

  return {
    status: "blocked",
    reason: "microphone-input-unavailable",
    recoverable: true,
  };
}

export async function verifyRealtimeMicrophoneAccess(
  runtime: RealtimeMicrophoneAccessRuntime,
  selectedInputDeviceId?: string,
): Promise<RealtimeDiagnosticResult> {
  if (!runtime.getUserMedia) {
    return {
      status: "blocked",
      reason: "get-user-media-unavailable",
      recoverable: false,
    };
  }

  let stream: RealtimeMicrophoneStream | undefined;

  try {
    stream = await runtime.getUserMedia(microphoneConstraints(selectedInputDeviceId));
    const hasLiveAudioTrack = stream
      .getAudioTracks()
      .some((track) => track.readyState === undefined || track.readyState === "live");

    if (!hasLiveAudioTrack) {
      return {
        status: "blocked",
        reason: "microphone-input-unavailable",
        recoverable: true,
      };
    }

    return { status: "ready" };
  } catch (error) {
    return microphoneFailure(error);
  } finally {
    stream?.getTracks().forEach((track) => track.stop());
  }
}

export async function verifyRealtimeMicrophoneInputLevel(
  runtime: RealtimeMicrophoneInputLevelRuntime,
  selectedInputDeviceId?: string,
): Promise<RealtimeDiagnosticResult> {
  if (!runtime.getUserMedia) {
    return {
      status: "blocked",
      reason: "get-user-media-unavailable",
      recoverable: false,
    };
  }

  let stream: RealtimeMicrophoneStream | undefined;

  try {
    stream = await runtime.getUserMedia(microphoneConstraints(selectedInputDeviceId));
    const hasLiveAudioTrack = stream
      .getAudioTracks()
      .some((track) => track.readyState === undefined || track.readyState === "live");

    if (!hasLiveAudioTrack) {
      return {
        status: "blocked",
        reason: "microphone-input-unavailable",
        recoverable: true,
      };
    }

    const inputLevel = await runtime.measureInputLevel(stream);
    if (!Number.isFinite(inputLevel) || inputLevel < 0.01) {
      return {
        status: "blocked",
        reason: "microphone-input-silent",
        recoverable: true,
      };
    }

    return { status: "ready" };
  } catch (error) {
    return microphoneFailure(error);
  } finally {
    stream?.getTracks().forEach((track) => track.stop());
  }
}
