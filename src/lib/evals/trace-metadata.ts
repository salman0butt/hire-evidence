export type EvalTraceMetadataInput = {
  runId: string;
  caseId: string;
  evaluator: { id: string; version: string };
  model: { provider: string; name: string; version: string };
  promptVersion: string;
  guardrailVersion: string;
  usage: {
    latencyMs: number;
    inputTokens: number;
    outputTokens: number;
    costUsd: number;
  };
};

const REQUIRED_PROVENANCE = [
  "runId",
  "caseId",
  "promptVersion",
  "guardrailVersion",
] as const;

const ALLOWED_KEYS = new Set([
  ...REQUIRED_PROVENANCE,
  "evaluator",
  "model",
  "usage",
]);

function requireIdentity(value: string): void {
  if (value.trim().length === 0) {
    throw new Error("Invalid trace provenance identity");
  }
}

export function buildEvalTraceMetadata(input: EvalTraceMetadataInput): EvalTraceMetadataInput {
  const record = input as EvalTraceMetadataInput & Record<string, unknown>;

  for (const key of Object.keys(record)) {
    if (!ALLOWED_KEYS.has(key)) {
      throw new Error("Sensitive metadata is not permitted in eval traces");
    }
  }

  for (const key of REQUIRED_PROVENANCE) requireIdentity(input[key]);
  requireIdentity(input.evaluator.id);
  requireIdentity(input.evaluator.version);
  requireIdentity(input.model.provider);
  requireIdentity(input.model.name);
  requireIdentity(input.model.version);

  const usageValues = [
    input.usage.latencyMs,
    input.usage.inputTokens,
    input.usage.outputTokens,
    input.usage.costUsd,
  ];
  if (usageValues.some((value) => !Number.isFinite(value) || value < 0)) {
    throw new Error("Invalid eval trace usage metadata");
  }

  return input;
}
