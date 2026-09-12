import { createHash, randomBytes } from "node:crypto";

import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "CandidateInvitationTest-1234";

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
      "Candidate invitation E2E requires local Supabase URL, publishable key, and service role key.",
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

  const actor = client(supabaseUrl, publishableKey);
  const signedIn = await actor.auth.signInWithPassword({ email, password: PASSWORD });
  expect(signedIn.error).toBeNull();
  return actor;
}

async function createOrganization(actor: TestClient, name: string) {
  const result = await actor.rpc("create_organization", {
    p_name: name,
    p_company_size: null,
    p_hiring_use_case: null,
  });
  expect(result.error).toBeNull();
  if (typeof result.data !== "string") throw new Error("Missing organization id.");
  return result.data;
}

async function createJob(actor: TestClient, organizationId: string, title: string) {
  const result = await actor.rpc("create_job", {
    p_organization_id: organizationId,
    p_title: title,
    p_department: "Engineering",
    p_description: "Build reliable evidence-backed systems.",
    p_responsibilities: "Own secure production services.",
    p_seniority: "Senior",
    p_employment_type: "Full-time",
    p_location: "Remote",
    p_salary_range: null,
    p_interview_instructions: "Assess only job-related evidence.",
    p_requirements: [{ kind: "must_have", requirement: "TypeScript" }],
  });
  expect(result.error).toBeNull();
  if (typeof result.data !== "string") throw new Error("Missing job id.");
  return result.data;
}

async function createCandidate(
  actor: TestClient,
  organizationId: string,
  jobId: string,
  suffix: string,
) {
  const result = await actor.rpc("create_candidate", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_full_name: `Candidate ${suffix}`,
    p_email: `candidate-${suffix}@example.test`,
  });
  expect(result.error).toBeNull();
  if (typeof result.data !== "string") throw new Error("Missing candidate id.");
  return result.data;
}

async function createPublishedVersion(
  actor: TestClient,
  organizationId: string,
  jobId: string,
) {
  const competency = await actor.rpc("create_competency", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_name: "Systems design",
    p_description: "Designs reliable job-relevant systems.",
    p_weight: 100,
    p_position: 0,
  });
  expect(competency.error).toBeNull();
  if (typeof competency.data !== "string") throw new Error("Missing competency id.");

  const rubric = await actor.rpc("save_competency_rubric", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_competency_id: competency.data,
    p_level_1: "Cannot identify a relevant design constraint.",
    p_level_2: "Identifies constraints with limited supporting evidence.",
    p_level_3: "Explains a sound design with concrete job-related evidence.",
    p_level_4: "Compares alternatives using measurable tradeoffs.",
    p_level_5: "Anticipates failure modes and validates measurable tradeoffs.",
  });
  expect(rubric.error).toBeNull();

  const question = await actor.rpc("create_question", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_competency_id: competency.data,
    p_question_text: "Describe a production system design decision you owned.",
    p_difficulty: "medium",
    p_expected_areas: ["constraints", "tradeoffs", "verification"],
    p_follow_up_hints: ["Ask for concrete evidence."],
    p_max_duration_seconds: 600,
    p_is_required: true,
    p_position: 0,
  });
  expect(question.error).toBeNull();
  if (typeof question.data !== "string") throw new Error("Missing question id.");

  const plan = await actor.rpc("save_interview_plan", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_total_duration_seconds: 1800,
    p_sections: [
      {
        purpose: "Technical evidence",
        durationSeconds: 1800,
        position: 0,
        questionIds: [question.data],
        competencyIds: [competency.data],
      },
    ],
  });
  expect(plan.error).toBeNull();
  if (typeof plan.data !== "string") throw new Error("Missing plan id.");

  const config = await actor.rpc("save_interviewer_config", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_plan_id: plan.data,
    p_name: "Candidate Invitation Interviewer",
    p_interview_type: "technical",
    p_persona: "professional",
    p_language: "English",
    p_duration_seconds: 1800,
    p_difficulty: "medium",
    p_question_mode: "semi_adaptive",
    p_guidelines: "Ask neutral job-related questions and request evidence.",
    p_candidate_instructions: "Explain your reasoning with concrete examples.",
    p_max_follow_ups_per_question: 1,
    p_follow_up_reasons: ["clarify_ambiguity", "request_example"],
    p_config_id: null,
  });
  expect(config.error).toBeNull();
  if (typeof config.data !== "string") throw new Error("Missing config id.");

  const published = await actor.rpc("publish_interviewer_config", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_config_id: config.data,
  });
  expect(published.error).toBeNull();
  if (typeof published.data !== "string") throw new Error("Missing version id.");
  return published.data;
}

function tokenHash() {
  return createHash("sha256")
    .update(randomBytes(32).toString("base64url"))
    .digest("hex");
}

test.describe("provider-backed candidate invitation persistence", () => {
  test.describe.configure({ mode: "serial" });

  test("enforces token uniqueness, tenant binding, RLS, lifecycle authority, and browser write denial", async () => {
    test.setTimeout(120_000);
    const { supabaseUrl, publishableKey, serviceRoleKey } = environment();
    const admin = client(supabaseUrl, serviceRoleKey);
    const anon = client(supabaseUrl, publishableKey);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const ownerA = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      `candidate-invite-a-${suffix}@example.test`,
    );
    const ownerB = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      `candidate-invite-b-${suffix}@example.test`,
    );

    const orgA = await createOrganization(ownerA, `Invitation Org A ${suffix}`);
    const orgB = await createOrganization(ownerB, `Invitation Org B ${suffix}`);
    const jobA = await createJob(ownerA, orgA, "Invitation role A");
    const jobB = await createJob(ownerB, orgB, "Invitation role B");
    const candidateA = await createCandidate(ownerA, orgA, jobA, `a-${suffix}`);
    const candidateB = await createCandidate(ownerB, orgB, jobB, `b-${suffix}`);
    const versionA = await createPublishedVersion(ownerA, orgA, jobA);
    const versionB = await createPublishedVersion(ownerB, orgB, jobB);
    const hash = tokenHash();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000).toISOString();

    const inserted = await admin
      .from("candidate_invitations")
      .insert({
        organization_id: orgA,
        job_id: jobA,
        candidate_id: candidateA,
        interviewer_version_id: versionA,
        token_hash: hash,
        expires_at: expiresAt,
      })
      .select("id")
      .single();
    expect(inserted.error).toBeNull();
    if (!inserted.data?.id) throw new Error("Missing invitation id.");
    const invitationId = inserted.data.id;

    const duplicateHash = await admin.from("candidate_invitations").insert({
      organization_id: orgB,
      job_id: jobB,
      candidate_id: candidateB,
      interviewer_version_id: versionB,
      token_hash: hash,
      expires_at: expiresAt,
    });
    expect(duplicateHash.error).not.toBeNull();

    const crossTenantCandidate = await admin.from("candidate_invitations").insert({
      organization_id: orgA,
      job_id: jobA,
      candidate_id: candidateB,
      interviewer_version_id: versionA,
      token_hash: tokenHash(),
      expires_at: expiresAt,
    });
    expect(crossTenantCandidate.error).not.toBeNull();

    const crossTenantVersion = await admin.from("candidate_invitations").insert({
      organization_id: orgA,
      job_id: jobA,
      candidate_id: candidateA,
      interviewer_version_id: versionB,
      token_hash: tokenHash(),
      expires_at: expiresAt,
    });
    expect(crossTenantVersion.error).not.toBeNull();

    const ownerAVisible = await ownerA
      .from("candidate_invitations")
      .select("id,organization_id,job_id")
      .eq("organization_id", orgA);
    expect(ownerAVisible.error).toBeNull();
    expect(ownerAVisible.data).toHaveLength(1);
    expect(ownerAVisible.data?.[0]).toMatchObject({ organization_id: orgA, job_id: jobA });

    const ownerBCrossRead = await ownerB
      .from("candidate_invitations")
      .select("id")
      .eq("organization_id", orgA);
    expect(ownerBCrossRead.error).toBeNull();
    expect(ownerBCrossRead.data).toEqual([]);

    const crossTenantTransition = await ownerB.rpc("transition_candidate_invitation", {
      invitation_id: invitationId,
      target_state: "sent",
    });
    expect(crossTenantTransition.error).not.toBeNull();

    const outOfOrder = await ownerA.rpc("transition_candidate_invitation", {
      invitation_id: invitationId,
      target_state: "opened",
    });
    expect(outOfOrder.error).not.toBeNull();

    for (const targetState of ["sent", "opened", "started", "completed"] as const) {
      const transition = await ownerA.rpc("transition_candidate_invitation", {
        invitation_id: invitationId,
        target_state: targetState,
      });
      expect(transition.error).toBeNull();
    }

    const replayCompleted = await ownerA.rpc("transition_candidate_invitation", {
      invitation_id: invitationId,
      target_state: "started",
    });
    expect(replayCompleted.error).not.toBeNull();

    const completed = await ownerA
      .from("candidate_invitations")
      .select("state,sent_at,opened_at,started_at,completed_at")
      .eq("id", invitationId)
      .single();
    expect(completed.error).toBeNull();
    expect(completed.data?.state).toBe("completed");
    expect(completed.data?.sent_at).toBeTruthy();
    expect(completed.data?.opened_at).toBeTruthy();
    expect(completed.data?.started_at).toBeTruthy();
    expect(completed.data?.completed_at).toBeTruthy();

    const revokedInvitation = await admin
      .from("candidate_invitations")
      .insert({
        organization_id: orgA,
        job_id: jobA,
        candidate_id: candidateA,
        interviewer_version_id: versionA,
        token_hash: tokenHash(),
        expires_at: expiresAt,
        revoked_at: new Date().toISOString(),
      })
      .select("id")
      .single();
    expect(revokedInvitation.error).toBeNull();
    if (!revokedInvitation.data?.id) throw new Error("Missing revoked invitation id.");
    const revokedTransition = await ownerA.rpc("transition_candidate_invitation", {
      invitation_id: revokedInvitation.data.id,
      target_state: "sent",
    });
    expect(revokedTransition.error).not.toBeNull();

    const expiredInvitation = await admin
      .from("candidate_invitations")
      .insert({
        organization_id: orgA,
        job_id: jobA,
        candidate_id: candidateA,
        interviewer_version_id: versionA,
        token_hash: tokenHash(),
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        expires_at: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
      })
      .select("id")
      .single();
    expect(expiredInvitation.error).toBeNull();
    if (!expiredInvitation.data?.id) throw new Error("Missing expired invitation id.");
    const expiredTransition = await ownerA.rpc("transition_candidate_invitation", {
      invitation_id: expiredInvitation.data.id,
      target_state: "sent",
    });
    expect(expiredTransition.error).not.toBeNull();

    const directBrowserWrite = await ownerA.from("candidate_invitations").insert({
      organization_id: orgA,
      job_id: jobA,
      candidate_id: candidateA,
      interviewer_version_id: versionA,
      token_hash: tokenHash(),
      expires_at: expiresAt,
    });
    expect(directBrowserWrite.error).not.toBeNull();

    const anonRead = await anon.from("candidate_invitations").select("id");
    expect(anonRead.data ?? []).toEqual([]);
  });
});
