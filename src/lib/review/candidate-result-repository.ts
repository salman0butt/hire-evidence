import {
  parseInterviewAssessment,
  type CompetencyAssessment,
  type InterviewAssessment,
} from "../assessment/assessment-schema";

export type CandidateReviewResultRow = {
  organization_id: string;
  job_id: string;
  candidate_id: string;
  attempt_id: string;
  candidate_name: string;
  job_title: string;
  interview_status: string;
  review_status: string;
  generation_number: number;
  assessment_status: string;
  assessment: unknown;
  competency_catalog: unknown;
};

export type CandidateReviewCompetency = CompetencyAssessment &
  Readonly<{
    name: string;
  }>;

export type CandidateReviewResult = Omit<
  CandidateReviewResultRow,
  "assessment" | "competency_catalog"
> &
  Readonly<{
    assessment: InterviewAssessment;
    competency_catalog: readonly CompetencyCatalogEntry[];
    review_competencies: readonly CandidateReviewCompetency[];
  }>;

type RpcResult = {
  data: unknown;
  error: unknown;
};

type RpcClient = {
  rpc: (name: string, args: Record<string, unknown>) => PromiseLike<RpcResult>;
};

type CompetencyCatalogEntry = Readonly<{
  id: string;
  name: string;
}>;

function isCandidateReviewResultRow(value: unknown): value is CandidateReviewResultRow {
  if (!value || typeof value !== "object") return false;
  const row = value as Record<string, unknown>;
  return (
    typeof row.organization_id === "string" &&
    typeof row.job_id === "string" &&
    typeof row.candidate_id === "string" &&
    typeof row.attempt_id === "string" &&
    typeof row.candidate_name === "string" &&
    typeof row.job_title === "string" &&
    typeof row.interview_status === "string" &&
    typeof row.review_status === "string" &&
    Number.isInteger(row.generation_number) &&
    typeof row.assessment_status === "string"
  );
}

function parseCompetencyCatalog(value: unknown): readonly CompetencyCatalogEntry[] | null {
  if (!Array.isArray(value)) return null;

  const entries: CompetencyCatalogEntry[] = [];
  const ids = new Set<string>();

  for (const item of value) {
    if (!item || typeof item !== "object" || Array.isArray(item)) return null;

    const entry = item as Record<string, unknown>;
    if (
      typeof entry.id !== "string" ||
      entry.id.trim().length === 0 ||
      typeof entry.name !== "string" ||
      entry.name.trim().length === 0 ||
      ids.has(entry.id)
    ) {
      return null;
    }

    ids.add(entry.id);
    entries.push({ id: entry.id, name: entry.name });
  }

  return entries;
}

export function createCandidateResultRepository(client: RpcClient) {
  return {
    async getCandidateResult(
      organizationId: string,
      jobId: string,
      candidateId: string,
    ): Promise<CandidateReviewResult> {
      const { data, error } = await client.rpc("get_candidate_review_result", {
        p_organization_id: organizationId,
        p_job_id: jobId,
        p_candidate_id: candidateId,
      });

      if (error || !isCandidateReviewResultRow(data)) {
        throw new Error("candidate result unavailable");
      }

      if (data.assessment_status !== "completed") {
        throw new Error("completed assessment required");
      }

      const parsedAssessment = parseInterviewAssessment(data.assessment);
      const competencyCatalog = parseCompetencyCatalog(data.competency_catalog);

      if (!parsedAssessment.ok || !competencyCatalog) {
        throw new Error("candidate assessment unavailable");
      }

      const competencyNames = new Map(
        competencyCatalog.map((entry) => [entry.id, entry.name]),
      );

      const reviewCompetencies = parsedAssessment.value.competencies.map(
        (competency): CandidateReviewCompetency => {
          const name = competencyNames.get(competency.competencyId);

          if (!name) {
            throw new Error("candidate competency unavailable");
          }

          return {
            ...competency,
            name,
          };
        },
      );

      return {
        ...data,
        assessment: parsedAssessment.value,
        competency_catalog: competencyCatalog,
        review_competencies: reviewCompetencies,
      };
    },
  };
}
