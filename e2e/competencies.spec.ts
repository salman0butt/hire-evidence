import { createHash, randomBytes } from "node:crypto";

import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "CompetenciesTest-1234";
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
      "Competency isolation E2E requires local Supabase URL, publishable key, and service role key.",
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
  const signedIn = await authenticated.auth.signInWithPassword({
    email,
    password: PASSWORD,
  });
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

  const accepted = await member.rpc("accept_organization_invitation", {
    p_token_hash: hash,
  });
  expect(accepted.error).toBeNull();
  expect(accepted.data).toBe(organizationId);
}

const jobPayload = {
  p_title: "Competency Test Engineer",
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

test.describe("provider-backed competency tenant isolation", () => {
  test.describe.configure({ mode: "serial" });

  test("binds competencies to the job tenant and fixed-role mutation authority", async () => {
    test.setTimeout(120_000);
    const { supabaseUrl, publishableKey, serviceRoleKey } = environment();
    const admin = client(supabaseUrl, serviceRoleKey);
    const anon = client(supabaseUrl, publishableKey);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const ownerAEmail = `competencies-a-owner-${suffix}@example.test`;
    const ownerBEmail = `competencies-b-owner-${suffix}@example.test`;
    const recruiterEmail = `competencies-a-recruiter-${suffix}@example.test`;
    const managerEmail = `competencies-a-manager-${suffix}@example.test`;
    const reviewerEmail = `competencies-a-reviewer-${suffix}@example.test`;

    const ownerA = await confirmedUser(admin, supabaseUrl, publishableKey, ownerAEmail);
    const ownerB = await confirmedUser(admin, supabaseUrl, publishableKey, ownerBEmail);
    const recruiter = await confirmedUser(admin, supabaseUrl, publishableKey, recruiterEmail);
    const manager = await confirmedUser(admin, supabaseUrl, publishableKey, managerEmail);
    const reviewer = await confirmedUser(admin, supabaseUrl, publishableKey, reviewerEmail);

    const orgA = await createOrganization(ownerA, `Competencies Org A ${suffix}`);
    const orgB = await createOrganization(ownerB, `Competencies Org B ${suffix}`);
    await addMember(ownerA, recruiter, orgA, recruiterEmail, "recruiter");
    await addMember(ownerA, manager, orgA, managerEmail, "hiring_manager");
    await addMember(ownerA, reviewer, orgA, reviewerEmail, "reviewer");

    const job = await ownerA.rpc("create_job", {
      p_organization_id: orgA,
      ...jobPayload,
    });
    expect(job.error).toBeNull();
    expect(typeof job.data).toBe("string");
    if (typeof job.data !== "string") throw new Error("Missing job id.");
    const jobId = job.data;

    const ownerCreated = await ownerA.rpc("create_competency", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_name: "Systems design",
      p_description: "Designs reliable job-relevant systems.",
      p_weight: 40,
      p_position: 0,
    });
    expect(ownerCreated.error).toBeNull();
    expect(typeof ownerCreated.data).toBe("string");

    const recruiterCreated = await recruiter.rpc("create_competency", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_name: "Technical communication",
      p_description: null,
      p_weight: 30,
      p_position: 1,
    });
    expect(recruiterCreated.error).toBeNull();

    const managerCreated = await manager.rpc("create_competency", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_name: "Execution",
      p_description: null,
      p_weight: 30,
      p_position: 2,
    });
    expect(managerCreated.error).toBeNull();

    const reviewerMutation = await reviewer.rpc("create_competency", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_name: "Reviewer-forged criterion",
      p_description: null,
      p_weight: 10,
      p_position: 3,
    });
    expect(reviewerMutation.error).not.toBeNull();

    const crossTenantMutation = await ownerB.rpc("create_competency", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_name: "Cross-tenant criterion",
      p_description: null,
      p_weight: 10,
      p_position: 3,
    });
    expect(crossTenantMutation.error).not.toBeNull();

    const ownerVisible = await ownerA
      .from("competencies")
      .select("name,weight,position")
      .eq("organization_id", orgA)
      .eq("job_id", jobId)
      .order("position", { ascending: true });
    expect(ownerVisible.error).toBeNull();
    expect(ownerVisible.data).toEqual([
      { name: "Systems design", weight: 40, position: 0 },
      { name: "Technical communication", weight: 30, position: 1 },
      { name: "Execution", weight: 30, position: 2 },
    ]);

    const ownerBCrossRead = await ownerB
      .from("competencies")
      .select("id")
      .eq("organization_id", orgA);
    expect(ownerBCrossRead.error).toBeNull();
    expect(ownerBCrossRead.data).toEqual([]);

    const anonRead = await anon.from("competencies").select("id");
    expect(anonRead.data ?? []).toEqual([]);
  });
});
