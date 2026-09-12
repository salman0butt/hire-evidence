import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "InterviewerPublishingTest-1234";

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
      "Interviewer publishing E2E requires local Supabase URL, publishable key, and service role key.",
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
  const result = await actor.rpc("create_job", {
    p_organization_id: organizationId,
    p_title: "Evidence Platform Engineer",
    p_department: "Engineering",
    p_description: "Build reliable evidence-backed hiring infrastructure.",
    p_responsibilities: "Design and verify production services.",
    p_seniority: "Senior",
    p_employment_type: "Full-time",
    p_location: "Remote",
    p_salary_range: null,
    p_interview_instructions: "Assess only job-related evidence.",
    p_requirements: [{ kind: "must_have", requirement: "TypeScript" }],
  });
  expect(result.error).toBeNull();
  expect(typeof result.data).toBe("string");
  if (typeof result.data !== "string") throw new Error("Missing job id.");
  return result.data;
}

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

  const rubric = await actor.rpc("save_competency_rubric", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_competency_id: competency.data,
    p_level_1: "Cannot identify a relevant design constraint.",
    p_level_2: "Identifies constraints with limited supporting evidence.",
    p_level_3: "Explains a sound design with concrete job-related evidence.",
    p_level_4: "Compares alternatives using measurable tradeoffs.",
    p_level_5: "Anticipates failure modes and validates tradeoffs with measurable evidence.",
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
  expect(typeof question.data).toBe("string");
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
  expect(typeof plan.data).toBe("string");
  if (typeof plan.data !== "string") throw new Error("Missing plan id.");
  return plan.data;
}

async function createConfig(
  actor: TestClient,
  organizationId: string,
  jobId: string,
  planId: string,
) {
  const result = await actor.rpc("save_interviewer_config", {
    p_organization_id: organizationId,
    p_job_id: jobId,
    p_plan_id: planId,
    p_name: "Technical Evidence Interviewer",
    p_interview_type: "technical",
    p_persona: "professional",
    p_language: "English",
    p_duration_seconds: 1800,
    p_difficulty: "medium",
    p_question_mode: "semi_adaptive",
    p_guidelines: "Ask neutral, job-related questions and request concrete evidence.",
    p_candidate_instructions: "Explain your reasoning using concrete examples.",
    p_max_follow_ups_per_question: 1,
    p_follow_up_reasons: ["clarify_ambiguity", "request_example"],
    p_config_id: null,
  });
  expect(result.error).toBeNull();
  expect(typeof result.data).toBe("string");
  if (typeof result.data !== "string") throw new Error("Missing interviewer config id.");
  return result.data;
}

test.describe("provider-backed interviewer publishing and preview", () => {
  test.describe.configure({ mode: "serial" });

  test("publishes an immutable version, keeps preview non-billable, and enforces tenant/authz boundaries", async () => {
    test.setTimeout(120_000);
    const { supabaseUrl, publishableKey, serviceRoleKey } = environment();
    const admin = client(supabaseUrl, serviceRoleKey);
    const anon = client(supabaseUrl, publishableKey);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const ownerA = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      `publish-a-${suffix}@example.test`,
    );
    const ownerB = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      `publish-b-${suffix}@example.test`,
    );

    const orgA = await createOrganization(ownerA, `Publishing Org A ${suffix}`);
    await createOrganization(ownerB, `Publishing Org B ${suffix}`);
    const jobId = await createJob(ownerA, orgA);
    const planId = await createPlan(ownerA, orgA, jobId);
    const configId = await createConfig(ownerA, orgA, jobId, planId);

    const crossTenantPublish = await ownerB.rpc("publish_interviewer_config", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_config_id: configId,
    });
    expect(crossTenantPublish.error).not.toBeNull();

    const anonymousPublish = await anon.rpc("publish_interviewer_config", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_config_id: configId,
    });
    expect(anonymousPublish.error).not.toBeNull();

    const published = await ownerA.rpc("publish_interviewer_config", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_config_id: configId,
    });
    expect(published.error).toBeNull();
    expect(typeof published.data).toBe("string");
    if (typeof published.data !== "string") throw new Error("Missing version id.");
    const versionId = published.data;

    const configAfterPublish = await ownerA
      .from("interviewer_configs")
      .select("status,published_at")
      .eq("organization_id", orgA)
      .eq("job_id", jobId)
      .eq("id", configId)
      .single();
    expect(configAfterPublish.error).toBeNull();
    expect(configAfterPublish.data?.status).toBe("published");
    expect(configAfterPublish.data?.published_at).not.toBeNull();

    const version = await ownerA
      .from("interviewer_versions")
      .select("id,interviewer_config_id,version_number,snapshot,platform_prompt_version,guardrail_version")
      .eq("organization_id", orgA)
      .eq("job_id", jobId)
      .eq("id", versionId)
      .single();
    expect(version.error).toBeNull();
    expect(version.data?.interviewer_config_id).toBe(configId);
    expect(version.data?.version_number).toBe(1);
    expect(version.data?.platform_prompt_version).toBe("interviewer-runtime-v1");
    expect(version.data?.guardrail_version).toBe("hiring-guardrails-v1");
    expect(version.data?.snapshot).toMatchObject({
      job: { id: jobId },
      interviewer_config: { id: configId, status: "draft" },
    });

    const repeatedPublish = await ownerA.rpc("publish_interviewer_config", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_config_id: configId,
    });
    expect(repeatedPublish.error).toBeNull();
    expect(repeatedPublish.data).toBe(versionId);

    const immutableUpdate = await ownerA
      .from("interviewer_versions")
      .update({ version_number: 99 })
      .eq("id", versionId);
    expect(immutableUpdate.error).not.toBeNull();

    const immutableDelete = await ownerA
      .from("interviewer_versions")
      .delete()
      .eq("id", versionId);
    expect(immutableDelete.error).not.toBeNull();

    const preview = await ownerA.rpc("preview_interviewer_config", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_config_id: configId,
    });
    expect(preview.error).toBeNull();
    expect(preview.data).toMatchObject({
      mode: "preview",
      billable: false,
      persisted: false,
      platform_prompt_version: "interviewer-runtime-v1",
      guardrail_version: "hiring-guardrails-v1",
    });

    const versionsAfterPreview = await ownerA
      .from("interviewer_versions")
      .select("id")
      .eq("organization_id", orgA)
      .eq("job_id", jobId)
      .eq("interviewer_config_id", configId);
    expect(versionsAfterPreview.error).toBeNull();
    expect(versionsAfterPreview.data).toEqual([{ id: versionId }]);

    const crossTenantRead = await ownerB
      .from("interviewer_versions")
      .select("id")
      .eq("organization_id", orgA)
      .eq("job_id", jobId);
    expect(crossTenantRead.error).toBeNull();
    expect(crossTenantRead.data).toEqual([]);

    const crossTenantPreview = await ownerB.rpc("preview_interviewer_config", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_config_id: configId,
    });
    expect(crossTenantPreview.error).not.toBeNull();

    const anonymousVersions = await anon.from("interviewer_versions").select("id");
    expect(anonymousVersions.data ?? []).toEqual([]);

    const anonymousPreview = await anon.rpc("preview_interviewer_config", {
      p_organization_id: orgA,
      p_job_id: jobId,
      p_config_id: configId,
    });
    expect(anonymousPreview.error).not.toBeNull();
  });
});
