import { describe, expect, it, vi } from "vitest";

import { createAuditEventRepository } from "./audit-event-repository";

const row = {
  id: "audit-1",
  organization_id: "org-1",
  actor_user_id: "user-1",
  action: "candidate.reviewed",
  resource_type: "candidate",
  resource_id: "candidate-1",
  occurred_at: "2026-09-24T00:00:00.000Z",
  provenance_id: "review-1",
  metadata: { outcome: "completed" },
  created_at: "2026-09-24T00:00:00.000Z",
};

describe("audit event repository", () => {
  it("uses an organization-scoped bounded RPC and maps safe rows", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: [row], error: null });
    const repository = createAuditEventRepository({ rpc });

    const result = await repository.list({ organizationId: "org-1", limit: 25, offset: 0 });

    expect(rpc).toHaveBeenCalledWith("list_audit_events", {
      p_organization_id: "org-1",
      p_limit: 25,
      p_offset: 0,
    });
    expect(result).toEqual([
      {
        id: "audit-1",
        organizationId: "org-1",
        actorUserId: "user-1",
        action: "candidate.reviewed",
        resourceType: "candidate",
        resourceId: "candidate-1",
        occurredAt: "2026-09-24T00:00:00.000Z",
        provenanceId: "review-1",
        metadata: { outcome: "completed" },
        createdAt: "2026-09-24T00:00:00.000Z",
      },
    ]);
  });

  it("rejects unbounded or invalid pagination before querying", async () => {
    const rpc = vi.fn();
    const repository = createAuditEventRepository({ rpc });

    await expect(repository.list({ organizationId: "org-1", limit: 101, offset: 0 })).rejects.toThrow(
      "invalid audit query",
    );
    await expect(repository.list({ organizationId: "org-1", limit: 25, offset: -1 })).rejects.toThrow(
      "invalid audit query",
    );
    expect(rpc).not.toHaveBeenCalled();
  });

  it("fails closed when persistence returns cross-tenant or malformed data", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: [{ ...row, organization_id: "org-2" }], error: null });
    const repository = createAuditEventRepository({ rpc });

    await expect(repository.list({ organizationId: "org-1", limit: 25, offset: 0 })).rejects.toThrow(
      "audit events unavailable",
    );
  });
});
