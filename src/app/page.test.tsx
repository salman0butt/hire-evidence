import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import Home from "./page";

describe("Home", () => {
  it("states the product identity and human hiring-decision boundary", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1, name: "Hire Evidence" })).toBeVisible();
    expect(screen.getByText(/humans make hiring decisions/i)).toBeVisible();
  });
});
