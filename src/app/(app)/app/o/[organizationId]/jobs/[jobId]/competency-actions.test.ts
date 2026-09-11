import { beforeEach, describe, expect, it, vi } from "vitest";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { createCompetency } from "@/lib/interviewer/competencies";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

import * as competencyActions from "./competency-actions";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth/require-user", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/organization/require-membership", () => ({
  requireOrganizationMembership: vi.fn(),
}));
vi.mock("@/lib/interviewer/competencies", () => ({ createCompetency: vi.fn() }));

const { createCompetencyAction } = competencyActions;

const organizationId = "11111111-1111-4111-8111-111111111111";
const attackerOrganizationId = "99999999-9999-4999-8999-999999999999";
const jobId = "22222222-2222-4222-8222-222222222222";
const attackerJobId = "88888888-8888-4888-8888-888888888888";
const competencyId = "33333333-3333-4333-8333-333333333333";
const idleState = { status: "idle" as const, message: null };

function formData() {
  const data = new FormData();
  data.set("organization_id", attackerOrganizationId);
  data.set("job_id", attackerJobId);
  data.set("name", "  Systems design  ");
  data.set("description", "  Designs reliable job-relevant systems.  ");
  data.set("weight", "40");
  data.set("position", "2");
  return data;
}

describe("competency server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireUser).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "hiring_manager",
    });
  });

  it("creates only against route-bound organization and job ids", async () => {
    vi.mocked(createCompetency).mockResolvedValue(competencyId);

    await expect(
      createCompetencyAction(organizationId, jobId, idleState, formData()),
    ).resolves.toEqual({ status: "success", message: "Competency added." });

    expect(createCompetency).toHaveBeenCalledWith(organizationId, jobId, {
      name: "Systems design",
      description: "Designs reliable job-relevant systems.",
      weight: 40,
      position: 2,
    });
    expect(createCompetency).not.toHaveBeenCalledWith(
      attackerOrganizationId,
      attackerJobId,
      expect.anything(),
    );
    expect(revalidatePath).toHaveBeenCalledWith(
      `/app/o/${organizationId}/jobs/${jobId}`,
    );
  });

  it("requires jobs:manage before persistence", async () => {
    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "reviewer",
    });

    await expect(
      createCompetencyAction(organizationId, jobId, idleState, formData()),
    ).resolves.toEqual({
      status: "error",
      message: "You do not have permission to manage competencies.",
    });
    expect(createCompetency).not.toHaveBeenCalled();
  });

  it("returns validation errors before persistence", async () => {
    const data = formData();
    data.set("weight", "0");

    await expect(
      createCompetencyAction(organizationId, jobId, idleState, data),
    ).resolves.toEqual({
      status: "error",
      message: "Competency weight must be greater than 0 and at most 100.",
    });
    expect(createCompetency).not.toHaveBeenCalled();
  });

  it("rejects malformed route ids before auth or persistence", async () => {
    await expect(
      createCompetencyAction("not-a-uuid", jobId, idleState, formData()),
    ).resolves.toEqual({
      status: "error",
      message: "Choose a valid organization.",
    });
    await expect(
      createCompetencyAction(organizationId, "not-a-uuid", idleState, formData()),
    ).resolves.toEqual({ status: "error", message: "Choose a valid job." });

    expect(requireUser).not.toHaveBeenCalled();
    expect(createCompetency).not.toHaveBeenCalled();
  });

  it("fails closed with a generic persistence error", async () => {
    vi.mocked(createCompetency).mockRejectedValue(new Error("provider internals"));

    await expect(
      createCompetencyAction(organizationId, jobId, idleState, formData()),
    ).resolves.toEqual({
      status: "error",
      message: "We could not add the competency. Please try again.",
    });
  });

  it("exposes a dedicated route-bound rubric save action", () => {
    expect(
      (competencyActions as Record<string, unknown>).saveCompetencyRubricAction,
    ).toBeTypeOf("function");
  });
});
