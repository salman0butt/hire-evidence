import { describe, expect, it } from "vitest";

async function validationModule() {
  const modulePath = "./interview-plan-validation";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    validateInterviewPlanInput: (
      input: {
        totalDurationSeconds: number;
        sections: Array<{
          purpose: string;
          durationSeconds: number;
          position: number;
          questionIds: string[];
          competencyIds: string[];
        }>;
      },
      context: {
        maxTotalDurationSeconds: number;
        allowedQuestionIds: readonly string[];
        allowedCompetencyIds: readonly string[];
        requiredQuestionIds: readonly string[];
        requiredCompetencyIds: readonly string[];
      },
    ) => unknown;
  }>;
}

const context = {
  maxTotalDurationSeconds: 3600,
  allowedQuestionIds: ["q-1", "q-2", "q-3"],
  allowedCompetencyIds: ["c-1", "c-2"],
  requiredQuestionIds: ["q-1", "q-2"],
  requiredCompetencyIds: ["c-1", "c-2"],
} as const;

const validPlan = {
  totalDurationSeconds: 900,
  sections: [
    {
      purpose: "  Technical fundamentals  ",
      durationSeconds: 300,
      position: 0,
      questionIds: ["q-1"],
      competencyIds: ["c-1"],
    },
    {
      purpose: "Problem solving",
      durationSeconds: 600,
      position: 1,
      questionIds: ["q-2", "q-3"],
      competencyIds: ["c-2"],
    },
  ],
};

describe("validateInterviewPlanInput", () => {
  it("normalizes a deterministic ordered plan", async () => {
    const { validateInterviewPlanInput } = await validationModule();

    expect(validateInterviewPlanInput(validPlan, context)).toEqual({
      ok: true,
      value: {
        totalDurationSeconds: 900,
        sections: [
          {
            purpose: "Technical fundamentals",
            durationSeconds: 300,
            position: 0,
            questionIds: ["q-1"],
            competencyIds: ["c-1"],
          },
          {
            purpose: "Problem solving",
            durationSeconds: 600,
            position: 1,
            questionIds: ["q-2", "q-3"],
            competencyIds: ["c-2"],
          },
        ],
      },
    });
  });

  it("requires positive integer section durations within the configured total bound", async () => {
    const { validateInterviewPlanInput } = await validationModule();

    for (const durationSeconds of [0, -1, 1.5, Number.NaN, 3601]) {
      expect(
        validateInterviewPlanInput(
          {
            totalDurationSeconds: durationSeconds,
            sections: [
              {
                ...validPlan.sections[0],
                durationSeconds,
              },
            ],
          },
          context,
        ),
      ).toEqual({
        ok: false,
        message:
          "Interview duration and every section duration must be positive integers within the configured maximum.",
      });
    }
  });

  it("requires deterministic contiguous section ordering", async () => {
    const { validateInterviewPlanInput } = await validationModule();

    expect(
      validateInterviewPlanInput(
        {
          ...validPlan,
          sections: [
            validPlan.sections[0],
            { ...validPlan.sections[1], position: 2 },
          ],
        },
        context,
      ),
    ).toEqual({
      ok: false,
      message: "Interview plan section positions must be contiguous from zero.",
    });
  });

  it("requires the declared total duration to equal the section budgets", async () => {
    const { validateInterviewPlanInput } = await validationModule();

    expect(
      validateInterviewPlanInput(
        { ...validPlan, totalDurationSeconds: 901 },
        context,
      ),
    ).toEqual({
      ok: false,
      message: "Interview plan duration must equal the sum of section durations.",
    });
  });

  it("rejects questions and competencies outside the job-bound allowed sets", async () => {
    const { validateInterviewPlanInput } = await validationModule();

    expect(
      validateInterviewPlanInput(
        {
          ...validPlan,
          sections: [
            { ...validPlan.sections[0], questionIds: ["q-other-job"] },
            validPlan.sections[1],
          ],
        },
        context,
      ),
    ).toEqual({
      ok: false,
      message: "Interview plan contains a question outside this job.",
    });

    expect(
      validateInterviewPlanInput(
        {
          ...validPlan,
          sections: [
            { ...validPlan.sections[0], competencyIds: ["c-other-job"] },
            validPlan.sections[1],
          ],
        },
        context,
      ),
    ).toEqual({
      ok: false,
      message: "Interview plan contains a competency outside this job.",
    });
  });

  it("requires coverage of every required question and competency", async () => {
    const { validateInterviewPlanInput } = await validationModule();

    expect(
      validateInterviewPlanInput(
        {
          ...validPlan,
          sections: [
            validPlan.sections[0],
            { ...validPlan.sections[1], questionIds: ["q-3"] },
          ],
        },
        context,
      ),
    ).toEqual({
      ok: false,
      message: "Interview plan must cover every required question.",
    });

    expect(
      validateInterviewPlanInput(
        {
          ...validPlan,
          sections: [
            validPlan.sections[0],
            { ...validPlan.sections[1], competencyIds: ["c-1"] },
          ],
        },
        context,
      ),
    ).toEqual({
      ok: false,
      message: "Interview plan must cover every required competency.",
    });
  });
});
