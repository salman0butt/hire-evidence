import { createHash, randomBytes } from "node:crypto";

import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "RubricsTest-1234";
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
      "Rubric isolation E2E requires local Supabase URL, publishable key, and service role key.",
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
  p_title: "Rubric Test Engineer",
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

const completeRubric = {
  p_level_1: "Cannot yet explain a job-relevant approach or produce usable evidence.",
  p_level_2: "Explains a partial approach but misses important constraints or evidence.",
  p_level_3: "Explains and applies a sound approach to the core job-relevant scenario.",
  p_level_4: "Applies the approach across tradeoffs and validates the resulting evidence.",
  p_level_5: "Consistently reasons through complex tradeoffs and produces independently verifiable evidence.",
};

test.describe("provider-backed rubric tenant isolation", () => {
  test.describe.configure({ mode: "serial" });

  test("requires complete observable levels and enforces fixed-role tenant authority", async () => {
    test.setTimeout(120_000);
    const { supabaseUrl, publishableKey, serviceRoleKey } = environment();
    const admin = client(supabaseUrl, serviceRoleKey);
    const anon = client(supabaseUrl, publishableKey);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const ownerAEmail = `rubrics-a-owner-${suffix}@example.test`;
    const ownerBEmail = `rubrics-b-owner-${suffix}@example.test`;
    const recruiterEmail = `rubrics-a-recruiter-${suffix}@example.test`;
    const managerEmail = `rubrics-a-manager-${suffix}@example.test`;
    const reviewerEmail = `rubrics-a-reviewer-${suffix}@example.test`;

    const ownerA = await confirmedUser(admin, supabaseUrl, publishableKey, ownerAEmail);
    const ownerB = await confirmedUser(admin, supabaseUrl, publishableKey, ownerBEmail);
    const recruiter = await confirmedUser(admin, supabaseUrl, publishableKey, recruiterEmail);
    const manager = await confirmedUser(admin, supabaseUrl, publishableKey, managerEmail);
    const reviewer = await confirmedUser(admin, supabaseUrl, publishableKey, reviewerEmail);

    const orgA = await createOrganization(ownerA, `Rubrics Org A ${suffix}`);
    await createOrganization(ownerB, `Rubrics Org B ${suffix}`);
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

    const competency = await ownerA.rpc("create_competency", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_name: "Systems design",
      p_description: "Designs reliable job-relevant systems.",
      p_weight: 100,
      p_position: 0,
    });
    expect(competency.error).toBeNull();
    expect(typeof competency.data).toBe("string");
    if (typeof competency.data !== "string") throw new Error("Missing competency id.");
    const competencyId = competency.data;

    const ownerSave = await ownerA.rpc("save_competency_rubric", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_competency_id: competencyId,
      ...completeRubric,
    });
    expect(ownerSave.error).toBeNull();

    const ownerVisible = await ownerA
      .from("competency_rubrics")
      .select("score_level,definition")
      .eq("organization_id", orgA)
      .eq("job_id", jobId)
      .eq("competency_id", competencyId)
      .order("score_level", { ascending: true });
    expect(ownerVisible.error).toBeNull();
    expect(ownerVisible.data).toEqual([
      { score_level: 1, definition: completeRubric.p_level_1 },
      { score_level: 2, definition: completeRubric.p_level_2 },
      { score_level: 3, definition: completeRubric.p_level_3 },
      { score_level: 4, definition: completeRubric.p_level_4 },
      { score_level: 5, definition: completeRubric.p_level_5 },
    ]);

    const incomplete = await ownerA.rpc("save_competency_rubric", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_competency_id: competencyId,
      ...completeRubric,
      p_level_3: "   ",
    });
    expect(incomplete.error).not.toBeNull();

    const afterRejectedSave = await ownerA
      .from("competency_rubrics")
      .select("score_level,definition")
      .eq("competency_id", competencyId)
      .order("score_level", { ascending: true });
    expect(afterRejectedSave.error).toBeNull();
    expect(afterRejectedSave.data).toEqual(ownerVisible.data);

    const recruiterSave = await recruiter.rpc("save_competency_rubric", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_competency_id: competencyId,
      ...completeRubric,
      p_level_5: "Produces independently verifiable evidence and explains the tradeoffs clearly.",
    });
    expect(recruiterSave.error).toBeNull();

    const managerSave = await manager.rpc("save_competency_rubric", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_competency_id: competencyId,
      ...completeRubric,
    });
    expect(managerSave.error).toBeNull();

    const reviewerSave = await reviewer.rpc("save_competency_rubric", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_competency_id: competencyId,
      ...completeRubric,
    });
    expect(reviewerSave.error).not.toBeNull();

    const crossTenantSave = await ownerB.rpc("save_competency_rubric", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_competency_id: competencyId,
      ...completeRubric,
    });
    expect(crossTenantSave.error).not.toBeNull();

    const ownerBCrossRead = await ownerB
      .from("competency_rubrics")
      .select("id")
      .eq("organization_id", orgA);
    expect(ownerBCrossRead.error).toBeNull();
    expect(ownerBCrossRead.data).toEqual([]);

    const anonRead = await anon.from("competency_rubrics").select("id");
    expect(anonRead.data ?? []).toEqual([]);
  });
});
