import { createClient } from "@/lib/supabase/server";

import type { JobInput, JobRequirementInput } from "./job-validation";

export type Job = JobInput & Readonly<{ id: string }>;

type JobRow = Readonly<{
  id: unknown;
  title: unknown;
  department: unknown;
  description: unknown;
  responsibilities: unknown;
  seniority: unknown;
  employment_type: unknown;
  location: unknown;
  salary_range: unknown;
  interview_instructions: unknown;
  job_requirements: unknown;
}>;

function mutationArgs(organizationId: string, input: JobInput) {
  return {
    p_organization_id: organizationId,
    p_title: input.title,
    p_department: input.department,
    p_description: input.description,
    p_responsibilities: input.responsibilities,
    p_seniority: input.seniority,
    p_employment_type: input.employmentType,
    p_location: input.location,
    p_salary_range: input.salaryRange,
    p_interview_instructions: input.interviewInstructions,
    p_requirements: input.requirements,
  };
}

function parseNullableString(value: unknown): string | null | undefined {
  if (value === null) return null;
  return typeof value === "string" ? value : undefined;
}

function parseRequirements(value: unknown): JobRequirementInput[] | null {
  if (!Array.isArray(value)) return null;

  const ordered = [...value].sort((left, right) => {
    const leftPosition =
      left && typeof left === "object" && "position" in left
        ? (left as { position?: unknown }).position
        : undefined;
    const rightPosition =
      right && typeof right === "object" && "position" in right
        ? (right as { position?: unknown }).position
        : undefined;

    return typeof leftPosition === "number" && typeof rightPosition === "number"
      ? leftPosition - rightPosition
      : 0;
  });

  const requirements: JobRequirementInput[] = [];
  for (const row of ordered) {
    if (row === null || typeof row !== "object" || Array.isArray(row)) return null;
    const requirement = row as {
      kind?: unknown;
      requirement?: unknown;
      position?: unknown;
    };

    if (
      (requirement.kind !== "must_have" && requirement.kind !== "nice_to_have") ||
      typeof requirement.requirement !== "string" ||
      typeof requirement.position !== "number"
    ) {
      return null;
    }

    requirements.push({
      kind: requirement.kind,
      requirement: requirement.requirement,
    });
  }

  return requirements;
}

function parseJob(row: JobRow): Job | null {
  const department = parseNullableString(row.department);
  const description = parseNullableString(row.description);
  const responsibilities = parseNullableString(row.responsibilities);
  const seniority = parseNullableString(row.seniority);
  const employmentType = parseNullableString(row.employment_type);
  const location = parseNullableString(row.location);
  const salaryRange = parseNullableString(row.salary_range);
  const interviewInstructions = parseNullableString(row.interview_instructions);
  const requirements = parseRequirements(row.job_requirements);

  if (
    typeof row.id !== "string" ||
    typeof row.title !== "string" ||
    department === undefined ||
    description === undefined ||
    responsibilities === undefined ||
    seniority === undefined ||
    employmentType === undefined ||
    location === undefined ||
    salaryRange === undefined ||
    interviewInstructions === undefined ||
    requirements === null
  ) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    department,
    description,
    responsibilities,
    seniority,
    employmentType,
    location,
    salaryRange,
    interviewInstructions,
    requirements,
  };
}

export async function createJob(
  organizationId: string,
  input: JobInput,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc(
    "create_job",
    mutationArgs(organizationId, input),
  );

  if (error || typeof data !== "string" || !data) {
    throw new Error("Unable to create job.");
  }

  return data;
}

export async function updateJob(
  organizationId: string,
  jobId: string,
  input: JobInput,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("update_job", {
    ...mutationArgs(organizationId, input),
    p_job_id: jobId,
  });

  if (error) throw new Error("Unable to update job.");
}

export async function deleteJob(
  organizationId: string,
  jobId: string,
): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("delete_job", {
    p_organization_id: organizationId,
    p_job_id: jobId,
  });

  if (error) throw new Error("Unable to delete job.");
}

const JOB_SELECT =
  "id,title,department,description,responsibilities,seniority,employment_type,location,salary_range,interview_instructions,job_requirements(kind,requirement,position)";

export async function getJob(
  organizationId: string,
  jobId: string,
): Promise<Job> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .eq("organization_id", organizationId)
    .eq("id", jobId)
    .maybeSingle();

  const job = data ? parseJob(data as JobRow) : null;
  if (error || !job) {
    throw new Error("Unable to load job.");
  }

  return job;
}

export async function listJobs(organizationId: string): Promise<Job[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("jobs")
    .select(JOB_SELECT)
    .eq("organization_id", organizationId)
    .order("title", { ascending: true })
    .order("id", { ascending: true });

  if (error) throw new Error("Unable to load jobs.");

  const jobs: Job[] = [];
  for (const row of data ?? []) {
    const job = parseJob(row as JobRow);
    if (!job) throw new Error("Invalid job data.");
    jobs.push(job);
  }

  return jobs;
}
