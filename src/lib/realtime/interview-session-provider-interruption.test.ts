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

describe("realtime interview provider interruption", () => {
  it("stops obsolete interviewer playback when the live provider reports candidate barge-in", () => {
    const playback = createPlayback();
    const session = createRealtimeInterviewSession({ plan, playback });

    session.handleTransportEvent({ type: "interrupted" });

    expect(playback.interrupt).toHaveBeenCalledTimes(1);
    expect(session.getSnapshot()).toMatchObject({
      status: "active",
      currentQuestion: { questionId: "question-1" },
    });
  });
});
