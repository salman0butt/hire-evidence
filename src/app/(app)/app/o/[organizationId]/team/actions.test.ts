import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireUser } from "@/lib/auth/require-user";
import { idleOrganizationActionState } from "@/lib/organization/action-state";
import {
  removeOrganizationMember,
  updateOrganizationMemberRole,
} from "@/lib/organization/members";

import { removeMemberAction, updateMemberRoleAction } from "./actions";

vi.mock("@/lib/auth/require-user", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/organization/members", () => ({
  removeOrganizationMember: vi.fn(),
  updateOrganizationMemberRole: vi.fn(),
}));

const mockedRequireUser = vi.mocked(requireUser);
const mockedRemoveMember = vi.mocked(removeOrganizationMember);
const mockedUpdateRole = vi.mocked(updateOrganizationMemberRole);

const organizationId = "11111111-1111-4111-8111-111111111111";
const memberId = "22222222-2222-4222-8222-222222222222";

function form(values: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) formData.set(key, value);
  return formData;
}

describe("team membership actions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedRequireUser.mockResolvedValue({ id: "trusted-user-id" } as never);
    mockedUpdateRole.mockResolvedValue(undefined);
    mockedRemoveMember.mockResolvedValue(undefined);
  });

  it("updates only a bounded non-owner role inside the route-bound organization", async () => {
    const formData = form({ user_id: memberId, role: "recruiter" });
    formData.set("organization_id", "attacker-selected-organization");

    const result = await updateMemberRoleAction(
      organizationId,
      idleOrganizationActionState,
      formData,
    );

    expect(mockedRequireUser).toHaveBeenCalledWith(`/app/o/${organizationId}/team`);
    expect(mockedUpdateRole).toHaveBeenCalledWith({
      organizationId,
      userId: memberId,
      role: "recruiter",
    });
    expect(result).toEqual({ status: "idle", message: null });
  });

  it("rejects owner assignment before persistence", async () => {
    const result = await updateMemberRoleAction(
      organizationId,
      idleOrganizationActionState,
      form({ user_id: memberId, role: "owner" }),
    );

    expect(result).toEqual({
      status: "error",
      message: "Choose a valid team role.",
    });
    expect(mockedRequireUser).not.toHaveBeenCalled();
    expect(mockedUpdateRole).not.toHaveBeenCalled();
  });

  it("rejects malformed target identifiers before persistence", async () => {
    const result = await removeMemberAction(
      organizationId,
      idleOrganizationActionState,
      form({ user_id: "not-a-user-id" }),
    );

    expect(result.status).toBe("error");
    expect(mockedRemoveMember).not.toHaveBeenCalled();
  });

  it("removes a member only from the route-bound organization", async () => {
    const formData = form({ user_id: memberId });
    formData.set("organization_id", "attacker-selected-organization");

    const result = await removeMemberAction(
      organizationId,
      idleOrganizationActionState,
      formData,
    );

    expect(mockedRemoveMember).toHaveBeenCalledWith({ organizationId, userId: memberId });
    expect(result).toEqual({ status: "idle", message: null });
  });

  it("maps database authorization failures to bounded copy", async () => {
    mockedUpdateRole.mockRejectedValue(new Error("42501 internal details"));

    const result = await updateMemberRoleAction(
      organizationId,
      idleOrganizationActionState,
      form({ user_id: memberId, role: "admin" }),
    );

    expect(result).toEqual({
      status: "error",
      message: "We could not update this team member. Please try again.",
    });
  });
});
