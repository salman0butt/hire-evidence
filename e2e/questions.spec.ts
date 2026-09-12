import { createHash, randomBytes } from "node:crypto";

import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "QuestionsTest-1234";
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
      "Question isolation E2E requires local Supabase URL, publishable key, and service role key.",
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
  p_title: "Question Test Engineer",
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

async function createQuestion(
  actor: TestClient,
  organizationId: string,
  jobId: string,
  competencyId: string,
  questionText: string,
  position: number,
) {
  return actor.rpc("create_question", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_competency_id: competencyId,
    p_question_text: questionText,
    p_difficulty: "medium",
    p_expected_areas: ["diagnosis", "verification"],
    p_follow_up_hints: ["Ask for concrete evidence."],
    p_max_duration_seconds: 300,
    p_is_required: true,
    p_position: position,
  });
}

test.describe("provider-backed question tenant isolation", () => {
  test.describe.configure({ mode: "serial" });

  test("binds questions to the route tenant, job, competency, and fixed-role authority", async () => {
    test.setTimeout(120_000);
    const { supabaseUrl, publishableKey, serviceRoleKey } = environment();
    const admin = client(supabaseUrl, serviceRoleKey);
    const anon = client(supabaseUrl, publishableKey);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const ownerAEmail = `questions-a-owner-${suffix}@example.test`;
    const ownerBEmail = `questions-b-owner-${suffix}@example.test`;
    const recruiterEmail = `questions-a-recruiter-${suffix}@example.test`;
    const managerEmail = `questions-a-manager-${suffix}@example.test`;
    const reviewerEmail = `questions-a-reviewer-${suffix}@example.test`;

    const ownerA = await confirmedUser(admin, supabaseUrl, publishableKey, ownerAEmail);
    const ownerB = await confirmedUser(admin, supabaseUrl, publishableKey, ownerBEmail);
    const recruiter = await confirmedUser(admin, supabaseUrl, publishableKey, recruiterEmail);
    const manager = await confirmedUser(admin, supabaseUrl, publishableKey, managerEmail);
    const reviewer = await confirmedUser(admin, supabaseUrl, publishableKey, reviewerEmail);

    const orgA = await createOrganization(ownerA, `Questions Org A ${suffix}`);
    await createOrganization(ownerB, `Questions Org B ${suffix}`);
    await addMember(ownerA, recruiter, orgA, recruiterEmail, "recruiter");
    await addMember(ownerA, manager, orgA, managerEmail, "hiring_manager");
    await addMember(ownerA, reviewer, orgA, reviewerEmail, "reviewer");

    const job = await ownerA.rpc("create_job", { p_organization_id: orgA, ...jobPayload });
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

    const recruiterCreated = await createQuestion(
      recruiter,
      orgA,
      jobId,
      competencyId,
      "Describe a difficult incident you diagnosed.",
      0,
    );
    expect(recruiterCreated.error).toBeNull();

    const managerCreated = await createQuestion(
      manager,
      orgA,
      jobId,
      competencyId,
      "How did you verify the remediation?",
      1,
    );
    expect(managerCreated.error).toBeNull();

    const ownerCreated = await createQuestion(
      ownerA,
      orgA,
      jobId,
      competencyId,
      "What tradeoffs did you make?",
      2,
    );
    expect(ownerCreated.error).toBeNull();

    const reviewerMutation = await createQuestion(
      reviewer,
      orgA,
      jobId,
      competencyId,
      "Reviewer-forged question",
      3,
    );
    expect(reviewerMutation.error).not.toBeNull();

    const crossTenantMutation = await createQuestion(
      ownerB,
      orgA,
      jobId,
      competencyId,
      "Cross-tenant question",
      3,
    );
    expect(crossTenantMutation.error).not.toBeNull();

    const otherJob = await ownerA.rpc("create_job", {
      p_organization_id: orgA,
      ...jobPayload,
      p_title: "Other Question Test Engineer",
    });
    expect(otherJob.error).toBeNull();
    expect(typeof otherJob.data).toBe("string");
    if (typeof otherJob.data !== "string") throw new Error("Missing other job id.");

    const mismatchedCompetency = await createQuestion(
      ownerA,
      orgA,
      otherJob.data,
      competencyId,
      "Question attached to the wrong job",
      0,
    );
    expect(mismatchedCompetency.error).not.toBeNull();

    const ownerVisible = await ownerA
      .from("questions")
      .select(
        "question_text,difficulty,expected_areas,follow_up_hints,max_duration_seconds,is_required,position",
      )
      .eq("organization_id", orgA)
      .eq("job_id", jobId)
      .order("position", { ascending: true });
    expect(ownerVisible.error).toBeNull();
    expect(ownerVisible.data?.map((question) => ({
      question_text: question.question_text,
      difficulty: question.difficulty,
      max_duration_seconds: question.max_duration_seconds,
      is_required: question.is_required,
      position: question.position,
    }))).toEqual([
      {
        question_text: "Describe a difficult incident you diagnosed.",
        difficulty: "medium",
        max_duration_seconds: 300,
        is_required: true,
        position: 0,
      },
      {
        question_text: "How did you verify the remediation?",
        difficulty: "medium",
        max_duration_seconds: 300,
        is_required: true,
        position: 1,
      },
      {
        question_text: "What tradeoffs did you make?",
        difficulty: "medium",
        max_duration_seconds: 300,
        is_required: true,
        position: 2,
      },
    ]);
    expect(ownerVisible.data?.[0]?.expected_areas).toEqual(["diagnosis", "verification"]);
    expect(ownerVisible.data?.[0]?.follow_up_hints).toEqual(["Ask for concrete evidence."]);

    const ownerBCrossRead = await ownerB
      .from("questions")
      .select("id")
      .eq("organization_id", orgA);
    expect(ownerBCrossRead.error).toBeNull();
    expect(ownerBCrossRead.data).toEqual([]);

    const anonRead = await anon.from("questions").select("id");
    expect(anonRead.data ?? []).toEqual([]);
  });
});
