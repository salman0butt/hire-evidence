import { getHealthPayload } from "./health";

export function GET(): Response {
  return Response.json(getHealthPayload(), {
    status: 200,
    headers: {
      "cache-control": "no-store",
    },
  });
}
