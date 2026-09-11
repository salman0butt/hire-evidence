import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { InvitationActionState } from "@/lib/organization/invitation-action-state";

import { AcceptInvitationForm } from "./accept-invitation-form";

async function action(
  state: InvitationActionState,
): Promise<InvitationActionState> {
  return state;
}

describe("AcceptInvitationForm", () => {
  it("explains that acceptance requires the signed-in invited account", () => {
    render(<AcceptInvitationForm action={action} />);

    expect(screen.getByRole("heading", { name: /join organization/i })).toBeVisible();
    expect(
      screen.getByText(/signed-in account must match the invited email/i),
    ).toBeVisible();
    expect(screen.getByRole("button", { name: /accept invitation/i })).toBeVisible();
  });

  it("announces invalid invitation state as an alert", () => {
    render(
      <AcceptInvitationForm
        action={action}
        initialState={{
          status: "error",
          message: "This invitation is invalid or no longer available.",
          invitationUrl: null,
        }}
      />,
    );

    expect(screen.getByRole("alert")).toHaveTextContent(
      "This invitation is invalid or no longer available.",
    );
  });
});
