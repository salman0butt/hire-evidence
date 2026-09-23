export type EvalCase<TInput> = {
  id: string;
  version: string;
  category: string;
  input: TInput;
};

export type EvalSuite<TInput> = {
  id: string;
  version: string;
  cases: readonly EvalCase<TInput>[];
};

export type EvalEvaluation = {
  passed: boolean;
  metrics?: Record<string, number>;
  evidence?: readonly string[];
};

export type EvalEvaluator<TInput> = {
  id: string;
  version: string;
  evaluate(evalCase: EvalCase<TInput>): Promise<EvalEvaluation> | EvalEvaluation;
};

type CompletedEvalResult = {
  caseId: string;
  caseVersion: string;
  category: string;
  status: "completed";
  passed: boolean;
  metrics: Record<string, number>;
  evidence: readonly string[];
};

type ErrorEvalResult = {
  caseId: string;
  caseVersion: string;
  category: string;
  status: "error";
  passed: false;
  error: string;
};

export type EvalResult = CompletedEvalResult | ErrorEvalResult;

export type EvalRun = {
  suiteId: string;
  suiteVersion: string;
  evaluator: { id: string; version: string };
  results: EvalResult[];
  summary: { total: number; passed: number; failed: number; errors: number };
};

export function defineEvalSuite<TInput>(suite: EvalSuite<TInput>): EvalSuite<TInput> {
  const ids = new Set<string>();
  for (const evalCase of suite.cases) {
    if (ids.has(evalCase.id)) {
      throw new Error(`Duplicate eval case id: ${evalCase.id}`);
    }
    ids.add(evalCase.id);
  }
  return suite;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

export async function runEvalSuite<TInput>(
  suite: EvalSuite<TInput>,
  evaluator: EvalEvaluator<TInput>,
): Promise<EvalRun> {
  const results: EvalResult[] = [];

  for (const evalCase of suite.cases) {
    try {
      const evaluation = await evaluator.evaluate(evalCase);
      results.push({
        caseId: evalCase.id,
        caseVersion: evalCase.version,
        category: evalCase.category,
        status: "completed",
        passed: evaluation.passed,
        metrics: evaluation.metrics ?? {},
        evidence: evaluation.evidence ?? [],
      });
    } catch (error) {
      results.push({
        caseId: evalCase.id,
        caseVersion: evalCase.version,
        category: evalCase.category,
        status: "error",
        passed: false,
        error: errorMessage(error),
      });
    }
  }

  return {
    suiteId: suite.id,
    suiteVersion: suite.version,
    evaluator: { id: evaluator.id, version: evaluator.version },
    results,
    summary: {
      total: results.length,
      passed: results.filter((result) => result.status === "completed" && result.passed).length,
      failed: results.filter((result) => result.status === "completed" && !result.passed).length,
      errors: results.filter((result) => result.status === "error").length,
    },
  };
}
