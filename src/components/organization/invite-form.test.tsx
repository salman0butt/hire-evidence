import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { InvitationActionState } from "@/lib/organization/invitation-action-state";

import { InviteForm } from "./invite-form";

async function action(
  state: InvitationActionState,
): Promise<InvitationActionState> {
  return state;
}

describe("InviteForm", () => {
  it("renders accessible bounded invitation fields without an owner option", () => {
    render(<InviteForm action={action} />);

    expect(screen.getByRole("heading", { name: /invite teammate/i })).toBeVisible();
    expect(screen.getByLabelText(/^email$/i)).toHaveAttribute("name", "email");
    expect(screen.getByLabelText(/^email$/i)).toHaveAttribute("type", "email");
    expect(screen.getByLabelText(/^role$/i)).toHaveAttribute("name", "role");
    expect(screen.getByRole("option", { name: /^admin$/i })).toBeVisible();
    expect(screen.getByRole("option", { name: /^reviewer$/i })).toBeVisible();
    expect(screen.queryByRole("option", { name: /^owner$/i })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /create invitation link/i })).toBeVisible();
  });

  it("announces an invitation link once returned by the action", () => {
    render(
      <InviteForm
        action={action}
        initialState={{
          status: "success",
          message: "Invitation link created.",
          invitationUrl: "/app/invitations/example-token",
        }}
      />,
    );

    expect(screen.getByRole("status")).toHaveTextContent("Invitation link created.");
    expect(screen.getByRole("link", { name: /open invitation link/i })).toHaveAttribute(
      "href",
      "/app/invitations/example-token",
    );
  });
});
