import { describe, expect, it } from "vitest";

import { buildEvalTraceMetadata } from "./trace-metadata";

describe("buildEvalTraceMetadata", () => {
  const input = {
    runId: "run-123",
    caseId: "case-1",
    evaluator: { id: "assessment-grounding", version: "1.0.0" },
    model: { provider: "openai", name: "gpt-test", version: "2026-09" },
    promptVersion: "prompt-v2",
    guardrailVersion: "guardrail-v3",
    usage: { latencyMs: 125, inputTokens: 100, outputTokens: 40, costUsd: 0.0025 },
  } as const;

  it("captures bounded provenance and quality-cost metadata", () => {
    expect(buildEvalTraceMetadata(input)).toEqual(input);
  });

  it("rejects missing provenance identities", () => {
    expect(() => buildEvalTraceMetadata({ ...input, runId: "" })).toThrow(/provenance/i);
    expect(() =>
      buildEvalTraceMetadata({ ...input, evaluator: { id: "", version: "1.0.0" } }),
    ).toThrow(/provenance/i);
  });

  it("rejects negative or non-finite latency, token, and cost values", () => {
    expect(() =>
      buildEvalTraceMetadata({ ...input, usage: { ...input.usage, latencyMs: -1 } }),
    ).toThrow(/usage/i);
    expect(() =>
      buildEvalTraceMetadata({ ...input, usage: { ...input.usage, costUsd: Number.NaN } }),
    ).toThrow(/usage/i);
  });

  it("rejects secret-like or direct-PII metadata instead of persisting it", () => {
    expect(() =>
      buildEvalTraceMetadata({ ...input, apiKey: "sk-secret" } as typeof input & { apiKey: string }),
    ).toThrow(/sensitive/i);
    expect(() =>
      buildEvalTraceMetadata({ ...input, candidateEmail: "candidate@example.com" } as typeof input & {
        candidateEmail: string;
      }),
    ).toThrow(/sensitive/i);
  });
});
