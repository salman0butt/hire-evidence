import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OrganizationForm } from "./organization-form";

describe("OrganizationForm", () => {
  it("renders accessible organization onboarding fields", () => {
    render(<OrganizationForm />);

    expect(screen.getByRole("heading", { name: /create organization/i })).toBeVisible();

    const name = screen.getByLabelText(/^organization name$/i);
    expect(name).toHaveAttribute("name", "name");
    expect(name).toHaveAttribute("maxlength", "120");
    expect(name).toHaveAttribute("required");

    const companySize = screen.getByLabelText(/^company size$/i);
    expect(companySize).toHaveAttribute("name", "company_size");
    expect(companySize).toHaveAttribute("maxlength", "80");

    const hiringUseCase = screen.getByLabelText(/^hiring use case$/i);
    expect(hiringUseCase).toHaveAttribute("name", "hiring_use_case");
    expect(hiringUseCase).toHaveAttribute("maxlength", "500");

    expect(screen.getByRole("button", { name: /create organization/i })).toBeVisible();
    expect(screen.queryByText(/interviewer builder/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/create job/i)).not.toBeInTheDocument();
  });

  it("announces errors through an alert region", () => {
    render(
      <OrganizationForm
        message="Organization name is required."
        messageRole="alert"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Organization name is required.",
    );
  });
});
