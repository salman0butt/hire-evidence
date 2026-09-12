import { createClient } from "@/lib/supabase/server";

export type CandidateCreateInput = Readonly<{
  fullName: string;
  email: string;
}>;

export type Candidate = CandidateCreateInput &
  Readonly<{
    id: string;
    jobId: string;
    createdAt: string;
  }>;

type CandidateRow = Readonly<{
  id: unknown;
  job_id: unknown;
  full_name: unknown;
  email: unknown;
  created_at: unknown;
}>;

function parseCandidate(row: CandidateRow): Candidate | null {
  if (
    typeof row.id !== "string" ||
    typeof row.job_id !== "string" ||
    typeof row.full_name !== "string" ||
    typeof row.email !== "string" ||
    typeof row.created_at !== "string"
  ) {
    return null;
  }

  return {
    id: row.id,
    jobId: row.job_id,
    fullName: row.full_name,
    email: row.email,
    createdAt: row.created_at,
  };
}

export async function createCandidate(
  organizationId: string,
  jobId: string,
  input: CandidateCreateInput,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_candidate", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_full_name: input.fullName,
    p_email: input.email,
  });

  if (error || typeof data !== "string" || !data) {
    throw new Error("Unable to create candidate.");
  }

  return data;
}

export async function listCandidates(
  organizationId: string,
  jobId: string,
): Promise<Candidate[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("candidates")
    .select("id,job_id,full_name,email,created_at")
    .eq("organization_id", organizationId)
    .eq("job_id", jobId)
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw new Error("Unable to load candidates.");

  const candidates: Candidate[] = [];
  for (const row of data ?? []) {
    const candidate = parseCandidate(row as CandidateRow);
    if (!candidate) throw new Error("Invalid candidate data.");
    candidates.push(candidate);
  }

  return candidates;
}
