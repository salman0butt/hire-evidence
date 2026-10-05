export type OperationalSignal = Readonly<{
  requestId: string;
  correlationId: string;
  service: string;
  status: string;
  latencyMs: number;
  errorCode?: string;
}>;

export function createOperationalSignal(input: unknown): OperationalSignal {
  return Object.freeze(input as OperationalSignal);
}
