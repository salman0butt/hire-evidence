import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { JobList } from "./job-list";

const organizationId = "11111111-1111-4111-8111-111111111111";
const job = {
  id: "22222222-2222-4222-8222-222222222222",
  title: "Senior Platform Engineer",
  department: "Engineering",
  description: null,
  responsibilities: null,
  seniority: "Senior",
  employmentType: "Full-time",
  location: "Remote",
  salaryRange: null,
  interviewInstructions: null,
  requirements: [
    { kind: "must_have" as const, requirement: "TypeScript" },
    { kind: "nice_to_have" as const, requirement: "Kubernetes" },
  ],
};
const jobs = [job];

describe("JobList", () => {
  it("renders empty state and create affordance for job managers", () => {
    render(<JobList organizationId={organizationId} jobs={[]} canManage />);

    expect(screen.getByText(/no jobs yet/i)).toBeVisible();
    expect(screen.getByRole("link", { name: /create job/i })).toHaveAttribute(
      "href",
      `/app/o/${organizationId}/jobs/new`,
    );
  });

  it("renders job evidence categories and edit links", () => {
    render(<JobList organizationId={organizationId} jobs={jobs} canManage />);

    expect(screen.getByRole("heading", { name: job.title })).toBeVisible();
    expect(screen.getByText(/must-have: 1/i)).toBeVisible();
    expect(screen.getByText(/nice-to-have: 1/i)).toBeVisible();
    expect(screen.getByRole("link", { name: /edit senior platform engineer/i })).toHaveAttribute(
      "href",
      `/app/o/${organizationId}/jobs/${job.id}`,
    );
  });

  it("keeps jobs readable without exposing management affordances", () => {
    render(<JobList organizationId={organizationId} jobs={jobs} canManage={false} />);

    expect(screen.getByRole("heading", { name: job.title })).toBeVisible();
    expect(screen.queryByRole("link", { name: /create job/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view senior platform engineer/i })).toBeVisible();
  });
});
