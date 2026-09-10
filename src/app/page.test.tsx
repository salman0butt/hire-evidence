import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home", () => {
  it("positions structured interviewing with clear conversion paths", () => {
    render(<Home />);

    expect(
      screen.getByRole("heading", {
        level: 1,
        name: /create structured ai interviews once\. interview candidates anytime\./i,
      }),
    ).toBeVisible();

    const signupLinks = screen.getAllByRole("link", { name: /create your first interviewer/i });
    expect(signupLinks.length).toBeGreaterThan(0);
    for (const link of signupLinks) {
      expect(link).toHaveAttribute("href", "/auth/signup");
    }

    const loginLinks = screen.getAllByRole("link", { name: /log in/i });
    expect(loginLinks.length).toBeGreaterThan(0);
    expect(loginLinks[0]).toHaveAttribute("href", "/auth/login");
  });

  it("explains the evidence-first workflow and preserves human decision authority", () => {
    render(<Home />);

    expect(
      screen.getByRole("region", { name: /structure first\. evidence throughout\./i }),
    ).toBeVisible();
    expect(
      screen.getByRole("region", { name: /security & fairness are constraints/i }),
    ).toBeVisible();
    expect(
      screen.getByRole("region", {
        name: /start with the workflow\. add billing when it is ready/i,
      }),
    ).toBeVisible();
    expect(
      screen.getByRole("region", { name: /frequently asked questions/i }),
    ).toBeVisible();
    expect(screen.getByText(/humans make hiring decisions/i)).toBeVisible();
  });
});
