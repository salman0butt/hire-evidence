import { describe, expect, it, vi } from "vitest";

import type { RealtimeAudioPlayback } from "./audio-playback";
import { createRealtimeInterviewSession } from "./interview-session";

function createPlayback(): RealtimeAudioPlayback {
  return {
    enqueue: vi.fn(),
    interrupt: vi.fn(),
    stop: vi.fn(async () => undefined),
  };
}

const plan = {
  versionId: "version-1",
  sections: [
    {
      id: "section-1",
      title: "Role experience",
      questions: [
        {
          id: "question-1",
          prompt: "Describe a relevant project.",
          required: true,
          followUpLimit: 1,
        },
      ],
    },
  ],
} as const;

describe("realtime interview session transcript state", () => {
  it("publishes ephemeral partials and immutable finalized turns without persisting them", () => {
    const snapshots: unknown[] = [];
    const session = createRealtimeInterviewSession({
      plan,
      playback: createPlayback(),
      onSnapshot: (snapshot) => snapshots.push(snapshot),
    });

    session.handleTransportEvent({
      type: "partialTranscript",
      speaker: "candidate",
      text: "I built",
    });

    expect(session.getSnapshot()).toMatchObject({
      transcript: {
        partials: { candidate: "I built", interviewer: "" },
        finalizedTurns: [],
      },
    });

    session.handleTransportEvent({
      type: "finalTranscript",
      speaker: "candidate",
      text: "I built the service.",
    });

    const snapshot = session.getSnapshot();
    expect(snapshot).toMatchObject({
      transcript: {
        partials: { candidate: "", interviewer: "" },
        finalizedTurns: [{ speaker: "candidate", text: "I built the service." }],
      },
    });
    expect(Object.isFrozen((snapshot as { transcript: unknown }).transcript)).toBe(true);
    expect(snapshots).toHaveLength(2);
  });

  it("ignores stale-generation transcript callbacks", () => {
    const session = createRealtimeInterviewSession({ plan, playback: createPlayback() });
    const staleGeneration = session.getSnapshot().generation;

    session.advanceGeneration();
    session.handleTransportEvent(
      {
        type: "finalTranscript",
        speaker: "interviewer",
        text: "Stale question",
      },
      staleGeneration,
    );

    expect(session.getSnapshot()).toMatchObject({
      transcript: {
        finalizedTurns: [],
      },
    });
  });
});
