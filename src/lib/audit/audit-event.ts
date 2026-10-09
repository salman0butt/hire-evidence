export type AuditActor = Readonly<{ type: string; id: string }>;
export type AuditResource = Readonly<{ type: string; id: string }>;
export type AuditProvenance = Readonly<{ requestId: string; source: string }>;
export type AuditMetadata = Readonly<Record<string, string>>;

export type AuditEvent = Readonly<{
  organizationId: string;
  actor: AuditActor;
  action: string;
  resource: AuditResource;
  occurredAt: string;
  provenance: AuditProvenance;
  metadata: AuditMetadata;
}>;

const TOP_LEVEL_FIELDS = new Set([
  "organizationId",
  "actor",
  "action",
  "resource",
  "occurredAt",
  "provenance",
  "metadata",
]);

const ALLOWED_METADATA_FIELDS = new Set(["reasonCode", "changedField"]);

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`Invalid audit ${label}`);
  }
  return value;
}

function exactObject(value: unknown, label: string, fields: readonly string[]): Record<string, unknown> {
  if (!isRecord(value) || Object.keys(value).some((key) => !fields.includes(key))) {
    throw new Error(`Invalid audit ${label}`);
  }
  return value;
}

function parseMetadata(value: unknown): AuditMetadata {
  if (!isRecord(value)) throw new Error("Invalid audit metadata");

  const metadata: Record<string, string> = {};
  for (const [key, rawValue] of Object.entries(value)) {
    if (!ALLOWED_METADATA_FIELDS.has(key) || typeof rawValue !== "string" || rawValue.length === 0 || rawValue.length > 128) {
      throw new Error("Invalid audit metadata");
    }
    metadata[key] = rawValue;
  }
  return Object.freeze(metadata);
}

export function createAuditEvent(input: unknown): AuditEvent {
  if (!isRecord(input) || Object.keys(input).some((key) => !TOP_LEVEL_FIELDS.has(key))) {
    throw new Error("Invalid audit event");
  }

  const actor = exactObject(input.actor, "actor", ["type", "id"]);
  const resource = exactObject(input.resource, "resource", ["type", "id"]);
  const provenance = exactObject(input.provenance, "provenance", ["requestId", "source"]);
  const occurredAt = requiredString(input.occurredAt, "occurredAt");
  if (!Number.isFinite(Date.parse(occurredAt))) throw new Error("Invalid audit occurredAt");

  return Object.freeze({
    organizationId: requiredString(input.organizationId, "organizationId"),
    actor: Object.freeze({
      type: requiredString(actor.type, "actor.type"),
      id: requiredString(actor.id, "actor.id"),
    }),
    action: requiredString(input.action, "action"),
    resource: Object.freeze({
      type: requiredString(resource.type, "resource.type"),
      id: requiredString(resource.id, "resource.id"),
    }),
    occurredAt,
    provenance: Object.freeze({
      requestId: requiredString(provenance.requestId, "provenance.requestId"),
      source: requiredString(provenance.source, "provenance.source"),
    }),
    metadata: parseMetadata(input.metadata),
  });
}
