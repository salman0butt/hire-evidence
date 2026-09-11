import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AppNavigation } from "./app-navigation";

describe("AppNavigation", () => {
  it("renders product identity, trusted user identity, profile navigation, and logout", () => {
    render(<AppNavigation userEmail="person@example.com" />);

    expect(screen.getByText("Hire Evidence")).toBeVisible();
    expect(screen.getByText("person@example.com")).toBeVisible();
    expect(screen.getByRole("link", { name: /profile/i })).toHaveAttribute(
      "href",
      "/app/profile",
    );
    expect(screen.getByRole("button", { name: /log out/i })).toBeVisible();
  });
});
