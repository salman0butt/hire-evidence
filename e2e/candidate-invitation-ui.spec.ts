import { createHash, randomBytes } from "node:crypto";

import { expect, test, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "CandidateInvitationUiTest-1234";

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
      "Candidate invitation UI E2E requires local Supabase URL, publishable key, and service role key.",
    );
  }
  return { supabaseUrl, publishableKey, serviceRoleKey };
}

function createRawToken() {
  const token = randomBytes(32).toString("base64url");
  return {
    token,
    tokenHash: createHash("sha256").update(token, "utf8").digest("hex"),
  };
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
    p_email: `candidate-ui-${suffix}@example.test`,
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

async function insertInvitation(
  admin: TestClient,
  input: {
    organizationId: string;
    jobId: string;
    candidateId: string;
    versionId: string;
    tokenHash: string;
    expiresAt: string;
    createdAt?: string;
  },
) {
  const inserted = await admin
    .from("candidate_invitations")
    .insert({
      organization_id: input.organizationId,
      job_id: input.jobId,
      candidate_id: input.candidateId,
      interviewer_version_id: input.versionId,
      token_hash: input.tokenHash,
      expires_at: input.expiresAt,
      ...(input.createdAt ? { created_at: input.createdAt } : {}),
    })
    .select("id")
    .single();
  expect(inserted.error).toBeNull();
  if (!inserted.data?.id) throw new Error("Missing invitation id.");
  return inserted.data.id;
}

async function expectInvitationUnavailable(page: Page, token: string) {
  await page.goto(`/interview/${token}`);
  await expect(page.getByRole("heading", { name: "Invitation unavailable" })).toBeVisible();
  await expect(page.getByText("This interview invitation is invalid or no longer available.")).toBeVisible();
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

test.describe("candidate invitation browser security and accessibility", () => {
  test.describe.configure({ mode: "serial" });

  test("renders one safe invitation, records consent, and fails closed for unusable tokens", async ({
    page,
  }) => {
    test.setTimeout(120_000);
    const { supabaseUrl, publishableKey, serviceRoleKey } = environment();
    const admin = client(supabaseUrl, serviceRoleKey);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const owner = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      `candidate-ui-owner-${suffix}@example.test`,
    );

    const organizationName = `Candidate UI Org ${suffix}`;
    const jobTitle = `Platform Engineer ${suffix}`;
    const organizationId = await createOrganization(owner, organizationName);
    const jobId = await createJob(owner, organizationId, jobTitle);
    const candidateId = await createCandidate(owner, organizationId, jobId, suffix);
    const versionId = await createPublishedVersion(owner, organizationId, jobId);

    const supportUpdate = await admin
      .from("organizations")
      .update({
        candidate_support_email: "interview-support@example.test",
        candidate_support_url: "https://example.test/interview-support",
      })
      .eq("id", organizationId);
    expect(supportUpdate.error).toBeNull();

    const active = createRawToken();
    const activeInvitationId = await insertInvitation(admin, {
      organizationId,
      jobId,
      candidateId,
      versionId,
      tokenHash: active.tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
    const sent = await owner.rpc("transition_candidate_invitation", {
      invitation_id: activeInvitationId,
      target_state: "sent",
    });
    expect(sent.error).toBeNull();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/interview/${active.token}`);
    await expect(page.getByRole("heading", { name: `${jobTitle} interview` })).toBeVisible();
    await expect(page.getByText(organizationName, { exact: true })).toBeVisible();
    await expect(page.getByText("30 minutes", { exact: true })).toBeVisible();
    await expect(page.getByText("Technical", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "AI and privacy disclosures" })).toBeVisible();
    await expect(page.getByText("Transcription", { exact: true })).toBeVisible();
    await expect(page.getByText("Data processing", { exact: true })).toBeVisible();
    await expect(page.getByText("Retention", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Accommodation or interview support" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Email interview support" })).toHaveAttribute(
      "href",
      "mailto:interview-support@example.test",
    );
    await expect(page.getByRole("link", { name: "Visit interview support" })).toHaveAttribute(
      "href",
      "https://example.test/interview-support",
    );
    await expectNoHorizontalOverflow(page);

    const consent = page.getByRole("checkbox");
    const recordConsent = page.getByRole("button", { name: "Record consent" });
    await consent.focus();
    await page.keyboard.press("Tab");
    await expect(recordConsent).toBeFocused();
    await consent.check();
    await recordConsent.click();
    await expect(page.getByRole("status")).toContainText("Consent recorded.");

    const opened = await owner.rpc("transition_candidate_invitation", {
      invitation_id: activeInvitationId,
      target_state: "opened",
    });
    expect(opened.error).toBeNull();
    const started = await owner.rpc("transition_candidate_invitation", {
      invitation_id: activeInvitationId,
      target_state: "started",
    });
    expect(started.error).toBeNull();
    const completed = await owner.rpc("transition_candidate_invitation", {
      invitation_id: activeInvitationId,
      target_state: "completed",
    });
    expect(completed.error).toBeNull();
    await expectInvitationUnavailable(page, active.token);

    await expectInvitationUnavailable(page, createRawToken().token);

    const expired = createRawToken();
    await insertInvitation(admin, {
      organizationId,
      jobId,
      candidateId,
      versionId,
      tokenHash: expired.tokenHash,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    });
    await expectInvitationUnavailable(page, expired.token);

    const revoked = createRawToken();
    const revokedInvitationId = await insertInvitation(admin, {
      organizationId,
      jobId,
      candidateId,
      versionId,
      tokenHash: revoked.tokenHash,
      expiresAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    });
    const revokedSent = await owner.rpc("transition_candidate_invitation", {
      invitation_id: revokedInvitationId,
      target_state: "sent",
    });
    expect(revokedSent.error).toBeNull();
    const revokedUpdate = await admin
      .from("candidate_invitations")
      .update({ revoked_at: new Date().toISOString() })
      .eq("id", revokedInvitationId);
    expect(revokedUpdate.error).toBeNull();
    await expectInvitationUnavailable(page, revoked.token);
  });
});
