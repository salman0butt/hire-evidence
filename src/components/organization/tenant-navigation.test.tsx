import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TenantNavigation } from "./tenant-navigation";

const organizationId = "11111111-1111-4111-8111-111111111111";

describe("TenantNavigation", () => {
  it("shows tenant identity, role, jobs, team, and owner/admin settings affordances", () => {
    render(
      <TenantNavigation
        organizationId={organizationId}
        organizationName="Acme Hiring"
        role="admin"
      />,
    );

    const navigation = screen.getByRole("navigation", {
      name: /organization navigation/i,
    });
    expect(navigation).toBeVisible();
    expect(screen.getByText("Acme Hiring")).toBeVisible();
    expect(screen.getByText(/admin/i)).toBeVisible();
    expect(screen.getByRole("link", { name: /^overview$/i })).toHaveAttribute(
      "href",
      `/app/o/${organizationId}`,
    );
    expect(screen.getByRole("link", { name: /^jobs$/i })).toHaveAttribute(
      "href",
      `/app/o/${organizationId}/jobs`,
    );
    expect(screen.getByRole("link", { name: /^team$/i })).toHaveAttribute(
      "href",
      `/app/o/${organizationId}/team`,
    );
    expect(screen.getByRole("link", { name: /^settings$/i })).toHaveAttribute(
      "href",
      `/app/o/${organizationId}/settings`,
    );
  });

  it.each(["recruiter", "hiring_manager", "reviewer"] as const)(
    "keeps jobs and team visible but hides settings for %s",
    (role) => {
      render(
        <TenantNavigation
          organizationId={organizationId}
          organizationName="Acme Hiring"
          role={role}
        />,
      );

      expect(screen.getByRole("link", { name: /^jobs$/i })).toHaveAttribute(
        "href",
        `/app/o/${organizationId}/jobs`,
      );
      expect(screen.getByRole("link", { name: /^team$/i })).toBeVisible();
      expect(screen.queryByRole("link", { name: /^settings$/i })).not.toBeInTheDocument();
    },
  );
});
