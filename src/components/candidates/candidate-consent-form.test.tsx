import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

async function loadConsentForm() {
  const modulePath = "./candidate-consent-form";
  return (await import(modulePath)) as {
    CandidateConsentForm: (props: {
      action: (
        previousState: {
          status: "idle" | "success" | "error";
          message: string | null;
        },
        formData: FormData,
      ) => Promise<{
        status: "idle" | "success" | "error";
        message: string | null;
      }>;
    }) => React.ReactNode;
  };
}

describe("CandidateConsentForm", () => {
  it("renders the required disclosure categories and an explicit required consent control", async () => {
    const { CandidateConsentForm } = await loadConsentForm();
    const action = vi.fn().mockResolvedValue({
      status: "success",
      message: "Consent recorded.",
    });

    render(<CandidateConsentForm action={action} />);

    expect(
      screen.getByRole("heading", { name: "AI and privacy disclosures" }),
    ).toBeInTheDocument();
    expect(screen.getByText("AI-assisted interview")).toBeInTheDocument();
    expect(screen.getByText("Transcription")).toBeInTheDocument();
    expect(screen.getByText("Data processing")).toBeInTheDocument();
    expect(screen.getByText("Retention")).toBeInTheDocument();

    const checkbox = screen.getByRole("checkbox", {
      name: /I have read these disclosures and consent/i,
    });
    expect(checkbox).toBeRequired();
    expect(checkbox).not.toBeChecked();
    expect(
      screen.getByRole("button", { name: "Record consent" }),
    ).toBeInTheDocument();
  });
});
