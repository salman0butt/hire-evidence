import { describe, expect, it } from "vitest";

import { createAuditEvent } from "./audit-event";

const validEvent = {
  organizationId: "org-123",
  actor: { type: "user", id: "user-456" },
  action: "review.score-overridden",
  resource: { type: "assessment", id: "assessment-789" },
  occurredAt: "2026-09-24T00:00:00.000Z",
  provenance: { requestId: "req-123", source: "server" },
  metadata: { reasonCode: "evidence-review", changedField: "score" },
} as const;

describe("createAuditEvent", () => {
  it("creates an immutable normalized event from bounded enterprise audit metadata", () => {
    const event = createAuditEvent(validEvent);

    expect(event).toEqual(validEvent);
    expect(Object.isFrozen(event)).toBe(true);
    expect(Object.isFrozen(event.actor)).toBe(true);
    expect(Object.isFrozen(event.resource)).toBe(true);
    expect(Object.isFrozen(event.provenance)).toBe(true);
    expect(Object.isFrozen(event.metadata)).toBe(true);
  });

  it("fails closed when required organization, actor, resource, action, time, or provenance identity is missing", () => {
    for (const field of ["organizationId", "actor", "action", "resource", "occurredAt", "provenance"] as const) {
      const invalid = { ...validEvent } as Record<string, unknown>;
      delete invalid[field];
      expect(() => createAuditEvent(invalid)).toThrow(/audit/i);
    }
  });

  it("rejects secret-like and candidate-sensitive free-form metadata", () => {
    expect(() => createAuditEvent({
      ...validEvent,
      metadata: { apiKey: "sk-secret", reasonCode: "review" },
    })).toThrow(/metadata/i);

    expect(() => createAuditEvent({
      ...validEvent,
      metadata: { transcript: "candidate private answer", reasonCode: "review" },
    })).toThrow(/metadata/i);
  });

  it("rejects unsupported top-level fields instead of silently persisting arbitrary payloads", () => {
    expect(() => createAuditEvent({
      ...validEvent,
      rawPayload: { anything: true },
    })).toThrow(/audit/i);
  });
});
