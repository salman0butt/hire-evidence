import { beforeEach, describe, expect, it, vi } from "vitest";

import { revalidatePath } from "next/cache";

import { requireUser } from "@/lib/auth/require-user";
import { publishInterviewerConfig } from "@/lib/interviewer/interviewer-configs";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("@/lib/auth/require-user", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/interviewer/interviewer-configs", () => ({
  publishInterviewerConfig: vi.fn(),
}));
vi.mock("@/lib/organization/require-membership", () => ({
  requireOrganizationMembership: vi.fn(),
}));

const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const configId = "44444444-4444-4444-8444-444444444444";
const versionId = "55555555-5555-4555-8555-555555555555";
const idleState = { status: "idle" as const, message: null, versionId: null };

async function publishActionsModule() {
  const modulePath = "./interviewer-publish-actions";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    publishInterviewerConfigAction: (
      organizationId: string,
      jobId: string,
      configId: string,
      previousState: typeof idleState,
      formData: FormData,
    ) => Promise<{
      status: "idle" | "success" | "error";
      message: string | null;
      versionId: string | null;
    }>;
  }>;
}

describe("interviewer publication server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireUser).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "hiring_manager",
    });
    vi.mocked(publishInterviewerConfig).mockResolvedValue(versionId);
  });

  it("publishes only the route-bound organization, job, and configuration", async () => {
    const { publishInterviewerConfigAction } = await publishActionsModule();

    await expect(
      publishInterviewerConfigAction(
        organizationId,
        jobId,
        configId,
        idleState,
        new FormData(),
      ),
    ).resolves.toEqual({
      status: "success",
      message: "Interviewer configuration published.",
      versionId,
    });

    expect(publishInterviewerConfig).toHaveBeenCalledWith(
      organizationId,
      jobId,
      configId,
    );
    expect(revalidatePath).toHaveBeenCalledWith(`/app/o/${organizationId}/jobs/${jobId}`);
  });

  it("requires jobs:manage before publication", async () => {
    const { publishInterviewerConfigAction } = await publishActionsModule();
    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "reviewer",
    });

    await expect(
      publishInterviewerConfigAction(
        organizationId,
        jobId,
        configId,
        idleState,
        new FormData(),
      ),
    ).resolves.toEqual({
      status: "error",
      message: "You do not have permission to publish interviewer configuration.",
      versionId: null,
    });
    expect(publishInterviewerConfig).not.toHaveBeenCalled();
  });

  it("rejects malformed route-bound ids before publication", async () => {
    const { publishInterviewerConfigAction } = await publishActionsModule();

    await expect(
      publishInterviewerConfigAction(
        "not-a-uuid",
        jobId,
        configId,
        idleState,
        new FormData(),
      ),
    ).resolves.toEqual({
      status: "error",
      message: "Choose a valid organization.",
      versionId: null,
    });
    await expect(
      publishInterviewerConfigAction(
        organizationId,
        "not-a-uuid",
        configId,
        idleState,
        new FormData(),
      ),
    ).resolves.toEqual({
      status: "error",
      message: "Choose a valid job.",
      versionId: null,
    });
    await expect(
      publishInterviewerConfigAction(
        organizationId,
        jobId,
        "not-a-uuid",
        idleState,
        new FormData(),
      ),
    ).resolves.toEqual({
      status: "error",
      message: "Choose a valid interviewer configuration.",
      versionId: null,
    });
    expect(publishInterviewerConfig).not.toHaveBeenCalled();
  });

  it("fails closed without leaking persistence internals", async () => {
    const { publishInterviewerConfigAction } = await publishActionsModule();
    vi.mocked(publishInterviewerConfig).mockRejectedValue(new Error("provider internals"));

    await expect(
      publishInterviewerConfigAction(
        organizationId,
        jobId,
        configId,
        idleState,
        new FormData(),
      ),
    ).resolves.toEqual({
      status: "error",
      message: "We could not publish interviewer configuration. Please try again.",
      versionId: null,
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
