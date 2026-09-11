import { createClient } from "@/lib/supabase/server";

import type { CompetencyInput } from "./competency-validation";

export type Competency = CompetencyInput &
  Readonly<{
    id: string;
    jobId: string;
  }>;

type CompetencyRow = Readonly<{
  id: unknown;
  job_id: unknown;
  name: unknown;
  description: unknown;
  weight: unknown;
  position: unknown;
}>;

function parseCompetency(row: CompetencyRow): Competency | null {
  if (
    typeof row.id !== "string" ||
    typeof row.job_id !== "string" ||
    typeof row.name !== "string" ||
    (row.description !== null && typeof row.description !== "string") ||
    typeof row.weight !== "number" ||
    !Number.isFinite(row.weight) ||
    typeof row.position !== "number" ||
    !Number.isInteger(row.position)
  ) {
    return null;
  }

  return {
    id: row.id,
    jobId: row.job_id,
    name: row.name,
    description: row.description,
    weight: row.weight,
    position: row.position,
  };
}

export async function createCompetency(
  organizationId: string,
  jobId: string,
  input: CompetencyInput,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_competency", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_name: input.name,
    p_description: input.description,
    p_weight: input.weight,
    p_position: input.position,
  });

  if (error || typeof data !== "string" || !data) {
    throw new Error("Unable to create competency.");
  }

  return data;
}

export async function listCompetencies(
  organizationId: string,
  jobId: string,
): Promise<Competency[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("competencies")
    .select("id,job_id,name,description,weight,position")
    .eq("organization_id", organizationId)
    .eq("job_id", jobId)
    .order("position", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw new Error("Unable to load competencies.");

  const competencies: Competency[] = [];
  for (const row of data ?? []) {
    const competency = parseCompetency(row as CompetencyRow);
    if (!competency) throw new Error("Invalid competency data.");
    competencies.push(competency);
  }

  return competencies;
}
