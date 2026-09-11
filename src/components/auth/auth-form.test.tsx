import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AuthForm } from "./auth-form";

describe("AuthForm", () => {
  it("renders an accessible login form with signup and recovery paths", () => {
    render(<AuthForm mode="login" errorMessage={null} />);

    expect(screen.getByRole("heading", { name: /log in to hire evidence/i })).toBeVisible();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("name", "email");
    expect(screen.getByLabelText(/password/i)).toHaveAttribute("name", "password");
    expect(screen.getByRole("button", { name: /log in/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /forgot password/i })).toHaveAttribute(
      "href",
      "/auth/forgot-password",
    );
    expect(screen.getByRole("link", { name: /create an account/i })).toHaveAttribute(
      "href",
      "/auth/signup",
    );
  });

  it("renders an accessible signup form with a login path", () => {
    render(<AuthForm mode="signup" errorMessage={null} />);

    expect(screen.getByRole("heading", { name: /create your hire evidence account/i })).toBeVisible();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText(/password/i)).toHaveAttribute("autocomplete", "new-password");
    expect(screen.getByRole("button", { name: /create account/i })).toBeVisible();
    expect(screen.getByRole("link", { name: /log in instead/i })).toHaveAttribute(
      "href",
      "/auth/login",
    );
  });

  it("announces a form-level error without exposing provider details", () => {
    render(<AuthForm mode="login" errorMessage="We could not sign you in. Check your details and try again." />);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "We could not sign you in. Check your details and try again.",
    );
  });
});
