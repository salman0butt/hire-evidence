import { createHash, randomBytes } from "node:crypto";

import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "CandidatesTest-1234";
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
      "Candidate isolation E2E requires local Supabase URL, publishable key, and service role key.",
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
  role: "recruiter" | "reviewer",
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
  p_title: "Senior Platform Engineer",
  p_department: "Engineering",
  p_description: "Build reliable systems.",
  p_responsibilities: "Own platform reliability.",
  p_seniority: "Senior",
  p_employment_type: "Full-time",
  p_location: "Remote",
  p_salary_range: "80k-100k",
  p_interview_instructions: "Use only job-related evidence.",
  p_requirements: [{ kind: "must_have", requirement: "TypeScript" }],
};

async function createJob(actor: TestClient, organizationId: string, title: string) {
  const created = await actor.rpc("create_job", {
    p_organization_id: organizationId,
    ...jobPayload,
    p_title: title,
  });
  expect(created.error).toBeNull();
  expect(typeof created.data).toBe("string");
  if (typeof created.data !== "string") throw new Error("Missing job id.");
  return created.data;
}

test.describe("provider-backed candidate tenant isolation", () => {
  test.describe.configure({ mode: "serial" });

  test("keeps candidate PII tenant- and hiring-role-scoped", async () => {
    test.setTimeout(120_000);
    const { supabaseUrl, publishableKey, serviceRoleKey } = environment();
    const admin = client(supabaseUrl, serviceRoleKey);
    const anon = client(supabaseUrl, publishableKey);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const ownerAEmail = `candidate-a-owner-${suffix}@example.test`;
    const ownerBEmail = `candidate-b-owner-${suffix}@example.test`;
    const recruiterEmail = `candidate-a-recruiter-${suffix}@example.test`;
    const reviewerEmail = `candidate-a-reviewer-${suffix}@example.test`;

    const ownerA = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      ownerAEmail,
    );
    const ownerB = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      ownerBEmail,
    );
    const recruiter = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      recruiterEmail,
    );
    const reviewer = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      reviewerEmail,
    );

    const orgA = await createOrganization(ownerA, `Candidate Org A ${suffix}`);
    const orgB = await createOrganization(ownerB, `Candidate Org B ${suffix}`);
    await addMember(ownerA, recruiter, orgA, recruiterEmail, "recruiter");
    await addMember(ownerA, reviewer, orgA, reviewerEmail, "reviewer");

    const jobA = await createJob(ownerA, orgA, "Candidate role A");
    const jobB = await createJob(ownerB, orgB, "Candidate role B");

    const created = await ownerA.rpc("create_candidate", {
      p_organization_id: orgA,
      p_job_id: jobA,
      p_full_name: "  Ada Lovelace  ",
      p_email: "  ADA.CANDIDATE@EXAMPLE.TEST  ",
    });
    expect(created.error).toBeNull();
    expect(typeof created.data).toBe("string");
    if (typeof created.data !== "string") throw new Error("Missing candidate id.");
    const candidateId = created.data;

    const ownerVisible = await ownerA
      .from("candidates")
      .select("id,job_id,full_name,email")
      .eq("organization_id", orgA)
      .eq("id", candidateId)
      .single();
    expect(ownerVisible.error).toBeNull();
    expect(ownerVisible.data).toEqual({
      id: candidateId,
      job_id: jobA,
      full_name: "Ada Lovelace",
      email: "ada.candidate@example.test",
    });

    const recruiterCreated = await recruiter.rpc("create_candidate", {
      p_organization_id: orgA,
      p_job_id: jobA,
      p_full_name: "Grace Hopper",
      p_email: `grace-${suffix}@example.test`,
    });
    expect(recruiterCreated.error).toBeNull();

    const recruiterVisible = await recruiter
      .from("candidates")
      .select("id")
      .eq("organization_id", orgA)
      .eq("id", candidateId);
    expect(recruiterVisible.error).toBeNull();
    expect(recruiterVisible.data).toEqual([{ id: candidateId }]);

    const ownerBCrossRead = await ownerB
      .from("candidates")
      .select("id")
      .eq("organization_id", orgA);
    expect(ownerBCrossRead.error).toBeNull();
    expect(ownerBCrossRead.data).toEqual([]);

    const reviewerRead = await reviewer
      .from("candidates")
      .select("id")
      .eq("organization_id", orgA);
    expect(reviewerRead.error).toBeNull();
    expect(reviewerRead.data).toEqual([]);

    const ownerBCrossMutation = await ownerB.rpc("create_candidate", {
      p_organization_id: orgA,
      p_job_id: jobA,
      p_full_name: "Cross tenant",
      p_email: `cross-${suffix}@example.test`,
    });
    expect(ownerBCrossMutation.error).not.toBeNull();

    const reviewerMutation = await reviewer.rpc("create_candidate", {
      p_organization_id: orgA,
      p_job_id: jobA,
      p_full_name: "Reviewer candidate",
      p_email: `reviewer-${suffix}@example.test`,
    });
    expect(reviewerMutation.error).not.toBeNull();

    const wrongJobBinding = await ownerA.rpc("create_candidate", {
      p_organization_id: orgA,
      p_job_id: jobB,
      p_full_name: "Wrong job",
      p_email: `wrong-job-${suffix}@example.test`,
    });
    expect(wrongJobBinding.error).not.toBeNull();

    const directMutation = await ownerA.from("candidates").insert({
      organization_id: orgA,
      job_id: jobA,
      full_name: "Direct write",
      email: `direct-${suffix}@example.test`,
      created_by: "00000000-0000-4000-8000-000000000000",
    });
    expect(directMutation.error).not.toBeNull();

    const anonRead = await anon.from("candidates").select("id");
    expect(anonRead.data ?? []).toEqual([]);
    const anonMutation = await anon.rpc("create_candidate", {
      p_organization_id: orgA,
      p_job_id: jobA,
      p_full_name: "Anonymous candidate",
      p_email: `anon-${suffix}@example.test`,
    });
    expect(anonMutation.error).not.toBeNull();
  });
});
