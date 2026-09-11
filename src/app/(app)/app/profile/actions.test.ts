import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireUser } from "@/lib/auth/require-user";
import { idleProfileActionState } from "@/lib/profile/action-state";
import { upsertOwnProfile } from "@/lib/profile/repository";

import { updateProfileAction } from "./actions";

vi.mock("@/lib/auth/require-user", () => ({
  requireUser: vi.fn(),
}));

vi.mock("@/lib/profile/repository", () => ({
  upsertOwnProfile: vi.fn(),
}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

const mockedRequireUser = vi.mocked(requireUser);
const mockedUpsertOwnProfile = vi.mocked(upsertOwnProfile);

function profileForm(displayName: string) {
  const formData = new FormData();
  formData.set("display_name", displayName);
  return formData;
}

describe("updateProfileAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedRequireUser.mockResolvedValue({ id: "trusted-user-id" } as never);
    mockedUpsertOwnProfile.mockResolvedValue();
  });

  it("rejects invalid profile input before authentication or persistence", async () => {
    const result = await updateProfileAction(
      idleProfileActionState,
      profileForm("a".repeat(121)),
    );

    expect(result).toEqual({
      status: "error",
      message: "Display name must be 120 characters or fewer.",
    });
    expect(mockedRequireUser).not.toHaveBeenCalled();
    expect(mockedUpsertOwnProfile).not.toHaveBeenCalled();
  });

  it("uses the authenticated user id and ignores forged ownership fields", async () => {
    const formData = profileForm("  Salman Butt  ");
    formData.set("id", "attacker-selected-id");
    formData.set("user_id", "attacker-selected-id");

    const result = await updateProfileAction(idleProfileActionState, formData);

    expect(mockedRequireUser).toHaveBeenCalledWith("/app/profile");
    expect(mockedUpsertOwnProfile).toHaveBeenCalledWith(
      "trusted-user-id",
      "Salman Butt",
    );
    expect(result).toEqual({ status: "saved", message: "Profile saved." });
  });

  it("maps persistence failures to a bounded user-safe error", async () => {
    mockedUpsertOwnProfile.mockRejectedValue(
      new Error("database internals that must not reach the UI"),
    );

    const result = await updateProfileAction(
      idleProfileActionState,
      profileForm("Salman Butt"),
    );

    expect(result).toEqual({
      status: "error",
      message: "We could not save your profile. Please try again.",
    });
  });
});
