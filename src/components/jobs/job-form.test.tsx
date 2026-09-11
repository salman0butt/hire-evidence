import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JobForm } from "./job-form";

const existingJob = {
  id: "22222222-2222-4222-8222-222222222222",
  title: "Senior Platform Engineer",
  department: "Engineering",
  description: "Build reliable systems.",
  responsibilities: "Own platform reliability.",
  seniority: "Senior",
  employmentType: "Full-time",
  location: "Remote",
  salaryRange: "80k-100k",
  interviewInstructions: "Focus on job-related evidence.",
  requirements: [
    { kind: "must_have" as const, requirement: "TypeScript" },
    { kind: "must_have" as const, requirement: "PostgreSQL" },
    { kind: "nice_to_have" as const, requirement: "Kubernetes" },
  ],
};

describe("JobForm", () => {
  it("renders bounded accessible job fields and explicit requirement categories", () => {
    render(<JobForm mode="create" />);

    expect(screen.getByRole("heading", { name: /create job/i })).toBeVisible();
    expect(screen.getByLabelText(/^job title$/i)).toHaveAttribute("maxlength", "160");
    expect(screen.getByLabelText(/^job title$/i)).toHaveAttribute("required");
    expect(screen.getByLabelText(/^department$/i)).toHaveAttribute("maxlength", "120");
    expect(screen.getByLabelText(/^description$/i)).toHaveAttribute("maxlength", "10000");
    expect(screen.getByLabelText(/^responsibilities$/i)).toHaveAttribute(
      "maxlength",
      "10000",
    );
    expect(screen.getByLabelText(/^seniority$/i)).toHaveAttribute("maxlength", "80");
    expect(screen.getByLabelText(/^employment type$/i)).toHaveAttribute("maxlength", "80");
    expect(screen.getByLabelText(/^location$/i)).toHaveAttribute("maxlength", "160");
    expect(screen.getByLabelText(/^salary range$/i)).toHaveAttribute("maxlength", "160");
    expect(screen.getByLabelText(/^interview instructions$/i)).toHaveAttribute(
      "maxlength",
      "5000",
    );
    expect(screen.getByLabelText(/^must-have requirements$/i)).toHaveAttribute(
      "name",
      "must_have_requirements",
    );
    expect(screen.getByLabelText(/^nice-to-have requirements$/i)).toHaveAttribute(
      "name",
      "nice_to_have_requirements",
    );
    expect(screen.getByRole("button", { name: /create job/i })).toBeVisible();
  });

  it("prefills edit values and keeps requirement kinds visibly separate", () => {
    render(<JobForm mode="edit" initialJob={existingJob} />);

    expect(screen.getByRole("heading", { name: /edit job/i })).toBeVisible();
    expect(screen.getByLabelText(/^job title$/i)).toHaveValue(existingJob.title);
    expect(screen.getByLabelText(/^must-have requirements$/i)).toHaveValue(
      "TypeScript\nPostgreSQL",
    );
    expect(screen.getByLabelText(/^nice-to-have requirements$/i)).toHaveValue(
      "Kubernetes",
    );
    expect(screen.getByRole("button", { name: /save changes/i })).toBeVisible();
  });

  it("can render read-only job details for members without manage capability", () => {
    render(<JobForm mode="edit" initialJob={existingJob} readOnly />);

    expect(screen.getByLabelText(/^job title$/i)).toBeDisabled();
    expect(screen.getByLabelText(/^must-have requirements$/i)).toBeDisabled();
    expect(screen.queryByRole("button", { name: /save changes/i })).not.toBeInTheDocument();
  });
});
