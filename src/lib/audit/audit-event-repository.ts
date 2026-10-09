type AuditRpcResult = Readonly<{ data: unknown; error: unknown }>;

type AuditRpc = (
  name: string,
  params: Readonly<Record<string, unknown>>,
) => Promise<AuditRpcResult>;

export type PersistedAuditEvent = Readonly<{
  id: string;
  organizationId: string;
  actorUserId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  occurredAt: string;
  provenanceId: string;
  metadata: Readonly<Record<string, string>>;
  createdAt: string;
}>;

type AuditEventRow = Readonly<{
  id: string;
  organization_id: string;
  actor_user_id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  occurred_at: string;
  provenance_id: string;
  metadata: Readonly<Record<string, string>>;
  created_at: string;
}>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function parseMetadata(value: unknown): Readonly<Record<string, string>> | null {
  if (!isRecord(value)) return null;
  const entries = Object.entries(value);
  if (entries.some(([key, item]) => key.length === 0 || key.length > 64 || !isNonEmptyString(item) || item.length > 128)) {
    return null;
  }
  return Object.freeze(Object.fromEntries(entries) as Record<string, string>);
}

function parseRow(value: unknown, organizationId: string): PersistedAuditEvent | null {
  if (!isRecord(value)) return null;
  const required = [
    "id",
    "organization_id",
    "actor_user_id",
    "action",
    "resource_type",
    "resource_id",
    "occurred_at",
    "provenance_id",
    "created_at",
  ] as const;
  if (required.some((field) => !isNonEmptyString(value[field]))) return null;
  if (value.organization_id !== organizationId) return null;
  if (!Number.isFinite(Date.parse(value.occurred_at as string)) || !Number.isFinite(Date.parse(value.created_at as string))) return null;
  const metadata = parseMetadata(value.metadata);
  if (!metadata) return null;
  const row = value as unknown as AuditEventRow;
  return Object.freeze({
    id: row.id,
    organizationId: row.organization_id,
    actorUserId: row.actor_user_id,
    action: row.action,
    resourceType: row.resource_type,
    resourceId: row.resource_id,
    occurredAt: row.occurred_at,
    provenanceId: row.provenance_id,
    metadata,
    createdAt: row.created_at,
  });
}

export function createAuditEventRepository(dependencies: Readonly<{ rpc: AuditRpc }>) {
  return Object.freeze({
    async list(input: Readonly<{ organizationId: string; limit: number; offset: number }>): Promise<readonly PersistedAuditEvent[]> {
      if (
        !isNonEmptyString(input.organizationId) ||
        !Number.isInteger(input.limit) ||
        input.limit < 1 ||
        input.limit > 100 ||
        !Number.isInteger(input.offset) ||
        input.offset < 0
      ) {
        throw new Error("invalid audit query");
      }

      const { data, error } = await dependencies.rpc("list_audit_events", {
        p_organization_id: input.organizationId,
        p_limit: input.limit,
        p_offset: input.offset,
      });
      if (error || !Array.isArray(data)) throw new Error("audit events unavailable");

      const events = data.map((item) => parseRow(item, input.organizationId));
      if (events.some((item) => item === null)) throw new Error("audit events unavailable");
      return Object.freeze(events as PersistedAuditEvent[]);
    },
  });
}
