import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ForgotPasswordPage from "./page";

describe("ForgotPasswordPage", () => {
  it("shows a bounded retry message for invalid or expired recovery links", async () => {
    const page = await ForgotPasswordPage({
      searchParams: Promise.resolve({ error: "recovery" }),
    });

    render(page);

    expect(screen.getByRole("alert")).toHaveTextContent(
      "Your password reset link is invalid or expired. Request a new reset link.",
    );
  });
});
