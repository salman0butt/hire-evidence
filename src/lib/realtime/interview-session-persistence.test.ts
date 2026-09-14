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
        {
          id: "question-2",
          prompt: "What trade-off did you make?",
          required: true,
          followUpLimit: 1,
        },
      ],
    },
  ],
} as const;

describe("realtime interview authoritative progress persistence", () => {
  it("fails closed when persistence returns a malformed authoritative checkpoint", async () => {
    const session = createRealtimeInterviewSession({
      plan,
      playback: createPlayback(),
      persistProgress: vi.fn().mockResolvedValue({
        status: "active" as const,
        checkpoint: {
          interviewerVersionId: "different-version",
          sectionIndex: 0,
          questionIndex: 1,
          followUpsUsed: {},
          processedEventIds: ["turn-1"],
        },
      }),
    });

    await expect(session.completeCurrentQuestion("turn-1")).resolves.toBeUndefined();
    expect(session.getSnapshot()).toMatchObject({
      status: "active",
      currentQuestion: { questionId: "question-1" },
    });
  });
});
