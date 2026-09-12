import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";

async function interviewerPreviewSectionModule() {
  const modulePath = "./interviewer-preview-section";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    InterviewerPreviewSection: (props: {
      action: (
        previousState: {
          status: "idle" | "success" | "error";
          message: string | null;
          preview: null;
        },
        formData: FormData,
      ) => Promise<{
        status: "idle" | "success" | "error";
        message: string | null;
        preview: null | {
          interviewerName: string;
          jobTitle: string;
          questionCount: number;
          sectionCount: number;
          billable: false;
          persisted: false;
        };
      }>;
    }) => ReactNode;
  }>;
}

describe("InterviewerPreviewSection", () => {
  it("clearly labels preview as simulated and non-billable", async () => {
    const { InterviewerPreviewSection } = await interviewerPreviewSectionModule();
    const action = async () => ({
      status: "success" as const,
      message: "Preview generated. No candidate interview or billable usage was created.",
      preview: {
        interviewerName: "Senior Engineer Interviewer",
        jobTitle: "Senior Engineer",
        questionCount: 2,
        sectionCount: 1,
        billable: false as const,
        persisted: false as const,
      },
    });

    render(<InterviewerPreviewSection action={action} />);

    expect(
      screen.getByRole("heading", { name: "Simulated interviewer preview" }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/does not create a candidate interview, assessment evidence, or billable usage/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Generate simulated preview" }),
    ).toBeEnabled();
  });
});
