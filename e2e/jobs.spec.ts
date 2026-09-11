import { createHash, randomBytes } from "node:crypto";

import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "JobsTest-1234";
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
      "Job isolation E2E requires local Supabase URL, publishable key, and service role key.",
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
  p_title: "Senior Platform Engineer",
  p_department: "Engineering",
  p_description: "Build reliable systems.",
  p_responsibilities: "Own platform reliability.",
  p_seniority: "Senior",
  p_employment_type: "Full-time",
  p_location: "Remote",
  p_salary_range: "80k-100k",
  p_interview_instructions: "Use only job-related evidence.",
  p_requirements: [
    { kind: "must_have", requirement: "TypeScript" },
    { kind: "nice_to_have", requirement: "Kubernetes" },
  ],
};

test.describe("provider-backed job tenant isolation", () => {
  test.describe.configure({ mode: "serial" });

  test("isolates jobs and enforces role-gated mutations", async () => {
    test.setTimeout(120_000);
    const { supabaseUrl, publishableKey, serviceRoleKey } = environment();
    const admin = client(supabaseUrl, serviceRoleKey);
    const anon = client(supabaseUrl, publishableKey);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const ownerAEmail = `jobs-a-owner-${suffix}@example.test`;
    const ownerBEmail = `jobs-b-owner-${suffix}@example.test`;
    const recruiterEmail = `jobs-a-recruiter-${suffix}@example.test`;
    const hiringManagerEmail = `jobs-a-manager-${suffix}@example.test`;
    const reviewerEmail = `jobs-a-reviewer-${suffix}@example.test`;

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
    const hiringManager = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      hiringManagerEmail,
    );
    const reviewer = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      reviewerEmail,
    );

    const orgA = await createOrganization(ownerA, `Jobs Org A ${suffix}`);
    const orgB = await createOrganization(ownerB, `Jobs Org B ${suffix}`);
    await addMember(ownerA, recruiter, orgA, recruiterEmail, "recruiter");
    await addMember(
      ownerA,
      hiringManager,
      orgA,
      hiringManagerEmail,
      "hiring_manager",
    );
    await addMember(ownerA, reviewer, orgA, reviewerEmail, "reviewer");

    const created = await ownerA.rpc("create_job", {
      p_organization_id: orgA,
      ...jobPayload,
    });
    expect(created.error).toBeNull();
    expect(typeof created.data).toBe("string");
    if (typeof created.data !== "string") throw new Error("Missing job id.");
    const jobId = created.data;

    const ownerVisible = await ownerA
      .from("jobs")
      .select("id,title,job_requirements(kind,requirement,position)")
      .eq("organization_id", orgA)
      .eq("id", jobId)
      .single();
    expect(ownerVisible.error).toBeNull();
    expect(ownerVisible.data?.title).toBe(jobPayload.p_title);
    expect(ownerVisible.data?.job_requirements).toEqual([
      { kind: "must_have", requirement: "TypeScript", position: 0 },
      { kind: "nice_to_have", requirement: "Kubernetes", position: 1 },
    ]);

    const ownerBCrossRead = await ownerB
      .from("jobs")
      .select("id")
      .eq("organization_id", orgA);
    expect(ownerBCrossRead.error).toBeNull();
    expect(ownerBCrossRead.data).toEqual([]);

    const ownerBCrossUpdate = await ownerB.rpc("update_job", {
      p_organization_id: orgA,
      p_job_id: jobId,
      ...jobPayload,
      p_title: "Forged title",
    });
    expect(ownerBCrossUpdate.error).not.toBeNull();

    const recruiterCreated = await recruiter.rpc("create_job", {
      p_organization_id: orgA,
      ...jobPayload,
      p_title: "Recruiter-created role",
    });
    expect(recruiterCreated.error).toBeNull();
    expect(typeof recruiterCreated.data).toBe("string");

    const hiringManagerCreated = await hiringManager.rpc("create_job", {
      p_organization_id: orgA,
      ...jobPayload,
      p_title: "Hiring-manager-created role",
    });
    expect(hiringManagerCreated.error).toBeNull();
    expect(typeof hiringManagerCreated.data).toBe("string");

    const reviewerMutation = await reviewer.rpc("create_job", {
      p_organization_id: orgA,
      ...jobPayload,
      p_title: "Reviewer-forged role",
    });
    expect(reviewerMutation.error).not.toBeNull();

    const anonRead = await anon.from("jobs").select("id");
    expect(anonRead.data ?? []).toEqual([]);
    const anonMutation = await anon.rpc("delete_job", {
      p_organization_id: orgA,
      p_job_id: jobId,
    });
    expect(anonMutation.error).not.toBeNull();

    const updated = await ownerA.rpc("update_job", {
      p_organization_id: orgA,
      p_job_id: jobId,
      ...jobPayload,
      p_requirements: [
        { kind: "must_have", requirement: "TypeScript" },
        { kind: "must_have", requirement: "PostgreSQL" },
      ],
    });
    expect(updated.error).toBeNull();

    const requirementsAfterUpdate = await ownerA
      .from("job_requirements")
      .select("kind,requirement,position")
      .eq("organization_id", orgA)
      .eq("job_id", jobId)
      .order("position", { ascending: true });
    expect(requirementsAfterUpdate.error).toBeNull();
    expect(requirementsAfterUpdate.data).toEqual([
      { kind: "must_have", requirement: "TypeScript", position: 0 },
      { kind: "must_have", requirement: "PostgreSQL", position: 1 },
    ]);

    const deleted = await ownerA.rpc("delete_job", {
      p_organization_id: orgA,
      p_job_id: jobId,
    });
    expect(deleted.error).toBeNull();

    const afterDelete = await ownerA.from("jobs").select("id").eq("id", jobId);
    expect(afterDelete.error).toBeNull();
    expect(afterDelete.data).toEqual([]);

    const orgBStillEmpty = await ownerB
      .from("jobs")
      .select("id")
      .eq("organization_id", orgB);
    expect(orgBStillEmpty.error).toBeNull();
    expect(orgBStillEmpty.data).toEqual([]);
  });
});
