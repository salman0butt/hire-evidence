import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ProfileForm } from "./profile-form";

describe("ProfileForm", () => {
  it("renders an accessible display-name settings form", () => {
    render(<ProfileForm initialDisplayName="Salman Butt" />);

    expect(screen.getByRole("heading", { name: /profile/i })).toBeVisible();
    const displayName = screen.getByLabelText(/^display name$/i);
    expect(displayName).toHaveAttribute("name", "display_name");
    expect(displayName).toHaveAttribute("maxlength", "120");
    expect(displayName).toHaveValue("Salman Butt");
    expect(screen.getByText(/120 characters or fewer/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /save profile/i })).toBeVisible();
  });

  it("announces validation errors", () => {
    render(
      <ProfileForm
        initialDisplayName={null}
        message="Display name must be 120 characters or fewer."
        messageRole="alert"
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Display name must be 120 characters or fewer.",
    );
  });

  it("announces successful saves without treating them as errors", () => {
    render(
      <ProfileForm
        initialDisplayName="Salman Butt"
        message="Profile saved."
        messageRole="status"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Profile saved.");
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
