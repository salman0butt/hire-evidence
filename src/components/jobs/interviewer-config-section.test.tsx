import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

const planId = "33333333-3333-4333-8333-333333333333";
const configId = "44444444-4444-4444-8444-444444444444";

const initialConfig = {
  id: configId,
  planId,
  name: "Technical interviewer",
  interviewType: "technical" as const,
  persona: "professional" as const,
  language: "English",
  durationSeconds: 1800,
  difficulty: "hard" as const,
  questionMode: "semi_adaptive" as const,
  guidelines: "Ask for concrete evidence.",
  candidateInstructions: "Explain your reasoning.",
  followUpPolicy: {
    maxFollowUpsPerQuestion: 2,
    allowedReasons: ["clarify_ambiguity", "explore_reasoning"] as const,
  },
};

async function interviewerConfigSectionModule() {
  const modulePath = "./interviewer-config-section";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    InterviewerConfigSection: (props: {
      planId: string | null;
      initialConfig?: typeof initialConfig;
      readOnly?: boolean;
      action?: (
        previousState: { status: "idle" | "success" | "error"; message: string | null },
        formData: FormData,
      ) => Promise<{ status: "idle" | "success" | "error"; message: string | null }>;
    }) => ReactNode;
  }>;
}

describe("InterviewerConfigSection", () => {
  it("renders an accessible bounded configuration editor linked to the interview plan", async () => {
    const { InterviewerConfigSection } = await interviewerConfigSectionModule();
    const action = async () => ({ status: "success" as const, message: "Saved." });
    const { container } = render(
      <InterviewerConfigSection planId={planId} action={action} />,
    );

    expect(screen.getByRole("heading", { name: "Interviewer configuration" })).toBeInTheDocument();
    expect(screen.getByLabelText("Internal interviewer name")).toBeRequired();
    expect(screen.getByLabelText("Interview type")).toBeInTheDocument();
    expect(screen.getByLabelText("Persona")).toBeInTheDocument();
    expect(screen.getByLabelText("Language")).toBeRequired();
    expect(screen.getByLabelText("Duration in seconds")).toHaveAttribute("min", "900");
    expect(screen.getByLabelText("Duration in seconds")).toHaveAttribute("max", "3600");
    expect(screen.getByLabelText("Difficulty")).toBeInTheDocument();
    expect(screen.getByLabelText("Question strategy")).toBeInTheDocument();
    expect(screen.getByLabelText("Interview guidelines")).toHaveAttribute("maxLength", "8000");
    expect(screen.getByLabelText("Candidate instructions")).toHaveAttribute("maxLength", "4000");
    expect(screen.getByLabelText("Maximum follow-ups per question")).toHaveAttribute("max", "2");
    expect(screen.getByLabelText("Clarify ambiguity")).toBeInTheDocument();
    expect(screen.getByLabelText("Explore reasoning")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Save interviewer configuration" })).toBeEnabled();
    expect(container.querySelector('input[name="plan_id"]')).toHaveValue(planId);
  });

  it("prefills existing draft configuration including follow-up policy", async () => {
    const { InterviewerConfigSection } = await interviewerConfigSectionModule();
    const action = async () => ({ status: "success" as const, message: "Saved." });
    const { container } = render(
      <InterviewerConfigSection planId={planId} initialConfig={initialConfig} action={action} />,
    );

    expect(screen.getByLabelText("Internal interviewer name")).toHaveValue("Technical interviewer");
    expect(screen.getByLabelText("Interview type")).toHaveValue("technical");
    expect(screen.getByLabelText("Persona")).toHaveValue("professional");
    expect(screen.getByLabelText("Language")).toHaveValue("English");
    expect(screen.getByLabelText("Duration in seconds")).toHaveValue(1800);
    expect(screen.getByLabelText("Difficulty")).toHaveValue("hard");
    expect(screen.getByLabelText("Question strategy")).toHaveValue("semi_adaptive");
    expect(screen.getByLabelText("Clarify ambiguity")).toBeChecked();
    expect(screen.getByLabelText("Explore reasoning")).toBeChecked();
    expect(container.querySelector('input[name="config_id"]')).toHaveValue(configId);
  });

  it("renders existing configuration read-only without mutation controls", async () => {
    const { InterviewerConfigSection } = await interviewerConfigSectionModule();

    render(<InterviewerConfigSection planId={planId} initialConfig={initialConfig} readOnly />);

    expect(screen.getByText("Technical interviewer")).toBeInTheDocument();
    expect(screen.getByText("Ask for concrete evidence.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save interviewer configuration" })).not.toBeInTheDocument();
  });

  it("blocks editing until an interview plan exists", async () => {
    const { InterviewerConfigSection } = await interviewerConfigSectionModule();

    render(<InterviewerConfigSection planId={null} />);

    expect(
      screen.getByText("Save an interview plan before configuring the interviewer."),
    ).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Save interviewer configuration" })).not.toBeInTheDocument();
  });
});
