import { createGeminiProviderTokenAdapter } from "./gemini-provider-token";
import { createProviderTokenIssuer } from "./provider-token";
import { createRealtimeSessionHandler } from "./realtime-session-handler";
import { createRealtimeSessionRepository } from "./session-repository";
import { authorizeRealtimeSession } from "./session-authorization";
import { createTranscriptRepository } from "./transcript-repository";

type RpcResult = Readonly<{
  data: unknown;
  error: unknown;
}>;

type Rpc = (
  name: string,
  args: Readonly<Record<string, unknown>>,
) => Promise<RpcResult>;

type ProductionRealtimeSessionOptions = Readonly<{
  apiKey: string | undefined;
  rpc: Rpc;
  fetchImpl?: typeof fetch;
  now?: () => Date;
}>;

type RealtimeSessionRouteContext = Readonly<{
  params: Promise<Readonly<{ token: string }>>;
}>;

export function createProductionRealtimeSessionHandler(
  options: ProductionRealtimeSessionOptions,
): (request: Request, context: RealtimeSessionRouteContext) => Promise<Response> {
  const apiKey = options.apiKey?.trim();

  if (!apiKey) {
    return async () =>
      Response.json({ status: "unavailable" }, { status: 503 });
  }

  const repository = createRealtimeSessionRepository(options.rpc);
  const transcriptRepository = createTranscriptRepository(options.rpc);
  const issueProviderCredential = createProviderTokenIssuer(
    createGeminiProviderTokenAdapter({
      apiKey,
      ...(options.fetchImpl ? { fetchImpl: options.fetchImpl } : {}),
      ...(options.now ? { now: options.now } : {}),
    }),
    options.now ? { now: options.now } : {},
  );

  return createRealtimeSessionHandler((rawToken) =>
    authorizeRealtimeSession(rawToken, {
      resolveCandidateSession: repository.resolveCandidateSession,
      getOrCreateAttempt: repository.getOrCreateAttempt,
      listFinalizedTurns: transcriptRepository.listFinalizedTurns,
      issueProviderCredential,
    }),
  );
}
