import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

const jobId = "22222222-2222-4222-8222-222222222222";
const competencyId = "33333333-3333-4333-8333-333333333333";
const questionId = "44444444-4444-4444-8444-444444444444";

const competencies = [
  {
    id: competencyId,
    jobId,
    name: "Systems design",
    description: "Designs reliable systems.",
    weight: 100,
    position: 0,
  },
];

const questions = [
  {
    id: questionId,
    jobId,
    competencyId,
    questionText: "Describe a production incident you owned.",
    difficulty: "hard" as const,
    expectedAreas: ["diagnosis", "remediation"],
    followUpHints: ["Ask about verification."],
    maxDurationSeconds: 600,
    isRequired: true,
    position: 0,
  },
];

const initialPlan = {
  totalDurationSeconds: 600,
  sections: [
    {
      purpose: "Technical evidence",
      durationSeconds: 600,
      position: 0,
      questionIds: [questionId],
      competencyIds: [competencyId],
    },
  ],
};

async function interviewPlanSectionModule() {
  const modulePath = "./interview-plan-section";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    InterviewPlanSection: (props: {
      questions: typeof questions;
      competencies: typeof competencies;
      maxTotalDurationSeconds: number;
      initialPlan?: typeof initialPlan;
      readOnly?: boolean;
      action?: (
        previousState: { status: "idle" | "success" | "error"; message: string | null },
        formData: FormData,
      ) => Promise<{ status: "idle" | "success" | "error"; message: string | null }>;
    }) => ReactNode;
  }>;
}

describe("InterviewPlanSection", () => {
  it("renders an accessible ordered plan editor from job questions and competencies", async () => {
    const { InterviewPlanSection } = await interviewPlanSectionModule();
    const action = async () => ({ status: "success" as const, message: "Plan saved." });

    render(
      <InterviewPlanSection
        questions={questions}
        competencies={competencies}
        maxTotalDurationSeconds={3600}
        action={action}
      />,
    );

    expect(screen.getByRole("heading", { name: "Interview plan" })).toBeInTheDocument();
    expect(screen.getByLabelText("Section 1 purpose")).toBeRequired();
    expect(screen.getByLabelText("Section 1 duration in seconds")).toHaveValue(300);
    expect(screen.getByLabelText("Describe a production incident you owned.")).toBeInTheDocument();
    expect(screen.getByLabelText("Systems design")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add section" })).toBeEnabled();
    expect(screen.getByRole("button", { name: "Save interview plan" })).toBeEnabled();
  });

  it("serializes deterministic contiguous positions and derives total duration", async () => {
    const { InterviewPlanSection } = await interviewPlanSectionModule();
    const action = async () => ({ status: "success" as const, message: "Plan saved." });
    const { container } = render(
      <InterviewPlanSection
        questions={questions}
        competencies={competencies}
        maxTotalDurationSeconds={3600}
        action={action}
      />,
    );

    fireEvent.change(screen.getByLabelText("Section 1 purpose"), {
      target: { value: "Technical evidence" },
    });
    fireEvent.change(screen.getByLabelText("Section 1 duration in seconds"), {
      target: { value: "600" },
    });
    fireEvent.click(screen.getByLabelText("Describe a production incident you owned."));
    fireEvent.click(screen.getByLabelText("Systems design"));
    fireEvent.click(screen.getByRole("button", { name: "Add section" }));

    const serialized = container.querySelector('input[name="plan_json"]');
    expect(serialized).not.toBeNull();
    expect(JSON.parse((serialized as HTMLInputElement).value)).toEqual({
      totalDurationSeconds: 900,
      sections: [
        {
          purpose: "Technical evidence",
          durationSeconds: 600,
          position: 0,
          questionIds: [questionId],
          competencyIds: [competencyId],
        },
        {
          purpose: "",
          durationSeconds: 300,
          position: 1,
          questionIds: [],
          competencyIds: [],
        },
      ],
    });
  });

  it("renders an existing plan read-only without mutation controls", async () => {
    const { InterviewPlanSection } = await interviewPlanSectionModule();

    render(
      <InterviewPlanSection
        questions={questions}
        competencies={competencies}
        maxTotalDurationSeconds={3600}
        initialPlan={initialPlan}
        readOnly
      />,
    );

    expect(screen.getByText("Technical evidence")).toBeInTheDocument();
    expect(screen.getByText("600 seconds")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add section" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save interview plan" })).not.toBeInTheDocument();
  });
});
