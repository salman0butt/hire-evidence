import {
  createTechnicalEventRepository,
  type TechnicalEventCategory,
} from "@/lib/realtime/technical-event-repository";
import { createClient } from "@/lib/supabase/server";

type RpcResult = Readonly<{
  data: unknown;
  error: unknown;
}>;

type Rpc = (
  name: string,
  args: Readonly<Record<string, unknown>>,
) => Promise<RpcResult>;

type RealtimeTechnicalEventRouteContext = Readonly<{
  params: Promise<Readonly<{ token: string }>>;
}>;

type RealtimeTechnicalEventRouteHandler = (
  request: Request,
  context: RealtimeTechnicalEventRouteContext,
) => Promise<Response>;

type RealtimeTechnicalEventBody = Readonly<{
  attemptId: string;
  category: TechnicalEventCategory;
  occurredAt: string;
}>;

type ProductionRealtimeTechnicalEventRouteOptions = Readonly<{
  createSupabaseClient: () => Promise<Readonly<{ rpc: Rpc }>>;
}>;

const unavailable = (status: number) =>
  Response.json({ status: "unavailable" }, { status });

function isBoundedIdentifier(value: unknown): value is string {
  return (
    typeof value === "string" &&
    value.trim().length > 0 &&
    value.length <= 200
  );
}

function isTechnicalEventCategory(value: unknown): value is TechnicalEventCategory {
  return (
    value === "provider_disconnect" ||
    value === "browser_disconnect" ||
    value === "microphone_failure" ||
    value === "reconnect_failure"
  );
}

function parseBody(value: unknown): RealtimeTechnicalEventBody | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const body = value as Record<string, unknown>;
  if (
    !isBoundedIdentifier(body.attemptId) ||
    !isTechnicalEventCategory(body.category) ||
    typeof body.occurredAt !== "string" ||
    Number.isNaN(Date.parse(body.occurredAt))
  ) {
    return null;
  }

  return {
    attemptId: body.attemptId,
    category: body.category,
    occurredAt: body.occurredAt,
  };
}

export function createProductionRealtimeTechnicalEventRoute(
  options: ProductionRealtimeTechnicalEventRouteOptions,
): RealtimeTechnicalEventRouteHandler {
  return async (request, context) => {
    let body: RealtimeTechnicalEventBody | null = null;
    try {
      body = parseBody(await request.json());
    } catch {
      return unavailable(400);
    }

    if (!body) return unavailable(400);

    const { token } = await context.params;
    if (!isBoundedIdentifier(token)) return unavailable(404);

    try {
      const client = await options.createSupabaseClient();
      const repository = createTechnicalEventRepository((name, args) =>
        client.rpc(name, args),
      );
      const result = await repository.recordTechnicalEvent({
        rawToken: token,
        attemptId: body.attemptId,
        category: body.category,
        occurredAt: body.occurredAt,
      });

      if (result.status === "conflict") return unavailable(409);

      return Response.json({
        status: "recorded",
        event: result.event,
      });
    } catch {
      return unavailable(503);
    }
  };
}

export const POST = createProductionRealtimeTechnicalEventRoute({
  createSupabaseClient: async () => {
    const client = await createClient();

    return {
      rpc: async (name, args) => {
        const { data, error } = await client.rpc(name, args);
        return { data, error };
      },
    };
  },
});
