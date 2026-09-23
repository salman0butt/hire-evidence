import { describe, expect, it } from "vitest";

import { defineEvalSuite, runEvalSuite, type EvalEvaluator } from "./harness";

const evaluator: EvalEvaluator<{ value: number }> = {
  id: "numeric-check",
  version: "1",
  async evaluate(evalCase) {
    if (evalCase.input.value === 2) {
      throw new Error("isolated evaluator failure");
    }

    return {
      passed: evalCase.input.value > 0,
      metrics: { positive: evalCase.input.value > 0 ? 1 : 0 },
      evidence: ["deterministic numeric fixture"],
    };
  },
};

describe("AI eval harness", () => {
  it("rejects duplicate case ids so result provenance stays unambiguous", () => {
    expect(() =>
      defineEvalSuite({
        id: "suite-1",
        version: "1",
        cases: [
          { id: "same", version: "1", category: "assessment", input: { value: 1 } },
          { id: "same", version: "1", category: "assessment", input: { value: -1 } },
        ],
      }),
    ).toThrow("Duplicate eval case id: same");
  });

  it("runs cases in suite order, isolates evaluator failures, and aggregates results", async () => {
    const suite = defineEvalSuite({
      id: "suite-1",
      version: "1",
      cases: [
        { id: "pass", version: "1", category: "assessment", input: { value: 1 } },
        { id: "error", version: "1", category: "guardrail", input: { value: 2 } },
        { id: "fail", version: "1", category: "fairness", input: { value: 0 } },
      ],
    });

    const run = await runEvalSuite(suite, evaluator);

    expect(run.suiteId).toBe("suite-1");
    expect(run.suiteVersion).toBe("1");
    expect(run.evaluator).toEqual({ id: "numeric-check", version: "1" });
    expect(run.results.map((result) => result.caseId)).toEqual(["pass", "error", "fail"]);
    expect(run.results[0]).toMatchObject({ status: "completed", passed: true });
    expect(run.results[1]).toMatchObject({
      status: "error",
      passed: false,
      error: "isolated evaluator failure",
    });
    expect(run.results[2]).toMatchObject({ status: "completed", passed: false });
    expect(run.summary).toEqual({ total: 3, passed: 1, failed: 1, errors: 1 });
  });
});
