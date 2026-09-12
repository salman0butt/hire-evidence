import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const configId = "33333333-3333-4333-8333-333333333333";
const versionId = "44444444-4444-4444-8444-444444444444";

async function interviewerVersionsModule() {
  const modulePath = "./interviewer-versions";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    publishInterviewerConfig: (
      organizationId: string,
      jobId: string,
      configId: string,
    ) => Promise<string>;
    getInterviewerVersion: (
      organizationId: string,
      jobId: string,
      versionId: string,
    ) => Promise<
      | {
          id: string;
          interviewerConfigId: string;
          versionNumber: number;
          snapshot: Record<string, unknown>;
          platformPromptVersion: string;
          guardrailVersion: string;
          publishedAt: string;
        }
      | null
    >;
  }>;
}

function readClient(result: { data: unknown; error: unknown }) {
  const maybeSingle = vi.fn().mockResolvedValue(result);
  const thirdEq = vi.fn(() => ({ maybeSingle }));
  const secondEq = vi.fn(() => ({ eq: thirdEq }));
  const firstEq = vi.fn(() => ({ eq: secondEq }));
  const select = vi.fn(() => ({ eq: firstEq }));
  const from = vi.fn(() => ({ select }));
  return { from, select, firstEq, secondEq, thirdEq, maybeSingle };
}

describe("immutable interviewer version repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("publishes through the fixed-role atomic RPC and returns the immutable version id", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: versionId, error: null });
    mockedCreateClient.mockResolvedValue({ rpc } as never);
    const { publishInterviewerConfig } = await interviewerVersionsModule();

    await expect(
      publishInterviewerConfig(organizationId, jobId, configId),
    ).resolves.toBe(versionId);

    expect(rpc).toHaveBeenCalledWith("publish_interviewer_config", {
      p_organization_id: organizationId,
      p_job_id: jobId,
      p_config_id: configId,
    });
  });

  it("loads one immutable version only inside the route-bound tenant and job", async () => {
    const snapshot = {
      job: { id: jobId, title: "Senior Engineer" },
      requirements: [],
      competencies: [],
      rubrics: [],
      questions: [],
      interview_plan: {},
      interviewer_config: { id: configId },
    };
    const query = readClient({
      data: {
        id: versionId,
        interviewer_config_id: configId,
        version_number: 1,
        snapshot,
        platform_prompt_version: "interviewer-runtime-v1",
        guardrail_version: "hiring-guardrails-v1",
        published_at: "2026-09-12T03:00:00.000Z",
      },
      error: null,
    });
    mockedCreateClient.mockResolvedValue({ from: query.from } as never);
    const { getInterviewerVersion } = await interviewerVersionsModule();

    await expect(
      getInterviewerVersion(organizationId, jobId, versionId),
    ).resolves.toEqual({
      id: versionId,
      interviewerConfigId: configId,
      versionNumber: 1,
      snapshot,
      platformPromptVersion: "interviewer-runtime-v1",
      guardrailVersion: "hiring-guardrails-v1",
      publishedAt: "2026-09-12T03:00:00.000Z",
    });

    expect(query.from).toHaveBeenCalledWith("interviewer_versions");
    expect(query.firstEq).toHaveBeenCalledWith("organization_id", organizationId);
    expect(query.secondEq).toHaveBeenCalledWith("job_id", jobId);
    expect(query.thirdEq).toHaveBeenCalledWith("id", versionId);
  });

  it("returns null when no tenant/job-bound version exists", async () => {
    const query = readClient({ data: null, error: null });
    mockedCreateClient.mockResolvedValue({ from: query.from } as never);
    const { getInterviewerVersion } = await interviewerVersionsModule();

    await expect(
      getInterviewerVersion(organizationId, jobId, versionId),
    ).resolves.toBeNull();
  });

  it("fails closed without leaking provider internals", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "database internals" },
    });
    mockedCreateClient.mockResolvedValue({ rpc } as never);
    const { publishInterviewerConfig, getInterviewerVersion } =
      await interviewerVersionsModule();

    await expect(
      publishInterviewerConfig(organizationId, jobId, configId),
    ).rejects.toThrow("Unable to publish interviewer configuration.");

    const query = readClient({
      data: null,
      error: { message: "database internals" },
    });
    mockedCreateClient.mockResolvedValue({ from: query.from } as never);
    await expect(
      getInterviewerVersion(organizationId, jobId, versionId),
    ).rejects.toThrow("Unable to load interviewer version.");
  });
});
