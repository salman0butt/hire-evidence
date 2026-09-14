import { createRealtimeSessionRepository } from "@/lib/realtime/session-repository";
import { createClient } from "@/lib/supabase/server";

type RpcResult = Readonly<{
  data: unknown;
  error: unknown;
}>;

type Rpc = (
  name: string,
  args: Readonly<Record<string, unknown>>,
) => Promise<RpcResult>;

type RealtimeFinalizeRouteContext = Readonly<{
  params: Promise<Readonly<{ token: string }>>;
}>;

type RealtimeFinalizeRouteHandler = (
  request: Request,
  context: RealtimeFinalizeRouteContext,
) => Promise<Response>;

type RealtimeFinalizeBody = Readonly<{
  attemptId: string;
}>;

type ProductionRealtimeFinalizeRouteOptions = Readonly<{
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

function parseBody(value: unknown): RealtimeFinalizeBody | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const body = value as Record<string, unknown>;
  if (!isBoundedIdentifier(body.attemptId)) return null;

  return { attemptId: body.attemptId };
}

export function createProductionRealtimeFinalizeRoute(
  options: ProductionRealtimeFinalizeRouteOptions,
): RealtimeFinalizeRouteHandler {
  return async (request, context) => {
    let body: RealtimeFinalizeBody | null = null;
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
      const repository = createRealtimeSessionRepository((name, args) =>
        client.rpc(name, args),
      );
      const result = await repository.finalizeAttempt({
        rawToken: token,
        attemptId: body.attemptId,
      });

      if (result.status === "conflict") return unavailable(409);

      return Response.json({
        status: "completed",
        attemptId: result.attemptId,
        completedAt: result.completedAt,
        durationSeconds: result.durationSeconds,
      });
    } catch {
      return unavailable(503);
    }
  };
}

export const POST = createProductionRealtimeFinalizeRoute({
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
