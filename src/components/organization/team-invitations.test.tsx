import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { InvitationActionState } from "@/lib/organization/invitation-action-state";

import { TeamInvitations } from "./team-invitations";

async function action(
  state: InvitationActionState,
): Promise<InvitationActionState> {
  return state;
}

describe("TeamInvitations", () => {
  it("renders pending invitations and a bounded revoke control", () => {
    render(
      <TeamInvitations
        invitations={[
          {
            id: "22222222-2222-4222-8222-222222222222",
            email: "person@example.com",
            role: "reviewer",
            expiresAt: "2026-09-18T12:00:00.000Z",
          },
        ]}
        revokeAction={action}
      />,
    );

    expect(screen.getByRole("heading", { name: /pending invitations/i })).toBeVisible();
    expect(screen.getByText("person@example.com")).toBeVisible();
    expect(screen.getByText(/^Reviewer$/i)).toBeVisible();
    expect(screen.getByRole("button", { name: /revoke invitation for person@example.com/i })).toBeVisible();
  });

  it("renders an explicit empty state", () => {
    render(<TeamInvitations invitations={[]} revokeAction={action} />);
    expect(screen.getByText(/no pending invitations/i)).toBeVisible();
  });
});
