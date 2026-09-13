type RealtimeSessionRouteContext = Readonly<{
  params: Promise<Readonly<{ token: string }>>;
}>;

export async function POST(
  _request: Request,
  _context: RealtimeSessionRouteContext,
): Promise<Response> {
  return Response.json({ status: "unavailable" }, { status: 503 });
}
