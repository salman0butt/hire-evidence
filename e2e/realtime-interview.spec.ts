import { createHash, randomBytes } from "node:crypto";

import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "RealtimeInterviewE2E-1234";

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
      "Realtime interview E2E requires local Supabase URL, publishable key, and service role key.",
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

async function createInvitation(actor: TestClient, admin: TestClient, suffix: string) {
  const organization = await actor.rpc("create_organization", {
    p_name: `Realtime E2E Org ${suffix}`,
    p_company_size: null,
    p_hiring_use_case: null,
  });
  expect(organization.error).toBeNull();
  if (typeof organization.data !== "string") throw new Error("Missing organization id.");

  const job = await actor.rpc("create_job", {
    p_organization_id: organization.data,
    p_title: `Realtime Platform Engineer ${suffix}`,
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
  expect(job.error).toBeNull();
  if (typeof job.data !== "string") throw new Error("Missing job id.");

  const candidate = await actor.rpc("create_candidate", {
    p_organization_id: organization.data,
    p_job_id: job.data,
    p_full_name: `Candidate ${suffix}`,
    p_email: `realtime-${suffix}@example.test`,
  });
  expect(candidate.error).toBeNull();
  if (typeof candidate.data !== "string") throw new Error("Missing candidate id.");

  const competency = await actor.rpc("create_competency", {
    p_organization_id: organization.data,
    p_job_id: job.data,
    p_name: "Systems design",
    p_description: "Designs reliable job-relevant systems.",
    p_weight: 100,
    p_position: 0,
  });
  expect(competency.error).toBeNull();
  if (typeof competency.data !== "string") throw new Error("Missing competency id.");

  const rubric = await actor.rpc("save_competency_rubric", {
    p_organization_id: organization.data,
    p_job_id: job.data,
    p_competency_id: competency.data,
    p_level_1: "Cannot identify a relevant design constraint.",
    p_level_2: "Identifies constraints with limited evidence.",
    p_level_3: "Explains a sound design with concrete job evidence.",
    p_level_4: "Compares alternatives using measurable tradeoffs.",
    p_level_5: "Anticipates failure modes and validates tradeoffs.",
  });
  expect(rubric.error).toBeNull();

  const question = await actor.rpc("create_question", {
    p_organization_id: organization.data,
    p_job_id: job.data,
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
    p_organization_id: organization.data,
    p_job_id: job.data,
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
    p_organization_id: organization.data,
    p_job_id: job.data,
    p_plan_id: plan.data,
    p_name: "Realtime E2E Interviewer",
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
    p_organization_id: organization.data,
    p_job_id: job.data,
    p_config_id: config.data,
  });
  expect(published.error).toBeNull();
  if (typeof published.data !== "string") throw new Error("Missing version id.");

  const rawToken = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(rawToken, "utf8").digest("hex");
  const invitation = await admin
    .from("candidate_invitations")
    .insert({
      organization_id: organization.data,
      job_id: job.data,
      candidate_id: candidate.data,
      interviewer_version_id: published.data,
      token_hash: tokenHash,
      expires_at: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
    })
    .select("id")
    .single();
  expect(invitation.error).toBeNull();
  if (!invitation.data?.id) throw new Error("Missing invitation id.");

  const sent = await actor.rpc("transition_candidate_invitation", {
    invitation_id: invitation.data.id,
    target_state: "sent",
  });
  expect(sent.error).toBeNull();

  return rawToken;
}

test.describe("realtime interview browser readiness", () => {
  test.describe.configure({ mode: "serial" });

  test("recovers from denied microphone access without starting recording", async ({ page }) => {
    test.setTimeout(120_000);
    const { supabaseUrl, publishableKey, serviceRoleKey } = environment();
    const admin = client(supabaseUrl, serviceRoleKey);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const owner = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      `realtime-owner-${suffix}@example.test`,
    );
    const token = await createInvitation(owner, admin, suffix);

    await page.addInitScript(() => {
      const runtime = window as typeof window & { __allowRealtimeMicrophone?: boolean };
      runtime.__allowRealtimeMicrophone = false;

      class ProbeAudioContext {
        audioWorklet = {};
        close() {
          return Promise.resolve();
        }
      }

      Object.defineProperty(window, "AudioContext", {
        configurable: true,
        value: ProbeAudioContext,
      });

      const fakeTrack = { readyState: "live", stop() {} };
      const mediaDevices = {
        enumerateDevices: async () => [
          { kind: "audioinput", deviceId: "mic-1", label: "Test microphone" },
        ],
        getUserMedia: async () => {
          if (!runtime.__allowRealtimeMicrophone) {
            const error = new Error("Permission denied");
            error.name = "NotAllowedError";
            throw error;
          }
          return {
            getAudioTracks: () => [fakeTrack],
            getTracks: () => [fakeTrack],
          };
        },
      };

      Object.defineProperty(navigator, "mediaDevices", {
        configurable: true,
        value: mediaDevices,
      });
    });

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(`/interview/${token}`);

    const runCheck = page.getByRole("button", { name: "Run microphone check" });
    await runCheck.focus();
    await expect(runCheck).toBeFocused();
    await runCheck.click();

    const microphoneAlert = page
      .getByRole("alert")
      .filter({ hasText: "Technical check needs attention" });
    await expect(microphoneAlert).toContainText("Microphone access is blocked");
    const retry = page.getByRole("button", { name: "Retry microphone check" });
    await expect(retry).toBeVisible();

    await page.evaluate(() => {
      (window as typeof window & { __allowRealtimeMicrophone?: boolean }).__allowRealtimeMicrophone = true;
    });
    await retry.click();

    await expect(page.getByRole("status")).toContainText("Ready for the microphone check.");
    await expect(page.getByLabel("Microphone")).toHaveValue("mic-1");
    await expect(page.getByText("No recording has started.")).toBeVisible();

    const dimensions = await page.evaluate(() => ({
      scrollWidth: document.documentElement.scrollWidth,
      clientWidth: document.documentElement.clientWidth,
    }));
    expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
  });
});
