import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { OrganizationSettingsForm } from "./organization-settings-form";

describe("OrganizationSettingsForm", () => {
  it("renders bounded editable organization fields with accessible guidance", () => {
    render(
      <OrganizationSettingsForm
        organization={{
          name: "Acme",
          companySize: "51-200",
          hiringUseCase: "Structured technical hiring",
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: /organization settings/i })).toBeVisible();
    expect(screen.getByLabelText(/organization name/i)).toHaveValue("Acme");
    expect(screen.getByLabelText(/company size/i)).toHaveValue("51-200");
    expect(screen.getByLabelText(/hiring use case/i)).toHaveValue(
      "Structured technical hiring",
    );
    expect(screen.getByRole("button", { name: /save settings/i })).toBeVisible();
    expect(screen.queryByLabelText(/created by/i)).not.toBeInTheDocument();
    expect(screen.queryByLabelText(/role/i)).not.toBeInTheDocument();
  });

  it("renders a read-only explanation when the viewer cannot update settings", () => {
    render(
      <OrganizationSettingsForm
        organization={{ name: "Acme", companySize: null, hiringUseCase: null }}
        canUpdate={false}
      />,
    );

    expect(screen.getByText(/only organization owners and admins can change these settings/i)).toBeVisible();
    expect(screen.getByLabelText(/organization name/i)).toBeDisabled();
    expect(screen.getByLabelText(/company size/i)).toBeDisabled();
    expect(screen.getByLabelText(/hiring use case/i)).toBeDisabled();
    expect(screen.queryByRole("button", { name: /save settings/i })).not.toBeInTheDocument();
  });
});
