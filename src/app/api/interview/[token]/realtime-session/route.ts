import { createProductionRealtimeSessionHandler } from "@/lib/realtime/production-realtime-session";
import { createClient } from "@/lib/supabase/server";

type RealtimeSessionRouteContext = Readonly<{
  params: Promise<Readonly<{ token: string }>>;
}>;

type RpcResult = Readonly<{
  data: unknown;
  error: unknown;
}>;

type Rpc = (
  name: string,
  args: Readonly<Record<string, unknown>>,
) => Promise<RpcResult>;

type RealtimeSessionRouteHandler = (
  request: Request,
  context: RealtimeSessionRouteContext,
) => Promise<Response>;

type RealtimeSessionHandlerFactory = (options: Readonly<{
  apiKey: string | undefined;
  rpc: Rpc;
}>) => RealtimeSessionRouteHandler;

type ProductionRealtimeSessionRouteOptions = Readonly<{
  apiKey: string | undefined;
  createSupabaseClient: () => Promise<Readonly<{ rpc: Rpc }>>;
  createHandler?: RealtimeSessionHandlerFactory;
}>;

export function createProductionRealtimeSessionRoute(
  options: ProductionRealtimeSessionRouteOptions,
): RealtimeSessionRouteHandler {
  const createHandler =
    options.createHandler ?? createProductionRealtimeSessionHandler;

  return createHandler({
    apiKey: options.apiKey,
    rpc: async (name, args) => {
      const client = await options.createSupabaseClient();
      return client.rpc(name, args);
    },
  });
}

export const POST = createProductionRealtimeSessionRoute({
  apiKey: process.env.GEMINI_API_KEY,
  createSupabaseClient: async () => {
    const client = await createClient();

    return {
      rpc: (name, args) => client.rpc(name, args),
    };
  },
});
