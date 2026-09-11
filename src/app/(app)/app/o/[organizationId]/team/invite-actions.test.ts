import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireUser } from "@/lib/auth/require-user";
import { idleInvitationActionState } from "@/lib/organization/invitation-action-state";
import {
  acceptOrganizationInvitation,
  createOrganizationInvitation,
  revokeOrganizationInvitation,
} from "@/lib/organization/invitations";

import {
  acceptInvitationAction,
  createInvitationAction,
  revokeInvitationAction,
} from "./invite-actions";

vi.mock("@/lib/auth/require-user", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/organization/invitations", () => ({
  acceptOrganizationInvitation: vi.fn(),
  createOrganizationInvitation: vi.fn(),
  revokeOrganizationInvitation: vi.fn(),
}));
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

const mockedRequireUser = vi.mocked(requireUser);
const mockedCreateInvitation = vi.mocked(createOrganizationInvitation);
const mockedAcceptInvitation = vi.mocked(acceptOrganizationInvitation);
const mockedRevokeInvitation = vi.mocked(revokeOrganizationInvitation);
const mockedRevalidatePath = vi.mocked(revalidatePath);
const mockedRedirect = vi.mocked(redirect);

const organizationId = "11111111-1111-4111-8111-111111111111";
const invitationId = "22222222-2222-4222-8222-222222222222";
const rawToken = "raw_invitation_token_abcdefghijklmnopqrstuvwxyz0123456789";

function form(values: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) formData.set(key, value);
  return formData;
}

describe("organization invitation actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedRequireUser.mockResolvedValue({ id: "trusted-user-id" } as never);
    mockedCreateInvitation.mockResolvedValue(rawToken);
    mockedAcceptInvitation.mockResolvedValue(organizationId);
    mockedRevokeInvitation.mockResolvedValue(undefined);
  });

  it("creates a normalized non-owner invitation in the route-bound organization and refreshes the team page", async () => {
    const formData = form({ email: "  Candidate.Team@Example.COM  ", role: "reviewer" });
    formData.set("organization_id", "attacker-selected-organization");

    const result = await createInvitationAction(
      organizationId,
      idleInvitationActionState,
      formData,
    );

    expect(mockedRequireUser).toHaveBeenCalledWith(`/app/o/${organizationId}/team`);
    expect(mockedCreateInvitation).toHaveBeenCalledWith({
      organizationId,
      email: "candidate.team@example.com",
      role: "reviewer",
    });
    expect(mockedRevalidatePath).toHaveBeenCalledWith(`/app/o/${organizationId}/team`);
    expect(result).toEqual({
      status: "success",
      message: "Invitation link created.",
      invitationUrl: `/app/invitations/${rawToken}`,
    });
  });

  it("rejects owner invitations before authentication or persistence", async () => {
    const result = await createInvitationAction(
      organizationId,
      idleInvitationActionState,
      form({ email: "person@example.com", role: "owner" }),
    );

    expect(result.status).toBe("error");
    expect(mockedRequireUser).not.toHaveBeenCalled();
    expect(mockedCreateInvitation).not.toHaveBeenCalled();
  });

  it("rejects invalid email before persistence", async () => {
    const result = await createInvitationAction(
      organizationId,
      idleInvitationActionState,
      form({ email: "not-an-email", role: "reviewer" }),
    );

    expect(result.status).toBe("error");
    expect(mockedCreateInvitation).not.toHaveBeenCalled();
  });

  it("maps invitation persistence failures to bounded copy without refreshing", async () => {
    mockedCreateInvitation.mockRejectedValue(new Error("database policy internals"));
    const result = await createInvitationAction(
      organizationId,
      idleInvitationActionState,
      form({ email: "person@example.com", role: "admin" }),
    );

    expect(result).toEqual({
      status: "error",
      message: "We could not create this invitation. Please try again.",
      invitationUrl: null,
    });
    expect(mockedRevalidatePath).not.toHaveBeenCalled();
  });

  it("revokes only the route-bound organization's invitation and refreshes the team page", async () => {
    const formData = form({ invitation_id: invitationId });
    formData.set("organization_id", "attacker-selected-organization");

    const result = await revokeInvitationAction(
      organizationId,
      idleInvitationActionState,
      formData,
    );

    expect(mockedRequireUser).toHaveBeenCalledWith(`/app/o/${organizationId}/team`);
    expect(mockedRevokeInvitation).toHaveBeenCalledWith({
      organizationId,
      invitationId,
    });
    expect(mockedRevalidatePath).toHaveBeenCalledWith(`/app/o/${organizationId}/team`);
    expect(result).toEqual({
      status: "success",
      message: "Invitation revoked.",
      invitationUrl: null,
    });
  });

  it("rejects malformed revoke identifiers before persistence", async () => {
    const result = await revokeInvitationAction(
      organizationId,
      idleInvitationActionState,
      form({ invitation_id: "not-an-id" }),
    );

    expect(result.status).toBe("error");
    expect(mockedRequireUser).not.toHaveBeenCalled();
    expect(mockedRevokeInvitation).not.toHaveBeenCalled();
    expect(mockedRevalidatePath).not.toHaveBeenCalled();
  });

  it("maps revoke authorization failures to bounded copy without refreshing", async () => {
    mockedRevokeInvitation.mockRejectedValue(new Error("42501 policy internals"));

    const result = await revokeInvitationAction(
      organizationId,
      idleInvitationActionState,
      form({ invitation_id: invitationId }),
    );

    expect(result).toEqual({
      status: "error",
      message: "We could not revoke this invitation. Please try again.",
      invitationUrl: null,
    });
    expect(mockedRevalidatePath).not.toHaveBeenCalled();
  });

  it("accepts through the trusted authenticated user and redirects to the tenant", async () => {
    await acceptInvitationAction(rawToken, idleInvitationActionState, new FormData());

    expect(mockedRequireUser).toHaveBeenCalledWith(`/app/invitations/${rawToken}`);
    expect(mockedAcceptInvitation).toHaveBeenCalledWith(rawToken);
    expect(mockedRedirect).toHaveBeenCalledWith(`/app/o/${organizationId}`);
  });

  it("maps invalid, expired, revoked, replayed, or wrong-email acceptance to stable copy", async () => {
    mockedAcceptInvitation.mockRejectedValue(new Error("internal invitation state"));

    const result = await acceptInvitationAction(
      rawToken,
      idleInvitationActionState,
      new FormData(),
    );

    expect(result).toEqual({
      status: "error",
      message: "This invitation is invalid or no longer available.",
      invitationUrl: null,
    });
    expect(mockedRedirect).not.toHaveBeenCalled();
  });
});
