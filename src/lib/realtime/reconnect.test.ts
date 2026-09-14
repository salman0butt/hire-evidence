import { describe, expect, it } from "vitest";

import { getCurrentInterviewQuestion } from "./plan-runner";
import { restoreInterviewPlanState } from "./reconnect";

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
          followUpLimit: 2,
        },
      ],
    },
  ],
} as const;

describe("authoritative realtime reconnect checkpoints", () => {
  it("resumes the immutable plan at the authoritative cursor with consumed follow-ups preserved", () => {
    const state = restoreInterviewPlanState(plan, {
      interviewerVersionId: "version-1",
      sectionIndex: 0,
      questionIndex: 1,
      followUpsUsed: { "question-1": 1, "question-2": 1 },
      processedEventIds: ["question-1-complete", "question-2-follow-up-1"],
    });

    expect(getCurrentInterviewQuestion(state)).toMatchObject({
      questionId: "question-2",
      remainingFollowUps: 1,
    });
    expect(state.processedEventIds).toEqual([
      "question-1-complete",
      "question-2-follow-up-1",
    ]);
  });

  it.each([
    {
      name: "a checkpoint from a different published interviewer version",
      checkpoint: {
        interviewerVersionId: "version-other",
        sectionIndex: 0,
        questionIndex: 1,
        followUpsUsed: {},
        processedEventIds: [],
      },
    },
    {
      name: "an out-of-range cursor",
      checkpoint: {
        interviewerVersionId: "version-1",
        sectionIndex: 0,
        questionIndex: 99,
        followUpsUsed: {},
        processedEventIds: [],
      },
    },
    {
      name: "an inflated follow-up budget",
      checkpoint: {
        interviewerVersionId: "version-1",
        sectionIndex: 0,
        questionIndex: 1,
        followUpsUsed: { "question-2": 3 },
        processedEventIds: [],
      },
    },
    {
      name: "follow-up state for a question outside the immutable plan",
      checkpoint: {
        interviewerVersionId: "version-1",
        sectionIndex: 0,
        questionIndex: 1,
        followUpsUsed: { "invented-question": 1 },
        processedEventIds: [],
      },
    },
    {
      name: "follow-up state for a future question beyond the authoritative cursor",
      checkpoint: {
        interviewerVersionId: "version-1",
        sectionIndex: 0,
        questionIndex: 0,
        followUpsUsed: { "question-2": 1 },
        processedEventIds: [],
      },
    },
  ])("fails closed for $name instead of silently resetting progress", ({ checkpoint }) => {
    expect(() => restoreInterviewPlanState(plan, checkpoint)).toThrow(
      "Invalid realtime resume checkpoint.",
    );
  });
});