import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireUser } from "@/lib/auth/require-user";
import { requireOrganizationMembership } from "@/lib/organization/require-membership";

const previewMocks = vi.hoisted(() => ({
  previewInterviewerConfig: vi.fn(),
}));

vi.mock("@/lib/auth/require-user", () => ({ requireUser: vi.fn() }));
vi.mock("@/lib/interviewer/interviewer-preview", () => ({
  previewInterviewerConfig: previewMocks.previewInterviewerConfig,
}));
vi.mock("@/lib/organization/require-membership", () => ({
  requireOrganizationMembership: vi.fn(),
}));

const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const configId = "33333333-3333-4333-8333-333333333333";
const idleState = { status: "idle" as const, message: null, preview: null };

async function previewActionsModule() {
  const modulePath = "./interviewer-preview-actions";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    previewInterviewerConfigAction: (
      organizationId: string,
      jobId: string,
      configId: string,
      previousState: typeof idleState,
      formData: FormData,
    ) => Promise<{
      status: "idle" | "success" | "error";
      message: string | null;
      preview: null | {
        interviewerName: string;
        jobTitle: string;
        questionCount: number;
        sectionCount: number;
        billable: false;
        persisted: false;
      };
    }>;
  }>;
}

function previewPayload() {
  return {
    mode: "preview" as const,
    billable: false as const,
    persisted: false as const,
    platformPromptVersion: "interviewer-runtime-v1",
    guardrailVersion: "hiring-guardrails-v1",
    snapshot: {
      job: { id: jobId, title: "Senior Engineer" },
      questions: [{ id: "q1" }, { id: "q2" }],
      interview_plan: {
        sections: [{ section: { id: "s1" } }, { section: { id: "s2" } }],
      },
      interviewer_config: { id: configId, name: "Senior Engineer Interviewer" },
    },
  };
}

describe("interviewer preview server action", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(requireUser).mockResolvedValue({ id: "user-1" } as never);
    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "hiring_manager",
    });
    previewMocks.previewInterviewerConfig.mockResolvedValue(previewPayload());
  });

  it("returns a clearly simulated non-billable summary from the route-bound config", async () => {
    const { previewInterviewerConfigAction } = await previewActionsModule();

    await expect(
      previewInterviewerConfigAction(
        organizationId,
        jobId,
        configId,
        idleState,
        new FormData(),
      ),
    ).resolves.toEqual({
      status: "success",
      message: "Preview generated. No candidate interview or billable usage was created.",
      preview: {
        interviewerName: "Senior Engineer Interviewer",
        jobTitle: "Senior Engineer",
        questionCount: 2,
        sectionCount: 2,
        billable: false,
        persisted: false,
      },
    });

    expect(previewMocks.previewInterviewerConfig).toHaveBeenCalledWith(
      organizationId,
      jobId,
      configId,
    );
  });

  it("requires valid route ids and jobs:manage capability", async () => {
    const { previewInterviewerConfigAction } = await previewActionsModule();

    await expect(
      previewInterviewerConfigAction(
        "invalid",
        jobId,
        configId,
        idleState,
        new FormData(),
      ),
    ).resolves.toEqual({
      status: "error",
      message: "Choose a valid organization.",
      preview: null,
    });

    vi.mocked(requireOrganizationMembership).mockResolvedValue({
      organizationId,
      organizationName: "Evidence Co",
      role: "reviewer",
    });
    await expect(
      previewInterviewerConfigAction(
        organizationId,
        jobId,
        configId,
        idleState,
        new FormData(),
      ),
    ).resolves.toEqual({
      status: "error",
      message: "You do not have permission to preview interviewer configuration.",
      preview: null,
    });
    expect(previewMocks.previewInterviewerConfig).not.toHaveBeenCalled();
  });

  it("fails closed without leaking provider internals", async () => {
    const { previewInterviewerConfigAction } = await previewActionsModule();
    previewMocks.previewInterviewerConfig.mockRejectedValue(
      new Error("provider internals"),
    );

    await expect(
      previewInterviewerConfigAction(
        organizationId,
        jobId,
        configId,
        idleState,
        new FormData(),
      ),
    ).resolves.toEqual({
      status: "error",
      message: "We could not generate the interviewer preview. Please try again.",
      preview: null,
    });
  });
});
