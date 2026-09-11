import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { listPendingOrganizationInvitations } from "@/lib/organization/invitations";
import { listOrganizationMembers } from "@/lib/organization/members";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import TeamPage from "./page";

vi.mock("@/components/organization/invite-form", () => ({
  InviteForm: () => <div>Invite form</div>,
}));
vi.mock("@/components/organization/team-members", () => ({
  TeamMembers: () => <div>Team members</div>,
}));
vi.mock("@/components/organization/team-invitations", () => ({
  TeamInvitations: ({
    invitations,
  }: {
    invitations: readonly { email: string }[];
  }) => (
    <div>
      Pending invitations: {invitations.map((invitation) => invitation.email).join(", ")}
    </div>
  ),
}));
vi.mock("@/lib/organization/invitations", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/organization/invitations")>();
  return {
    ...actual,
    listPendingOrganizationInvitations: vi.fn(),
  };
});
vi.mock("@/lib/organization/members", () => ({ listOrganizationMembers: vi.fn() }));
vi.mock("@/lib/organization/require-membership", () => ({
  requireOrganizationMembership: vi.fn(),
}));
vi.mock("./actions", () => ({
  removeMemberAction: vi.fn(),
  updateMemberRoleAction: vi.fn(),
}));
vi.mock("./invite-actions", () => ({
  createInvitationAction: vi.fn(),
  revokeInvitationAction: vi.fn(),
}));

const mockedListInvitations = vi.mocked(listPendingOrganizationInvitations);
const mockedListMembers = vi.mocked(listOrganizationMembers);
const mockedRequireMembership = vi.mocked(requireOrganizationMembership);

const organizationId = "11111111-1111-4111-8111-111111111111";

async function renderPage() {
  render(
    await TeamPage({
      params: Promise.resolve({ organizationId }),
    }),
  );
}

describe("organization team page invitation management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedListMembers.mockResolvedValue([]);
    mockedListInvitations.mockResolvedValue([]);
  });

  it("loads and renders pending invitations for a role that can invite", async () => {
    mockedRequireMembership.mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "owner",
    });
    mockedListInvitations.mockResolvedValue([
      {
        id: "22222222-2222-4222-8222-222222222222",
        email: "person@example.com",
        role: "reviewer",
        expiresAt: "2026-09-18T12:00:00.000Z",
      },
    ]);

    await renderPage();

    expect(mockedListInvitations).toHaveBeenCalledWith(organizationId);
    expect(screen.getByText("Invite form")).toBeInTheDocument();
    expect(screen.getByText(/person@example\.com/)).toBeInTheDocument();
  });

  it("does not query or render invitation management for a role without invite capability", async () => {
    mockedRequireMembership.mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "reviewer",
    });

    await renderPage();

    expect(mockedListInvitations).not.toHaveBeenCalled();
    expect(screen.queryByText("Invite form")).not.toBeInTheDocument();
    expect(screen.queryByText(/Pending invitations:/)).not.toBeInTheDocument();
  });
});
