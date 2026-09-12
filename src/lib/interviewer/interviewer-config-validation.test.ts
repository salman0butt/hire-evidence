import { describe, expect, it } from "vitest";

async function validationModule() {
  const modulePath = "./interviewer-config-validation";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    validateInterviewerConfigInput: (input: {
      name: string;
      interviewType: string;
      persona: string;
      language: string;
      durationSeconds: number;
      difficulty: string;
      questionMode: string;
      guidelines: string;
      candidateInstructions: string;
      followUpPolicy: {
        maxFollowUpsPerQuestion: number;
        allowedReasons: string[];
      };
    }) => unknown;
  }>;
}

const validConfig = {
  name: "  Senior Backend Engineering Interviewer  ",
  interviewType: "technical",
  persona: "professional",
  language: "en",
  durationSeconds: 1800,
  difficulty: "medium",
  questionMode: "semi_adaptive",
  guidelines: "Ask one question at a time and use neutral follow-ups.",
  candidateInstructions: "Answer with concrete examples from your experience.",
  followUpPolicy: {
    maxFollowUpsPerQuestion: 2,
    allowedReasons: [
      "clarify_ambiguity",
      "request_example",
      "explore_reasoning",
      "missing_required_dimension",
    ],
  },
};

describe("validateInterviewerConfigInput", () => {
  it("normalizes a bounded interviewer configuration", async () => {
    const { validateInterviewerConfigInput } = await validationModule();

    expect(validateInterviewerConfigInput(validConfig)).toEqual({
      ok: true,
      value: {
        ...validConfig,
        name: "Senior Backend Engineering Interviewer",
      },
    });
  });

  it("rejects unsupported interview types, personas, difficulty, and question modes", async () => {
    const { validateInterviewerConfigInput } = await validationModule();

    expect(
      validateInterviewerConfigInput({ ...validConfig, interviewType: "culture_fit" }),
    ).toEqual({
      ok: false,
      message: "Choose a supported interview type.",
    });

    expect(
      validateInterviewerConfigInput({ ...validConfig, persona: "aggressive" }),
    ).toEqual({
      ok: false,
      message: "Choose a supported interviewer persona.",
    });

    expect(
      validateInterviewerConfigInput({ ...validConfig, difficulty: "extreme" }),
    ).toEqual({
      ok: false,
      message: "Choose an interview difficulty of easy, medium, or hard.",
    });

    expect(
      validateInterviewerConfigInput({ ...validConfig, questionMode: "unbounded_adaptive" }),
    ).toEqual({
      ok: false,
      message: "Choose a supported question strategy.",
    });
  });

  it("bounds duration and follow-up policy", async () => {
    const { validateInterviewerConfigInput } = await validationModule();

    for (const durationSeconds of [0, 899, 3601, 1800.5]) {
      expect(
        validateInterviewerConfigInput({ ...validConfig, durationSeconds }),
      ).toEqual({
        ok: false,
        message: "Interview duration must be a whole number between 900 and 3600 seconds.",
      });
    }

    expect(
      validateInterviewerConfigInput({
        ...validConfig,
        followUpPolicy: {
          ...validConfig.followUpPolicy,
          maxFollowUpsPerQuestion: 3,
        },
      }),
    ).toEqual({
      ok: false,
      message: "Follow-up policy allows at most 2 follow-ups per question.",
    });

    expect(
      validateInterviewerConfigInput({
        ...validConfig,
        followUpPolicy: {
          ...validConfig.followUpPolicy,
          allowedReasons: ["candidate_likeability"],
        },
      }),
    ).toEqual({
      ok: false,
      message: "Follow-up policy contains an unsupported reason.",
    });
  });

  it("requires bounded admin and candidate-facing text", async () => {
    const { validateInterviewerConfigInput } = await validationModule();

    expect(validateInterviewerConfigInput({ ...validConfig, name: "   " })).toEqual({
      ok: false,
      message: "Interviewer name is required.",
    });

    expect(
      validateInterviewerConfigInput({
        ...validConfig,
        guidelines: "x".repeat(8001),
      }),
    ).toEqual({
      ok: false,
      message: "Interview guidelines must be 8000 characters or fewer.",
    });

    expect(
      validateInterviewerConfigInput({
        ...validConfig,
        candidateInstructions: "x".repeat(4001),
      }),
    ).toEqual({
      ok: false,
      message: "Candidate instructions must be 4000 characters or fewer.",
    });
  });
});
