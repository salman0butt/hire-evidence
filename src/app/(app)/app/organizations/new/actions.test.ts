import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireUser } from "@/lib/auth/require-user";
import { createOrganization } from "@/lib/organization/repository";

import { createOrganizationAction, idleOrganizationActionState } from "./actions";

vi.mock("@/lib/auth/require-user", () => ({
  requireUser: vi.fn(),
}));

vi.mock("@/lib/organization/repository", () => ({
  createOrganization: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

const mockedRequireUser = vi.mocked(requireUser);
const mockedCreateOrganization = vi.mocked(createOrganization);

function organizationForm(
  name: string,
  companySize = "",
  hiringUseCase = "",
) {
  const formData = new FormData();
  formData.set("name", name);
  formData.set("company_size", companySize);
  formData.set("hiring_use_case", hiringUseCase);
  return formData;
}

describe("createOrganizationAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedRequireUser.mockResolvedValue({ id: "trusted-user-id" } as never);
    mockedCreateOrganization.mockResolvedValue("11111111-1111-4111-8111-111111111111");
  });

  it("rejects invalid input before authentication or persistence", async () => {
    const result = await createOrganizationAction(
      idleOrganizationActionState,
      organizationForm("   "),
    );

    expect(result).toEqual({
      status: "error",
      message: "Organization name is required.",
    });
    expect(mockedRequireUser).not.toHaveBeenCalled();
    expect(mockedCreateOrganization).not.toHaveBeenCalled();
  });

  it("uses trusted authentication and normalized organization fields", async () => {
    const formData = organizationForm(
      "  Acme Hiring  ",
      "  51-200  ",
      "  Structured technical interviews  ",
    );
    formData.set("created_by", "attacker-selected-id");
    formData.set("organization_id", "attacker-selected-org");

    await createOrganizationAction(idleOrganizationActionState, formData);

    expect(mockedRequireUser).toHaveBeenCalledWith("/app/organizations/new");
    expect(mockedCreateOrganization).toHaveBeenCalledWith({
      name: "Acme Hiring",
      companySize: "51-200",
      hiringUseCase: "Structured technical interviews",
    });
  });

  it("maps persistence failures to bounded user-safe copy", async () => {
    mockedCreateOrganization.mockRejectedValue(
      new Error("database internals that must not reach the UI"),
    );

    const result = await createOrganizationAction(
      idleOrganizationActionState,
      organizationForm("Acme Hiring"),
    );

    expect(result).toEqual({
      status: "error",
      message: "We could not create your organization. Please try again.",
    });
  });
});
