import { after } from "next/server";

import { createOperationalSignalRecorder } from "@/lib/observability/operational-signal";
import { createProductionRealtimeSessionHandler } from "@/lib/realtime/production-realtime-session";
import {
  createClient,
  createPlatformClient,
} from "@/lib/supabase/server";

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

type OperationalSignalRecorder = (input: unknown) => Promise<void>;
type OperationalSignalScheduler = (task: () => Promise<void>) => void;

type RealtimeSessionRouteHandler = (
  request: Request,
  context: RealtimeSessionRouteContext,
) => Promise<Response>;

type RealtimeSessionHandlerFactory = (options: Readonly<{
  apiKey: string | undefined;
  rpc: Rpc;
  recordOperationalSignal?: OperationalSignalRecorder;
}>) => RealtimeSessionRouteHandler;

type ProductionRealtimeSessionRouteOptions = Readonly<{
  apiKey: string | undefined;
  createSupabaseClient: () => Promise<Readonly<{ rpc: Rpc }>>;
  createOperationalSupabaseClient?: () => Promise<Readonly<{ rpc: Rpc }>>;
  scheduleOperationalSignal?: OperationalSignalScheduler;
  createHandler?: RealtimeSessionHandlerFactory;
}>;

export function createProductionRealtimeSessionRoute(
  options: ProductionRealtimeSessionRouteOptions,
): RealtimeSessionRouteHandler {
  const createHandler =
    options.createHandler ?? createProductionRealtimeSessionHandler;

  const operationalRecorder = options.createOperationalSupabaseClient
    ? createOperationalSignalRecorder(async (name, args) => {
        const client = await options.createOperationalSupabaseClient!();
        return client.rpc(name, args);
      })
    : undefined;

  const recordOperationalSignal = operationalRecorder
    ? async (input: unknown) => {
        if (!options.scheduleOperationalSignal) {
          await operationalRecorder(input);
          return;
        }

        options.scheduleOperationalSignal(async () => {
          try {
            await operationalRecorder(input);
          } catch {
            // Post-response telemetry is best-effort and cannot affect the
            // candidate-facing request or expose backend details.
          }
        });
      }
    : undefined;

  return createHandler({
    apiKey: options.apiKey,
    rpc: async (name, args) => {
      const client = await options.createSupabaseClient();
      return client.rpc(name, args);
    },
    ...(recordOperationalSignal ? { recordOperationalSignal } : {}),
  });
}

export const POST = createProductionRealtimeSessionRoute({
  apiKey: process.env.GEMINI_API_KEY,
  createSupabaseClient: async () => {
    const client = await createClient();

    return {
      rpc: async (name, args) => {
        const { data, error } = await client.rpc(name, args);
        return { data, error };
      },
    };
  },
  createOperationalSupabaseClient: async () => {
    const client = createPlatformClient();

    return {
      rpc: async (name, args) => {
        const { data, error } = await client.rpc(name, args);
        return { data, error };
      },
    };
  },
  scheduleOperationalSignal: (task) => {
    after(task);
  },
});
