import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OrganizationSettingsForm } from "./organization-settings-form";

const organizationWithSupport = {
  name: "Acme",
  companySize: "51-200",
  hiringUseCase: "Structured technical hiring",
  candidateSupportEmail: "candidates@acme.test",
  candidateSupportUrl: "https://acme.test/interview-support",
};

describe("OrganizationSettingsForm", () => {
  it("renders bounded editable organization and candidate support fields with accessible guidance", () => {
    render(<OrganizationSettingsForm organization={organizationWithSupport} />);

    expect(screen.getByRole("heading", { name: /organization settings/i })).toBeVisible();
    expect(screen.getByLabelText(/organization name/i)).toHaveValue("Acme");
    expect(screen.getByLabelText(/company size/i)).toHaveValue("51-200");
    expect(screen.getByLabelText(/hiring use case/i)).toHaveValue(
      "Structured technical hiring",
    );
    expect(screen.getByLabelText(/candidate support email/i)).toHaveValue(
      "candidates@acme.test",
    );
    expect(screen.getByLabelText(/candidate support email/i)).toHaveAttribute(
      "type",
      "email",
    );
    expect(screen.getByLabelText(/candidate support url/i)).toHaveValue(
      "https://acme.test/interview-support",
    );
    expect(screen.getByLabelText(/candidate support url/i)).toHaveAttribute(
      "type",
      "url",
    );
    expect(screen.getByRole("button", { name: /save settings/i })).toBeVisible();
    expect(screen.queryByLabelText(/created by/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/role/i)).not.toBeInTheDocument();
  });

  it("renders a read-only explanation when the viewer cannot update settings", () => {
    render(
      <OrganizationSettingsForm
        organization={organizationWithSupport}
        canUpdate={false}
      />,
    );

    expect(screen.getByText(/only organization owners and admins can change these settings/i)).toBeVisible();
    expect(screen.getByLabelText(/organization name/i)).toBeDisabled();
    expect(screen.getByLabelText(/company size/i)).toBeDisabled();
    expect(screen.getByLabelText(/hiring use case/i)).toBeDisabled();
    expect(screen.getByLabelText(/candidate support email/i)).toBeDisabled();
    expect(screen.getByLabelText(/candidate support url/i)).toBeDisabled();
    expect(screen.queryByRole("button", { name: /save settings/i })).not.toBeInTheDocument();
  });
});
