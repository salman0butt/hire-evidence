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

type RealtimeProgressRouteContext = Readonly<{
  params: Promise<Readonly<{ token: string }>>;
}>;

type RealtimeProgressRouteHandler = (
  request: Request,
  context: RealtimeProgressRouteContext,
) => Promise<Response>;

type RealtimeProgressBody = Readonly<{
  attemptId: string;
  eventId: string;
  questionId: string;
}>;

type ProductionRealtimeProgressRouteOptions = Readonly<{
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

function parseBody(value: unknown): RealtimeProgressBody | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;

  const body = value as Record<string, unknown>;
  if (
    !isBoundedIdentifier(body.attemptId) ||
    !isBoundedIdentifier(body.eventId) ||
    !isBoundedIdentifier(body.questionId)
  ) {
    return null;
  }

  return {
    attemptId: body.attemptId,
    eventId: body.eventId,
    questionId: body.questionId,
  };
}

export function createProductionRealtimeProgressRoute(
  options: ProductionRealtimeProgressRouteOptions,
): RealtimeProgressRouteHandler {
  return async (request, context) => {
    let body: RealtimeProgressBody | null = null;
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
      const result = await repository.advanceAttemptProgress({
        rawToken: token,
        attemptId: body.attemptId,
        eventId: body.eventId,
        questionId: body.questionId,
      });

      if (result.status === "conflict") return unavailable(409);
      if (result.status === "completed") {
        return Response.json({ status: "completed" });
      }

      return Response.json({
        status: "active",
        checkpoint: result.checkpoint,
      });
    } catch {
      return unavailable(503);
    }
  };
}

export const POST = createProductionRealtimeProgressRoute({
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
