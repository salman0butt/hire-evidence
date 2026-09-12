import type { RealtimeSessionAuthorization } from "./session-authorization";

type RealtimeSessionAuthorizer = (
  rawToken: string,
) => Promise<RealtimeSessionAuthorization>;

type RealtimeSessionRouteContext = Readonly<{
  params: Promise<Readonly<{ token: string }>>;
}>;

export function createRealtimeSessionHandler(
  authorize: RealtimeSessionAuthorizer,
) {
  return async function handleRealtimeSession(
    _request: Request,
    context: RealtimeSessionRouteContext,
  ): Promise<Response> {
    const { token } = await context.params;

    try {
      const authorization = await authorize(token);
      if (authorization.status !== "authorized") {
        return Response.json({ status: "unavailable" }, { status: 404 });
      }

      return Response.json({
        status: "authorized",
        attemptId: authorization.attemptId,
        durationSeconds: authorization.durationSeconds,
        language: authorization.language,
        providerCredential: authorization.providerCredential,
      });
    } catch {
      return Response.json({ status: "unavailable" }, { status: 503 });
    }
  };
}
