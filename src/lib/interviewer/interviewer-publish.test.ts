import { beforeEach, describe, expect, it, vi } from "vitest";

import { createClient } from "@/lib/supabase/server";

vi.mock("@/lib/supabase/server", () => ({ createClient: vi.fn() }));

const mockedCreateClient = vi.mocked(createClient);
const organizationId = "11111111-1111-4111-8111-111111111111";
const jobId = "22222222-2222-4222-8222-222222222222";
const configId = "44444444-4444-4444-8444-444444444444";
const versionId = "55555555-5555-4555-8555-555555555555";

async function interviewerConfigsModule() {
  const modulePath = "./interviewer-configs";
  return import(/* @vite-ignore */ modulePath) as Promise<{
    publishInterviewerConfig: (
      organizationId: string,
      jobId: string,
      configId: string,
    ) => Promise<string>;
  }>;
}

describe("interviewer publication repository", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("publishes a route-scoped configuration through the authoritative RPC and returns its immutable version id", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: versionId, error: null });
    mockedCreateClient.mockResolvedValue({ rpc } as never);
    const { publishInterviewerConfig } = await interviewerConfigsModule();

    await expect(
      publishInterviewerConfig(organizationId, jobId, configId),
    ).resolves.toBe(versionId);

    expect(rpc).toHaveBeenCalledWith("publish_interviewer_config", {
      p_organization_id: organizationId,
      p_job_id: jobId,
      p_config_id: configId,
    });
  });

  it("fails closed without leaking provider internals", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: { message: "database internals" },
    });
    mockedCreateClient.mockResolvedValue({ rpc } as never);
    const { publishInterviewerConfig } = await interviewerConfigsModule();

    await expect(
      publishInterviewerConfig(organizationId, jobId, configId),
    ).rejects.toThrow("Unable to publish interviewer configuration.");
  });
});
