import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { RecoveryForm } from "./recovery-form";

describe("RecoveryForm", () => {
  it("renders an accessible forgot-password form", () => {
    render(<RecoveryForm mode="request" />);

    expect(screen.getByRole("heading", { name: /reset your password/i })).toBeVisible();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("name", "email");
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("autocomplete", "email");
    expect(screen.getByRole("button", { name: /send reset link/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /back to log in/i })).toHaveAttribute(
      "href",
      "/auth/login",
    );
  });

  it("renders an accessible new-password form with the password contract", () => {
    render(<RecoveryForm mode="reset" />);

    expect(screen.getByRole("heading", { name: /choose a new password/i })).toBeVisible();
    expect(screen.getByLabelText(/new password/i)).toHaveAttribute("name", "password");
    expect(screen.getByLabelText(/new password/i)).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
    expect(screen.getByLabelText(/new password/i)).toHaveAttribute("minlength", "8");
    expect(screen.getByRole("button", { name: /update password/i })).toBeVisible();
  });

  it("announces generic reset-request success without disclosing account existence", () => {
    render(
      <RecoveryForm
        mode="request"
        message="If an account exists for that email, a password reset link has been sent."
        messageRole="status"
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent(
      "If an account exists for that email, a password reset link has been sent.",
    );
  });
});
