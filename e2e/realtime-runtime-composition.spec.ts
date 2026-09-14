import { createHash, randomBytes } from "node:crypto";

import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "RealtimeRuntimeE2E-1234";

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
      "Realtime runtime E2E requires local Supabase URL, publishable key, and service role key.",
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
    p_name: `Realtime Runtime Org ${suffix}`,
    p_company_size: null,
    p_hiring_use_case: null,
  });
  expect(organization.error).toBeNull();
  if (typeof organization.data !== "string") throw new Error("Missing organization id.");

  const job = await actor.rpc("create_job", {
    p_organization_id: organization.data,
    p_title: `Realtime Runtime Engineer ${suffix}`,
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
    p_email: `runtime-${suffix}@example.test`,
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
    p_name: "Realtime Runtime Interviewer",
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

  return { rawToken, versionId: published.data, questionId: question.data };
}

test("production launcher composes the default browser runtime without a live provider secret", async ({
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
    `runtime-owner-${suffix}@example.test`,
  );
  const { rawToken, versionId, questionId } = await createInvitation(owner, admin, suffix);
  const syntheticCredential = "e2e-short-lived-credential";

  await page.addInitScript(() => {
    class FakeBufferSource {
      buffer: unknown = null;
      onended: (() => void) | null = null;
      connect() {}
      start() {
        queueMicrotask(() => this.onended?.());
      }
      stop() {}
      disconnect() {}
    }

    class FakeAudioContext {
      sampleRate = 16000;
      destination = {};
      audioWorklet = { addModule: async () => undefined };
      createMediaStreamSource() {
        return { connect() {}, disconnect() {} };
      }
      createBuffer(_channels: number, _length: number, sampleRate: number) {
        return { sampleRate, copyToChannel() {} };
      }
      createBufferSource() {
        return new FakeBufferSource();
      }
      close() {
        return Promise.resolve();
      }
    }

    class FakeAudioWorkletNode {
      port = { onmessage: null, postMessage() {} };
      connect() {}
      disconnect() {}
    }

    class FakeWebSocket {
      private listeners = new Map<string, Array<(event: { data?: string; reason?: string }) => void>>();
      constructor(public url: string) {
        queueMicrotask(() => this.emit("open", {}));
      }
      addEventListener(type: string, listener: (event: { data?: string; reason?: string }) => void) {
        const listeners = this.listeners.get(type) ?? [];
        listeners.push(listener);
        this.listeners.set(type, listeners);
      }
      send(value: string) {
        const message = JSON.parse(value) as { setup?: unknown };
        if (message.setup) {
          queueMicrotask(() =>
            this.emit("message", { data: JSON.stringify({ setupComplete: {} }) }),
          );
        }
      }
      close() {
        this.emit("close", { reason: "client-stop" });
      }
      private emit(type: string, event: { data?: string; reason?: string }) {
        for (const listener of this.listeners.get(type) ?? []) listener(event);
      }
    }

    Object.defineProperty(window, "AudioContext", { configurable: true, value: FakeAudioContext });
    Object.defineProperty(window, "AudioWorkletNode", {
      configurable: true,
      value: FakeAudioWorkletNode,
    });
    Object.defineProperty(window, "WebSocket", { configurable: true, value: FakeWebSocket });
    Object.defineProperty(navigator, "mediaDevices", {
      configurable: true,
      value: {
        getUserMedia: async () => {
          const track = { stop() {} };
          return {
            getAudioTracks: () => [track],
            getTracks: () => [track],
          };
        },
      },
    });
  });

  await page.route(`**/api/interview/${rawToken}/realtime-session`, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        status: "authorized",
        attemptId: "attempt-e2e-runtime",
        interviewerVersionId: versionId,
        durationSeconds: 1800,
        language: "English",
        interviewPlan: {
          versionId,
          sections: [
            {
              id: "technical",
              title: "Technical evidence",
              questions: [
                {
                  id: questionId,
                  prompt: "Describe a production system design decision you owned.",
                  required: true,
                  followUpLimit: 1,
                },
              ],
            },
          ],
        },
        providerCredential: {
          credential: syntheticCredential,
          expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        },
      }),
    });
  });

  await page.goto(`/interview/${rawToken}`);
  await page.getByRole("button", { name: "Start live interview" }).click();

  await expect(page.getByText("Technical evidence")).toBeVisible();
  await expect(
    page.getByText("Describe a production system design decision you owned."),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Mute microphone" })).toBeVisible();
  await expect(page.getByText(syntheticCredential)).toHaveCount(0);

  await page.getByRole("button", { name: "Mute microphone" }).click();
  await expect(page.getByRole("button", { name: "Unmute microphone" })).toBeVisible();

  await page.getByRole("button", { name: "End interview" }).click();
  await expect(page.getByRole("status")).toContainText("Interview ended");
  await expect(page.getByText(syntheticCredential)).toHaveCount(0);
});
