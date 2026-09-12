import { revalidatePath } from "next/cache";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireUser } from "@/lib/auth/require-user";
import { idleOrganizationActionState } from "@/lib/organization/action-state";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";
import { updateOrganizationSettings } from "@/lib/organization/repository";

import { updateOrganizationSettingsAction } from "./actions";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth/require-user", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/organization/require-membership", () => ({
  requireOrganizationMembership: vi.fn(),
}));
vi.mock("@/lib/organization/repository", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/lib/organization/repository")>();
  return { ...actual, updateOrganizationSettings: vi.fn() };
});

const mockedRevalidatePath = vi.mocked(revalidatePath);
const mockedRequireUser = vi.mocked(requireUser);
const mockedRequireMembership = vi.mocked(requireOrganizationMembership);
const mockedUpdateSettings = vi.mocked(updateOrganizationSettings);

const organizationId = "11111111-1111-4111-8111-111111111111";

function form(values: Record<string, string>) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(values)) formData.set(key, value);
  return formData;
}

describe("organization settings action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedRequireUser.mockResolvedValue({ id: "trusted-user-id" } as never);
    mockedRequireMembership.mockResolvedValue({
      organizationId,
      organizationName: "Acme",
      role: "owner",
    });
    mockedUpdateSettings.mockResolvedValue(undefined);
  });

  it("updates only validated business and candidate support fields in the route-bound organization", async () => {
    const formData = form({
      name: "  Acme Labs  ",
      company_size: "  51-200  ",
      hiring_use_case: "  Structured technical hiring  ",
      candidate_support_email: "  candidates@acme.test  ",
      candidate_support_url: "  https://acme.test/interview-support  ",
      organization_id: "attacker-selected-organization",
      created_by: "attacker-selected-user",
    });

    const result = await updateOrganizationSettingsAction(
      organizationId,
      idleOrganizationActionState,
      formData,
    );

    expect(mockedRequireUser).toHaveBeenCalledWith(`/app/o/${organizationId}/settings`);
    expect(mockedRequireMembership).toHaveBeenCalledWith(organizationId);
    expect(mockedUpdateSettings).toHaveBeenCalledWith({
      organizationId,
      name: "Acme Labs",
      companySize: "51-200",
      hiringUseCase: "Structured technical hiring",
      candidateSupportEmail: "candidates@acme.test",
      candidateSupportUrl: "https://acme.test/interview-support",
    });
    expect(mockedRevalidatePath).toHaveBeenCalledWith(`/app/o/${organizationId}`);
    expect(mockedRevalidatePath).toHaveBeenCalledWith(`/app/o/${organizationId}/settings`);
    expect(result).toEqual({ status: "success", message: "Organization settings updated." });
  });

  it.each(["recruiter", "hiring_manager", "reviewer"] as const)(
    "denies %s before persistence",
    async (role) => {
      mockedRequireMembership.mockResolvedValue({
        organizationId,
        organizationName: "Acme",
        role,
      });

      const result = await updateOrganizationSettingsAction(
        organizationId,
        idleOrganizationActionState,
        form({ name: "Acme", company_size: "", hiring_use_case: "" }),
      );

      expect(result).toEqual({
        status: "error",
        message: "You do not have permission to update organization settings.",
      });
      expect(mockedUpdateSettings).not.toHaveBeenCalled();
      expect(mockedRevalidatePath).not.toHaveBeenCalled();
    },
  );

  it("rejects invalid organization input before persistence", async () => {
    const result = await updateOrganizationSettingsAction(
      organizationId,
      idleOrganizationActionState,
      form({ name: " ", company_size: "", hiring_use_case: "" }),
    );

    expect(result).toEqual({ status: "error", message: "Organization name is required." });
    expect(mockedUpdateSettings).not.toHaveBeenCalled();
    expect(mockedRevalidatePath).not.toHaveBeenCalled();
  });

  it("rejects invalid candidate support email before persistence", async () => {
    const result = await updateOrganizationSettingsAction(
      organizationId,
      idleOrganizationActionState,
      form({
        name: "Acme",
        company_size: "",
        hiring_use_case: "",
        candidate_support_email: "not-an-email",
        candidate_support_url: "",
      }),
    );

    expect(result).toEqual({
      status: "error",
      message: "Candidate support email must be valid.",
    });
    expect(mockedUpdateSettings).not.toHaveBeenCalled();
    expect(mockedRevalidatePath).not.toHaveBeenCalled();
  });

  it("rejects unsafe candidate support URLs before persistence", async () => {
    const result = await updateOrganizationSettingsAction(
      organizationId,
      idleOrganizationActionState,
      form({
        name: "Acme",
        company_size: "",
        hiring_use_case: "",
        candidate_support_email: "candidates@acme.test",
        candidate_support_url: "javascript:alert(1)",
      }),
    );

    expect(result).toEqual({
      status: "error",
      message: "Candidate support URL must use http or https.",
    });
    expect(mockedUpdateSettings).not.toHaveBeenCalled();
    expect(mockedRevalidatePath).not.toHaveBeenCalled();
  });

  it("maps persistence errors to bounded copy", async () => {
    mockedUpdateSettings.mockRejectedValue(new Error("42501 confidential database detail"));

    const result = await updateOrganizationSettingsAction(
      organizationId,
      idleOrganizationActionState,
      form({ name: "Acme", company_size: "", hiring_use_case: "" }),
    );

    expect(result).toEqual({
      status: "error",
      message: "We could not update organization settings. Please try again.",
    });
    expect(mockedRevalidatePath).not.toHaveBeenCalled();
  });
});
