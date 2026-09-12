import { describe, expect, it, vi } from "vitest";

import {
  collectRealtimeBrowserCapabilities,
  diagnoseRealtimeBrowser,
} from "./diagnostics";

function capabilities(
  overrides: Partial<Parameters<typeof diagnoseRealtimeBrowser>[0]> = {},
): Parameters<typeof diagnoseRealtimeBrowser>[0] {
  return {
    isSecureContext: true,
    hasMediaDevices: true,
    hasGetUserMedia: true,
    hasAudioContext: true,
    hasAudioWorklet: true,
    microphonePermission: "granted",
    inputDeviceCount: 1,
    ...overrides,
  };
}

describe("diagnoseRealtimeBrowser", () => {
  it("reports ready only when the browser and microphone prerequisites are available", () => {
    expect(diagnoseRealtimeBrowser(capabilities())).toEqual({
      status: "ready",
    });
  });

  it.each([
    ["insecure-context", { isSecureContext: false }],
    ["media-devices-unavailable", { hasMediaDevices: false }],
    ["get-user-media-unavailable", { hasGetUserMedia: false }],
    ["audio-context-unavailable", { hasAudioContext: false }],
    ["audio-worklet-unavailable", { hasAudioWorklet: false }],
  ] as const)("fails closed for %s", (reason, override) => {
    expect(diagnoseRealtimeBrowser(capabilities(override))).toEqual({
      status: "blocked",
      reason,
      recoverable: false,
    });
  });

  it.each([
    ["microphone-permission-denied", { microphonePermission: "denied" as const }],
    ["microphone-permission-required", { microphonePermission: "prompt" as const }],
    ["microphone-input-unavailable", { inputDeviceCount: 0 }],
  ] as const)("reports recoverable microphone readiness for %s", (reason, override) => {
    expect(diagnoseRealtimeBrowser(capabilities(override))).toEqual({
      status: "blocked",
      reason,
      recoverable: true,
    });
  });
});

describe("collectRealtimeBrowserCapabilities", () => {
  it("collects browser, permission, audio-worklet and input-device readiness without retaining media", async () => {
    const close = vi.fn();

    await expect(
      collectRealtimeBrowserCapabilities({
        isSecureContext: true,
        mediaDevices: {
          getUserMedia: vi.fn(),
          enumerateDevices: vi.fn().mockResolvedValue([
            { kind: "audioinput" },
            { kind: "videoinput" },
          ]),
        },
        createAudioContext: () => ({ audioWorklet: {}, close }),
        queryMicrophonePermission: vi.fn().mockResolvedValue("granted"),
      }),
    ).resolves.toEqual({
      isSecureContext: true,
      hasMediaDevices: true,
      hasGetUserMedia: true,
      hasAudioContext: true,
      hasAudioWorklet: true,
      microphonePermission: "granted",
      inputDeviceCount: 1,
    });

    expect(close).toHaveBeenCalledTimes(1);
  });

  it("fails closed when optional browser probes are unavailable or reject", async () => {
    await expect(
      collectRealtimeBrowserCapabilities({
        isSecureContext: true,
        mediaDevices: {
          enumerateDevices: vi.fn().mockRejectedValue(new Error("device enumeration blocked")),
        },
      }),
    ).resolves.toEqual({
      isSecureContext: true,
      hasMediaDevices: true,
      hasGetUserMedia: false,
      hasAudioContext: false,
      hasAudioWorklet: false,
      microphonePermission: "prompt",
      inputDeviceCount: 0,
    });
  });
});
