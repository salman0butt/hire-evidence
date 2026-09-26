import { describe, expect, it } from "vitest";

import {
  beginCandidateDeletion,
  completeCandidateDeletion,
  recordDeletionFailure,
} from "./candidate-deletion";

describe("candidate deletion lifecycle", () => {
  it("requires explicit tenant and candidate identity and starts pending", () => {
    const request = beginCandidateDeletion({
      organizationId: "org-1",
      candidateId: "candidate-1",
      requestedBy: "user-1",
      requestedAt: "2026-09-24T14:30:00.000Z",
    });

    expect(request).toMatchObject({
      organizationId: "org-1",
      candidateId: "candidate-1",
      requestedBy: "user-1",
      status: "pending",
    });
    expect(Object.isFrozen(request)).toBe(true);
  });

  it("completes idempotently with only non-sensitive deletion counts", () => {
    const pending = beginCandidateDeletion({
      organizationId: "org-1",
      candidateId: "candidate-1",
      requestedBy: "user-1",
      requestedAt: "2026-09-24T14:30:00.000Z",
    });

    const completed = completeCandidateDeletion(pending, {
      completedAt: "2026-09-24T14:31:00.000Z",
      deleted: {
        transcripts: 2,
        assessments: 1,
        evidence: 4,
        audio: 0,
        aiTraces: 3,
      },
    });

    expect(completed.status).toBe("completed");
    expect(completed.deleted).toEqual({
      transcripts: 2,
      assessments: 1,
      evidence: 4,
      audio: 0,
      aiTraces: 3,
    });
    expect(completeCandidateDeletion(completed, {
      completedAt: "2026-09-24T14:32:00.000Z",
      deleted: completed.deleted,
    })).toBe(completed);
  });

  it("records a bounded non-sensitive failure code without claiming completion", () => {
    const pending = beginCandidateDeletion({
      organizationId: "org-1",
      candidateId: "candidate-1",
      requestedBy: "user-1",
      requestedAt: "2026-09-24T14:30:00.000Z",
    });

    const failed = recordDeletionFailure(pending, {
      failedAt: "2026-09-24T14:31:00.000Z",
      code: "artifact_delete_failed",
    });

    expect(failed).toMatchObject({
      status: "failed",
      code: "artifact_delete_failed",
    });
    expect(failed).not.toHaveProperty("deleted");
  });
});
