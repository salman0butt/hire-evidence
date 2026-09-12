import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { CompetencySection } from "./competency-section";

const competencies = [
  {
    id: "11111111-1111-4111-8111-111111111111",
    jobId: "22222222-2222-4222-8222-222222222222",
    name: "Systems design",
    description: "Designs reliable job-relevant systems.",
    weight: 40,
    position: 0,
  },
  {
    id: "33333333-3333-4333-8333-333333333333",
    jobId: "22222222-2222-4222-8222-222222222222",
    name: "Technical communication",
    description: null,
    weight: 30,
    position: 2,
  },
];

async function idleAction() {
  return { status: "idle" as const, message: null };
}

async function idleRubricAction(_competencyId: string) {
  return { status: "idle" as const, message: null };
}

describe("CompetencySection", () => {
  it("renders job-related competencies and weights in deterministic input order", () => {
    render(<CompetencySection competencies={competencies} readOnly />);

    expect(screen.getByRole("heading", { name: "Competencies" })).toBeInTheDocument();
    expect(screen.getByText("Systems design")).toBeInTheDocument();
    expect(screen.getByText("Designs reliable job-relevant systems.")).toBeInTheDocument();
    expect(screen.getByText("Weight: 40")).toBeInTheDocument();
    expect(screen.getByText("Technical communication")).toBeInTheDocument();
    expect(screen.getByText("Weight: 30")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Add competency" })).not.toBeInTheDocument();
  });

  it("shows an explicit empty state", () => {
    render(<CompetencySection competencies={[]} readOnly />);

    expect(
      screen.getByText("No competencies have been defined for this job yet."),
    ).toBeInTheDocument();
  });

  it("lets authorized managers add a competency without exposing route ownership fields", () => {
    const { container } = render(
      <CompetencySection competencies={competencies} action={idleAction} />,
    );

    expect(screen.getByLabelText("Competency name")).toBeInTheDocument();
    expect(screen.getByLabelText("Description")).toBeInTheDocument();
    expect(screen.getByLabelText("Weight")).toHaveAttribute("min", "0.01");
    expect(screen.getByRole("button", { name: "Add competency" })).toBeInTheDocument();

    expect(container.querySelector('input[name="position"]')).toHaveValue("3");
    expect(container.querySelector('input[name="organization_id"]')).toBeNull();
    expect(container.querySelector('input[name="job_id"]')).toBeNull();
  });

  it("exposes an observable five-level rubric editor for every competency", () => {
    render(<CompetencySection competencies={competencies} action={idleAction} />);

    for (let level = 1; level <= 5; level += 1) {
      expect(
        screen.getByLabelText(`Systems design score ${level}`),
      ).toBeInTheDocument();
      expect(
        screen.getByLabelText(`Technical communication score ${level}`),
      ).toBeInTheDocument();
    }

    expect(
      screen.getByRole("button", { name: "Save Systems design rubric" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Save Technical communication rubric" }),
    ).toBeInTheDocument();
  });

  it("enables rubric save controls only when a verified save action is supplied", () => {
    render(
      <CompetencySection
        {...({
          competencies,
          action: idleAction,
          rubricAction: idleRubricAction,
        } as Parameters<typeof CompetencySection>[0])}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Save Systems design rubric" }),
    ).toBeEnabled();
    expect(
      screen.getByRole("button", { name: "Save Technical communication rubric" }),
    ).toBeEnabled();
  });
});
