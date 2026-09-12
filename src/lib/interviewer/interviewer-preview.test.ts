import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const configId = "33333333-3333-4333-8333-333333333333";

async function interviewerPreviewModule() {
  const modulePath = "./interviewer-preview";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    previewInterviewerConfig: (
      organizationId: string,
      jobId: string,
      configId: string,
    ) => Promise<{
      mode: "preview";
      billable: false;
      persisted: false;
      platformPromptVersion: string;
      guardrailVersion: string;
      snapshot: Record<string, unknown>;
    }>;
  }>;
}

describe("interviewer preview repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads the simulated non-billable composition through the tenant-bound preview RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: {
        mode: "preview",
        billable: false,
        persisted: false,
        platform_prompt_version: "interviewer-runtime-v1",
        guardrail_version: "hiring-guardrails-v1",
        snapshot: {
          job: { id: jobId, title: "Senior Engineer" },
          questions: [{ id: "question-1" }],
          interview_plan: { sections: [{ section: { id: "section-1" } }] },
          interviewer_config: { id: configId, name: "Senior Engineer Interviewer" },
        },
      },
      error: null,
    });
    mockedCreateClient.mockResolvedValue({ rpc } as never);
    const { previewInterviewerConfig } = await interviewerPreviewModule();

    await expect(
      previewInterviewerConfig(organizationId, jobId, configId),
    ).resolves.toEqual({
      mode: "preview",
      billable: false,
      persisted: false,
      platformPromptVersion: "interviewer-runtime-v1",
      guardrailVersion: "hiring-guardrails-v1",
      snapshot: {
        job: { id: jobId, title: "Senior Engineer" },
        questions: [{ id: "question-1" }],
        interview_plan: { sections: [{ section: { id: "section-1" } }] },
        interviewer_config: { id: configId, name: "Senior Engineer Interviewer" },
      },
    });

    expect(rpc).toHaveBeenCalledWith("preview_interviewer_config", {
      p_organization_id: organizationId,
      p_job_id: jobId,
      p_config_id: configId,
    });
  });

  it("fails closed for provider errors or malformed preview payloads", async () => {
    const { previewInterviewerConfig } = await interviewerPreviewModule();
    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "database internals" },
    });
    mockedCreateClient.mockResolvedValue({ rpc } as never);

    await expect(
      previewInterviewerConfig(organizationId, jobId, configId),
    ).rejects.toThrow("Unable to preview interviewer configuration.");

    rpc.mockResolvedValue({ data: { mode: "preview", billable: true }, error: null });
    await expect(
      previewInterviewerConfig(organizationId, jobId, configId),
    ).rejects.toThrow("Unable to preview interviewer configuration.");
  });
});
