import { describe, expect, it, vi } from "vitest";

import {
  createAssessmentRepository,
  type AssessmentGenerationRow,
} from "./assessment-repository";

const completed: AssessmentGenerationRow = {
  id: "generation-1",
  organization_id: "org-1",
  attempt_id: "attempt-1",
  generation_number: 1,
  status: "completed",
  assessment: { competencies: [] },
  provenance: { generationId: "generation-1" },
  failure_reason: null,
};

describe("assessment repository", () => {
  it("uses only tenant-scoped assessment RPC boundaries", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: completed, error: null });
    const repository = createAssessmentRepository({ rpc });

    await expect(repository.getGeneration("org-1", "attempt-1", 1)).resolves.toEqual(completed);

    expect(rpc).toHaveBeenCalledWith("get_assessment_generation", {
      p_organization_id: "org-1",
      p_attempt_id: "attempt-1",
      p_generation_number: 1,
    });
  });

  it("fails closed on RPC errors instead of returning ambiguous state", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: "denied" } });
    const repository = createAssessmentRepository({ rpc });

    await expect(repository.claimGeneration("org-1", "attempt-1", 1)).rejects.toThrow(
      "assessment generation unavailable",
    );
  });

  it("requires validated completion before crossing the persistence boundary", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: completed, error: null });
    const repository = createAssessmentRepository({ rpc });

    await expect(
      repository.completeGeneration({
        organizationId: "org-1",
        attemptId: "attempt-1",
        generationNumber: 1,
        assessment: { competencies: [] },
        provenance: { generationId: "generation-1" },
        validated: false,
      }),
    ).rejects.toThrow("validated assessment required");

    expect(rpc).not.toHaveBeenCalled();
  });
});
