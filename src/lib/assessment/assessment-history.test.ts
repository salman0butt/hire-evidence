import { describe, expect, it, vi } from "vitest";

import {
  createAssessmentRepository,
  type AssessmentGenerationRow,
} from "./assessment-repository";

const generation1: AssessmentGenerationRow = {
  id: "generation-1",
  organization_id: "org-1",
  attempt_id: "attempt-1",
  generation_number: 1,
  status: "completed",
  assessment: { competencies: [{ competencyId: "typescript", score: 4 }] },
  provenance: { generationId: "generation-1", promptVersion: "prompt-v1" },
  failure_reason: null,
};

const generation2: AssessmentGenerationRow = {
  ...generation1,
  id: "generation-2",
  generation_number: 2,
  status: "pending",
  assessment: null,
  provenance: null,
};

describe("assessment generation history", () => {
  it("lists immutable generations in monotonic order", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [generation2, generation1],
      error: null,
    });
    const repository = createAssessmentRepository({ rpc });

    await expect(repository.listGenerations("org-1", "attempt-1")).resolves.toEqual([
      generation1,
      generation2,
    ]);

    expect(rpc).toHaveBeenCalledWith("list_assessment_generations", {
      p_organization_id: "org-1",
      p_attempt_id: "attempt-1",
    });
  });

  it("creates regeneration as a new append-only generation without overwriting history", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: generation2, error: null });
    const repository = createAssessmentRepository({ rpc });

    await expect(repository.createRegeneration("org-1", "attempt-1")).resolves.toEqual(generation2);

    expect(rpc).toHaveBeenCalledWith("create_assessment_regeneration", {
      p_organization_id: "org-1",
      p_attempt_id: "attempt-1",
    });
  });

  it("fails closed when a concurrent regeneration request cannot create a unique next generation", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: null, error: { message: "conflict" } });
    const repository = createAssessmentRepository({ rpc });

    await expect(repository.createRegeneration("org-1", "attempt-1")).rejects.toThrow(
      "assessment generation unavailable",
    );
  });
});
