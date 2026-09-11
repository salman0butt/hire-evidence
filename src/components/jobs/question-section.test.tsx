import { render, screen } from "@testing-library/react";
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
    weight: 40,
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

async function questionSectionModule() {
  const modulePath = "./question-section";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    QuestionSection: (props: {
      questions: typeof questions;
      competencies: typeof competencies;
      readOnly?: boolean;
      action?: (
        previousState: { status: "idle" | "success" | "error"; message: string | null },
        formData: FormData,
      ) => Promise<{ status: "idle" | "success" | "error"; message: string | null }>;
    }) => ReactNode;
  }>;
}

describe("QuestionSection", () => {
  it("renders deterministic question-bank evidence with competency context", async () => {
    const { QuestionSection } = await questionSectionModule();

    render(<QuestionSection questions={questions} competencies={competencies} readOnly />);

    expect(screen.getByRole("heading", { name: "Question bank" })).toBeInTheDocument();
    expect(screen.getByText("Describe a production incident you owned.")).toBeInTheDocument();
    expect(screen.getByText(/Systems design/)).toBeInTheDocument();
    expect(screen.getByText(/Hard/)).toBeInTheDocument();
    expect(screen.getByText(/Required/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add question" })).not.toBeInTheDocument();
  });

  it("offers an accessible explicit-acceptance form when editing is allowed", async () => {
    const { QuestionSection } = await questionSectionModule();
    const action = async () => ({ status: "success" as const, message: "Question added." });
    const { container } = render(
      <QuestionSection questions={[]} competencies={competencies} action={action} />,
    );

    expect(screen.getByLabelText("Competency")).toHaveValue(competencyId);
    expect(screen.getByLabelText("Question text")).toBeRequired();
    expect(screen.getByLabelText("Difficulty")).toHaveValue("medium");
    expect(screen.getByLabelText("Expected areas")).toBeInTheDocument();
    expect(screen.getByLabelText("Follow-up hints")).toBeInTheDocument();
    expect(screen.getByLabelText("Maximum duration in seconds")).toHaveValue(300);
    expect(screen.getByLabelText("Required question")).toBeChecked();
    expect(screen.getByRole("button", { name: "Add question" })).toBeEnabled();
    expect(container.querySelector('input[name="position"]')).toHaveValue(0);
  });

  it("does not present an authoring form when no competency exists", async () => {
    const { QuestionSection } = await questionSectionModule();

    render(<QuestionSection questions={[]} competencies={[]} />);

    expect(screen.getByText(/Add at least one competency before adding interview questions/)).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add question" })).not.toBeInTheDocument();
  });
});
