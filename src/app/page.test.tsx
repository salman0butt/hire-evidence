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
    expect(screen.getByRole("link", { name: /create your first interviewer/i })).toHaveAttribute(
      "href",
      "/auth/signup",
    );
    expect(screen.getByRole("link", { name: /log in/i })).toHaveAttribute("href", "/auth/login");
  });

  it("explains the evidence-first workflow and preserves human decision authority", () => {
    render(<Home />);

    expect(screen.getByRole("heading", { name: /how it works/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /security & fairness/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /pricing/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /frequently asked questions/i })).toBeVisible();
    expect(screen.getByText(/humans make hiring decisions/i)).toBeVisible();
  });
});
