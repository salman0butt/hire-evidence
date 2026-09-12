import { expect, test, type Page } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "BuilderBrowserTest-1234";

function localEnvironment() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!supabaseUrl || !publishableKey) {
    throw new Error("Builder browser E2E requires local Supabase URL and publishable key.");
  }
  return { supabaseUrl, publishableKey };
}

async function readLatestMailpitMessageId(recipient: string): Promise<string> {
  const response = await fetch("http://127.0.0.1:54324/api/v1/messages");
  expect(response.ok).toBe(true);
  const payload = (await response.json()) as {
    messages: Array<{ ID: string; To: Array<{ Address: string }> }>;
  };
  const message = payload.messages.find((item) =>
    item.To.some((to) => to.Address === recipient),
  );
  expect(message).toBeTruthy();
  if (!message) throw new Error("Missing confirmation email.");
  return message.ID;
}

async function readConfirmationUrl(messageId: string): Promise<string> {
  const response = await fetch(`http://127.0.0.1:54324/api/v1/message/${messageId}`);
  expect(response.ok).toBe(true);
  const payload = (await response.json()) as { Text: string; HTML: string };
  const body = `${payload.Text}\n${payload.HTML}`;
  const match = body.match(/https?:\/\/[^\s"'<>]+\/auth\/v1\/verify[^\s"'<>]+/);
  expect(match?.[0]).toBeTruthy();
  if (!match?.[0]) throw new Error("Missing confirmation URL.");
  return match[0].replaceAll("&amp;", "&");
}

async function signUpAndCreateOrganization(page: Page, suffix: string) {
  const email = `builder-ui-${suffix}@example.com`;

  await page.goto("/signup");
  await page.getByLabel("Full name").fill("Builder Owner");
  await page.getByLabel("Work email").fill(email);
  await page.getByLabel("Password", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Confirm password").fill(PASSWORD);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page).toHaveURL(/\/verify-email/);

  const messageId = await readLatestMailpitMessageId(email);
  const confirmationUrl = await readConfirmationUrl(messageId);
  const confirmationResponse = await page.request.get(confirmationUrl, { maxRedirects: 0 });
  expect(confirmationResponse.status()).toBeGreaterThanOrEqual(300);
  expect(confirmationResponse.status()).toBeLessThan(400);

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(PASSWORD);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/app(?:\/organizations)?$/);

  await page.getByRole("link", { name: "Create organization" }).click();
  await page.getByLabel("Organization name").fill(`Builder Org ${suffix}`);
  await page.getByRole("button", { name: "Create organization" }).click();
  await expect(page).toHaveURL(/\/app\/o\/[^/]+$/);

  const organizationId = page.url().match(/\/app\/o\/([^/]+)$/)?.[1];
  expect(organizationId).toBeTruthy();
  if (!organizationId) throw new Error("Missing organization id.");

  return { email, organizationId };
}

async function expectNoHorizontalOverflow(page: Page) {
  const sizes = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(sizes.scrollWidth).toBeLessThanOrEqual(sizes.clientWidth + 1);
}

test.describe("interviewer builder browser closeout", () => {
  test("authors, publishes, reads, previews, and remains keyboard/mobile usable", async ({ page }) => {
    test.setTimeout(180_000);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const { email, organizationId } = await signUpAndCreateOrganization(page, suffix);
    const title = `Evidence Engineer ${suffix}`;
    const competency = `Systems design ${suffix}`;
    const question = `Describe a production design decision ${suffix}.`;

    await page.goto(`/app/o/${organizationId}/jobs/new`);
    await page.getByLabel("Job title").fill(title);
    await page.getByLabel("Department").fill("Engineering");
    await page.getByLabel("Description", { exact: true }).fill("Build reliable evidence-backed systems.");
    await page.getByLabel("Responsibilities").fill("Design and verify production services.");
    await page.getByLabel("Seniority").fill("Senior");
    await page.getByLabel("Employment type").fill("Full-time");
    await page.getByLabel("Location").fill("Remote");
    await page.getByLabel("Must-have requirements").fill("TypeScript\nProduction debugging");
    await page.getByLabel("Nice-to-have requirements").fill("PostgreSQL");
    await page.getByLabel("Interview instructions").fill("Assess only job-related evidence with human review.");
    await page.getByRole("button", { name: "Create job" }).click();
    await expect(page.getByRole("status")).toContainText("Job created.");

    await page.goto(`/app/o/${organizationId}/jobs`);
    await page.getByRole("link", { name: `Edit ${title}` }).click();
    const jobUrl = page.url();
    const jobId = jobUrl.match(/\/jobs\/([^/?#]+)$/)?.[1];
    expect(jobId).toBeTruthy();
    if (!jobId) throw new Error("Missing job id.");

    await page.getByLabel("Competency name").fill(competency);
    await page.getByLabel("Weight").fill("100");
    await page.getByRole("button", { name: "Add competency" }).click();
    await expect(page.getByRole("status")).toContainText("Competency created.");
    await page.reload();

    for (const level of [1, 2, 3, 4, 5]) {
      await page
        .getByLabel(`${competency} score ${level}`)
        .fill(`Observable level ${level} evidence for the role with concrete verification.`);
    }
    await page.getByRole("button", { name: `Save ${competency} rubric` }).click();
    await expect(page.getByRole("status")).toContainText("Rubric saved.");
    await page.reload();

    await page.getByLabel("Question text").fill(question);
    await page.getByLabel("Expected areas").fill("constraints\ntradeoffs\nverification");
    await page.getByLabel("Follow-up hints").fill("Ask for concrete evidence.");
    await page.getByLabel("Maximum duration in seconds").fill("600");
    await page.getByRole("button", { name: "Add question" }).click();
    await expect(page.getByRole("status")).toContainText("Question added.");
    await page.reload();

    await page.getByLabel("Section 1 purpose").fill("Technical evidence");
    await page.getByLabel("Section 1 duration in seconds").fill("1800");
    await page.getByLabel(question).check();
    await page.getByLabel(competency).check();
    await page.getByRole("button", { name: "Save interview plan" }).click();
    await expect(page.getByRole("status")).toContainText("Interview plan saved.");
    await page.reload();

    await page.getByLabel("Internal interviewer name").fill(`Technical interviewer ${suffix}`);
    await page.getByLabel("Duration in seconds").fill("1800");
    await page.getByLabel("Interview guidelines").fill("Ask neutral job-related questions and request concrete evidence.");
    await page.getByLabel("Candidate instructions").fill("Explain your reasoning with concrete examples.");
    await page.getByLabel("Clarify ambiguity").check();
    await page.getByRole("button", { name: "Save interviewer configuration" }).click();
    await expect(page.getByRole("status")).toContainText("Interviewer configuration saved.");
    await page.reload();

    await expect(page.getByRole("button", { name: "Publish interviewer configuration" })).toBeVisible();
    await page.getByRole("button", { name: "Publish interviewer configuration" }).click();
    await expect(page.getByRole("status")).toContainText("Interviewer configuration published.");
    await page.reload();
    await expect(page.getByText("Status: Published")).toBeVisible();

    await page.getByRole("button", { name: "Generate simulated preview" }).click();
    await expect(page.getByText("Non-billable", { exact: true })).toBeVisible();
    await expect(page.getByText("Not persisted", { exact: true })).toBeVisible();
    await expect(page.getByText(title, { exact: true })).toBeVisible();

    const { supabaseUrl, publishableKey } = localEnvironment();
    const actor = createClient(supabaseUrl, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const signedIn = await actor.auth.signInWithPassword({ email, password: PASSWORD });
    expect(signedIn.error).toBeNull();
    const versionRead = await actor
      .from("interviewer_versions")
      .select("id,version_number,snapshot")
      .eq("organization_id", organizationId)
      .eq("job_id", jobId)
      .single();
    expect(versionRead.error).toBeNull();
    expect(versionRead.data?.version_number).toBe(1);
    expect(versionRead.data?.snapshot).toMatchObject({ job: { id: jobId } });

    await page.setViewportSize({ width: 1280, height: 900 });
    await expectNoHorizontalOverflow(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await expectNoHorizontalOverflow(page);

    const titleInput = page.getByLabel("Job title");
    await titleInput.focus();
    await expect(titleInput).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByLabel("Department")).toBeFocused();

    await expect(page.getByRole("heading", { name: "Competencies" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Question bank" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Interview plan" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Interviewer configuration" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Publication" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Simulated interviewer preview" })).toBeVisible();
  });
});
