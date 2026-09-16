export type AssessmentGenerationStatus = "pending" | "processing" | "completed" | "failed";

export type AssessmentGenerationRow = {
  id: string;
  organization_id: string;
  attempt_id: string;
  generation_number: number;
  status: AssessmentGenerationStatus;
  assessment: unknown | null;
  provenance: unknown | null;
  failure_reason: string | null;
};

type RpcResult = {
  data: AssessmentGenerationRow | AssessmentGenerationRow[] | null;
  error: { message?: string } | null;
};

type Rpc = (name: string, params: Record<string, unknown>) => Promise<RpcResult>;

type GenerationIdentity = {
  organizationId: string;
  attemptId: string;
  generationNumber: number;
};

type CompleteGenerationInput = GenerationIdentity & {
  assessment: unknown;
  provenance: unknown;
  validated: boolean;
};

function params(identity: GenerationIdentity) {
  return {
    p_organization_id: identity.organizationId,
    p_attempt_id: identity.attemptId,
    p_generation_number: identity.generationNumber,
  };
}

function requireGeneration(result: RpcResult): AssessmentGenerationRow {
  if (result.error || !result.data || Array.isArray(result.data)) {
    throw new Error("assessment generation unavailable");
  }

  return result.data;
}

function requireGenerations(result: RpcResult): AssessmentGenerationRow[] {
  if (result.error || !Array.isArray(result.data)) {
    throw new Error("assessment generation unavailable");
  }

  return [...result.data].sort((left, right) => left.generation_number - right.generation_number);
}

export function createAssessmentRepository({ rpc }: { rpc: Rpc }) {
  async function call(name: string, input: GenerationIdentity) {
    return requireGeneration(await rpc(name, params(input)));
  }

  return {
    getGeneration(organizationId: string, attemptId: string, generationNumber: number) {
      return call("get_assessment_generation", { organizationId, attemptId, generationNumber });
    },

    claimGeneration(organizationId: string, attemptId: string, generationNumber: number) {
      return call("claim_assessment_generation", { organizationId, attemptId, generationNumber });
    },

    async listGenerations(organizationId: string, attemptId: string) {
      return requireGenerations(
        await rpc("list_assessment_generations", {
          p_organization_id: organizationId,
          p_attempt_id: attemptId,
        }),
      );
    },

    async createRegeneration(organizationId: string, attemptId: string) {
      return requireGeneration(
        await rpc("create_assessment_regeneration", {
          p_organization_id: organizationId,
          p_attempt_id: attemptId,
        }),
      );
    },

    async completeGeneration(input: CompleteGenerationInput) {
      if (!input.validated) {
        throw new Error("validated assessment required");
      }

      return requireGeneration(
        await rpc("complete_assessment_generation", {
          ...params(input),
          p_assessment: input.assessment,
          p_provenance: input.provenance,
          p_validated: true,
        }),
      );
    },

    async failGeneration(
      organizationId: string,
      attemptId: string,
      generationNumber: number,
      failureReason: string,
    ) {
      return requireGeneration(
        await rpc("fail_assessment_generation", {
          p_organization_id: organizationId,
          p_attempt_id: attemptId,
          p_generation_number: generationNumber,
          p_failure_reason: failureReason,
        }),
      );
    },
  };
}
