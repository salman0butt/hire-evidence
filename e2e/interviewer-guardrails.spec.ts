import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "InterviewerGuardrailsTest-1234";

function client(url: string, key: string) {
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

type TestClient = ReturnType<typeof client>;

function environment() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    throw new Error(
      "Interviewer guardrail E2E requires local Supabase URL, publishable key, and service role key.",
    );
  }
  return { supabaseUrl, publishableKey, serviceRoleKey };
}

async function confirmedUser(
  admin: TestClient,
  supabaseUrl: string,
  publishableKey: string,
  email: string,
) {
  const created = await admin.auth.admin.createUser({
    email,
    password: PASSWORD,
    email_confirm: true,
  });
  expect(created.error).toBeNull();

  const authenticated = client(supabaseUrl, publishableKey);
  const signedIn = await authenticated.auth.signInWithPassword({ email, password: PASSWORD });
  expect(signedIn.error).toBeNull();
  return authenticated;
}

async function createOrganization(actor: TestClient, name: string) {
  const result = await actor.rpc("create_organization", {
    p_name: name,
    p_company_size: null,
    p_hiring_use_case: null,
  });
  expect(result.error).toBeNull();
  expect(typeof result.data).toBe("string");
  if (typeof result.data !== "string") throw new Error("Missing organization id.");
  return result.data;
}

async function createJob(actor: TestClient, organizationId: string) {
  const job = await actor.rpc("create_job", {
    p_organization_id: organizationId,
    p_title: "Backend Reliability Engineer",
    p_department: "Engineering",
    p_description: "Build reliable backend systems using job-related evidence.",
    p_responsibilities: "Design and verify production services.",
    p_seniority: "Senior",
    p_employment_type: "Full-time",
    p_location: "Remote",
    p_salary_range: null,
    p_interview_instructions: "Assess only concrete engineering evidence.",
    p_requirements: [{ kind: "must_have", requirement: "TypeScript" }],
  });
  expect(job.error).toBeNull();
  expect(typeof job.data).toBe("string");
  if (typeof job.data !== "string") throw new Error("Missing job id.");
  return job.data;
}

async function createPlan(actor: TestClient, organizationId: string, jobId: string) {
  const competency = await actor.rpc("create_competency", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_name: "Reliability reasoning",
    p_description: "Explains evidence-backed reliability tradeoffs.",
    p_weight: 100,
    p_position: 0,
  });
  expect(competency.error).toBeNull();
  expect(typeof competency.data).toBe("string");
  if (typeof competency.data !== "string") throw new Error("Missing competency id.");

  const rubric = await actor.rpc("save_competency_rubric", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_competency_id: competency.data,
    p_level_1: "Cannot identify a reliability tradeoff.",
    p_level_2: "Identifies a tradeoff with limited evidence.",
    p_level_3: "Explains a tradeoff with concrete evidence.",
    p_level_4: "Compares alternatives using measurable evidence.",
    p_level_5: "Anticipates failure modes and validates tradeoffs with measurable evidence.",
  });
  expect(rubric.error).toBeNull();

  const question = await actor.rpc("create_question", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_competency_id: competency.data,
    p_question_text: "Describe a production reliability tradeoff you owned.",
    p_difficulty: "medium",
    p_expected_areas: ["context", "tradeoff", "verification"],
    p_follow_up_hints: ["Ask for concrete evidence."],
    p_max_duration_seconds: 600,
    p_is_required: true,
    p_position: 0,
  });
  expect(question.error).toBeNull();
  expect(typeof question.data).toBe("string");
  if (typeof question.data !== "string") throw new Error("Missing question id.");

  const plan = await actor.rpc("save_interview_plan", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_total_duration_seconds: 1800,
    p_sections: [
      {
        purpose: "Reliability evidence",
        durationSeconds: 1800,
        position: 0,
        questionIds: [question.data],
        competencyIds: [competency.data],
      },
    ],
  });
  expect(plan.error).toBeNull();
  expect(typeof plan.data).toBe("string");
  if (typeof plan.data !== "string") throw new Error("Missing plan id.");
  return plan.data;
}

function saveConfig(
  actor: TestClient,
  organizationId: string,
  jobId: string,
  planId: string,
  guidelines: string,
) {
  return actor.rpc("save_interviewer_config", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_plan_id: planId,
    p_name: "Reliability Interviewer",
    p_interview_type: "technical",
    p_persona: "professional",
    p_language: "English",
    p_duration_seconds: 1800,
    p_difficulty: "medium",
    p_question_mode: "semi_adaptive",
    p_guidelines: guidelines,
    p_candidate_instructions: "Use concrete examples from your work.",
    p_max_follow_ups_per_question: 1,
    p_follow_up_reasons: ["clarify_ambiguity", "request_example"],
    p_config_id: null,
  });
}

test.describe("authoritative interviewer guardrails", () => {
  test.describe.configure({ mode: "serial" });

  test("allows safe wording while rejecting prohibited direct-RPC hiring criteria", async () => {
    test.setTimeout(120_000);
    const { supabaseUrl, publishableKey, serviceRoleKey } = environment();
    const admin = client(supabaseUrl, serviceRoleKey);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const owner = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      `guardrail-owner-${suffix}@example.test`,
    );
    const organizationId = await createOrganization(owner, `Guardrail Org ${suffix}`);
    const jobId = await createJob(owner, organizationId);
    const planId = await createPlan(owner, organizationId, jobId);

    const safe = await saveConfig(
      owner,
      organizationId,
      jobId,
      planId,
      "Manage ambiguity with neutral, job-related follow-up questions.",
    );
    expect(safe.error).toBeNull();
    expect(typeof safe.data).toBe("string");

    const unsafe = await saveConfig(
      owner,
      organizationId,
      jobId,
      planId,
      "Automatically reject candidates based on race without human review.",
    );
    expect(unsafe.error).not.toBeNull();
  });
});
