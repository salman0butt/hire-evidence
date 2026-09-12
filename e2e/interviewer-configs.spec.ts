import { createHash, randomBytes } from "node:crypto";

import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "InterviewerConfigsTest-1234";
const HOUR_MS = 60 * 60 * 1000;

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
      "Interviewer configuration isolation E2E requires local Supabase URL, publishable key, and service role key.",
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

function tokenHash() {
  return createHash("sha256")
    .update(randomBytes(32).toString("base64url"), "utf8")
    .digest("hex");
}

async function addMember(
  owner: TestClient,
  member: TestClient,
  organizationId: string,
  email: string,
  role: "recruiter" | "hiring_manager" | "reviewer",
) {
  const hash = tokenHash();
  const invite = await owner.rpc("create_organization_invitation", {
    p_organization_id: organizationId,
    p_email: email,
    p_role: role,
    p_token_hash: hash,
    p_expires_at: new Date(Date.now() + HOUR_MS).toISOString(),
  });
  expect(invite.error).toBeNull();

  const accepted = await member.rpc("accept_organization_invitation", { p_token_hash: hash });
  expect(accepted.error).toBeNull();
  expect(accepted.data).toBe(organizationId);
}

const jobPayload = {
  p_title: "Interviewer Configuration Test Engineer",
  p_department: "Engineering",
  p_description: "Own job-related platform outcomes.",
  p_responsibilities: null,
  p_seniority: "Senior",
  p_employment_type: "Full-time",
  p_location: "Remote",
  p_salary_range: null,
  p_interview_instructions: "Assess only job-related evidence.",
  p_requirements: [{ kind: "must_have", requirement: "TypeScript" }],
};

async function createPlan(actor: TestClient, organizationId: string, jobId: string) {
  const competency = await actor.rpc("create_competency", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_name: "Systems design",
    p_description: "Designs reliable job-relevant systems.",
    p_weight: 100,
    p_position: 0,
  });
  expect(competency.error).toBeNull();
  expect(typeof competency.data).toBe("string");
  if (typeof competency.data !== "string") throw new Error("Missing competency id.");

  const question = await actor.rpc("create_question", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_competency_id: competency.data,
    p_question_text: "Describe a production incident you owned.",
    p_difficulty: "medium",
    p_expected_areas: ["diagnosis", "verification"],
    p_follow_up_hints: ["Ask for concrete evidence."],
    p_max_duration_seconds: 300,
    p_is_required: true,
    p_position: 0,
  });
  expect(question.error).toBeNull();
  expect(typeof question.data).toBe("string");
  if (typeof question.data !== "string") throw new Error("Missing question id.");

  const plan = await actor.rpc("save_interview_plan", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_total_duration_seconds: 600,
    p_sections: [
      {
        purpose: "Technical evidence",
        durationSeconds: 600,
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
  name: string,
) {
  return actor.rpc("save_interviewer_config", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_plan_id: planId,
    p_name: name,
    p_interview_type: "technical",
    p_persona: "professional",
    p_language: "English",
    p_duration_seconds: 1800,
    p_difficulty: "medium",
    p_question_mode: "semi_adaptive",
    p_guidelines: "Ask only job-related questions.",
    p_candidate_instructions: "Use concrete examples.",
    p_max_follow_ups_per_question: 1,
    p_follow_up_reasons: ["clarify_ambiguity", "request_example"],
    p_config_id: null,
  });
}

test.describe("provider-backed interviewer configuration isolation", () => {
  test.describe.configure({ mode: "serial" });

  test("enforces fixed-role mutation, tenant/job/plan ownership, and member-only reads", async () => {
    test.setTimeout(120_000);
    const { supabaseUrl, publishableKey, serviceRoleKey } = environment();
    const admin = client(supabaseUrl, serviceRoleKey);
    const anon = client(supabaseUrl, publishableKey);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const ownerAEmail = `config-a-owner-${suffix}@example.test`;
    const ownerBEmail = `config-b-owner-${suffix}@example.test`;
    const recruiterEmail = `config-a-recruiter-${suffix}@example.test`;
    const managerEmail = `config-a-manager-${suffix}@example.test`;
    const reviewerEmail = `config-a-reviewer-${suffix}@example.test`;

    const ownerA = await confirmedUser(admin, supabaseUrl, publishableKey, ownerAEmail);
    const ownerB = await confirmedUser(admin, supabaseUrl, publishableKey, ownerBEmail);
    const recruiter = await confirmedUser(admin, supabaseUrl, publishableKey, recruiterEmail);
    const manager = await confirmedUser(admin, supabaseUrl, publishableKey, managerEmail);
    const reviewer = await confirmedUser(admin, supabaseUrl, publishableKey, reviewerEmail);

    const orgA = await createOrganization(ownerA, `Config Org A ${suffix}`);
    await createOrganization(ownerB, `Config Org B ${suffix}`);
    await addMember(ownerA, recruiter, orgA, recruiterEmail, "recruiter");
    await addMember(ownerA, manager, orgA, managerEmail, "hiring_manager");
    await addMember(ownerA, reviewer, orgA, reviewerEmail, "reviewer");

    const job = await ownerA.rpc("create_job", { p_organization_id: orgA, ...jobPayload });
    expect(job.error).toBeNull();
    expect(typeof job.data).toBe("string");
    if (typeof job.data !== "string") throw new Error("Missing job id.");
    const jobId = job.data;
    const planId = await createPlan(ownerA, orgA, jobId);

    const recruiterCreated = await saveConfig(recruiter, orgA, jobId, planId, "Recruiter config");
    expect(recruiterCreated.error).toBeNull();
    expect(typeof recruiterCreated.data).toBe("string");

    const managerCreated = await saveConfig(manager, orgA, jobId, planId, "Manager config");
    expect(managerCreated.error).toBeNull();
    expect(typeof managerCreated.data).toBe("string");

    const reviewerMutation = await saveConfig(reviewer, orgA, jobId, planId, "Reviewer config");
    expect(reviewerMutation.error).not.toBeNull();

    const crossTenantMutation = await saveConfig(ownerB, orgA, jobId, planId, "Cross tenant config");
    expect(crossTenantMutation.error).not.toBeNull();

    const anonymousMutation = await saveConfig(anon, orgA, jobId, planId, "Anonymous config");
    expect(anonymousMutation.error).not.toBeNull();

    const otherJob = await ownerA.rpc("create_job", {
      p_organization_id: orgA,
      ...jobPayload,
      p_title: "Other Interviewer Configuration Test Engineer",
    });
    expect(otherJob.error).toBeNull();
    expect(typeof otherJob.data).toBe("string");
    if (typeof otherJob.data !== "string") throw new Error("Missing other job id.");

    const crossJobPlan = await saveConfig(ownerA, orgA, otherJob.data, planId, "Wrong job plan");
    expect(crossJobPlan.error).not.toBeNull();

    const reviewerRead = await reviewer
      .from("interviewer_configs")
      .select("id,name,plan_id")
      .eq("organization_id", orgA)
      .eq("job_id", jobId);
    expect(reviewerRead.error).toBeNull();
    expect(reviewerRead.data).toHaveLength(2);
    expect(reviewerRead.data?.every((config) => config.plan_id === planId)).toBe(true);

    const ownerBCrossRead = await ownerB
      .from("interviewer_configs")
      .select("id")
      .eq("organization_id", orgA);
    expect(ownerBCrossRead.error).toBeNull();
    expect(ownerBCrossRead.data).toEqual([]);

    const anonRead = await anon.from("interviewer_configs").select("id");
    expect(anonRead.data ?? []).toEqual([]);
  });
});
