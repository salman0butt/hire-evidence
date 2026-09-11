import { expect, test, type Page } from "@playwright/test";

const PROVIDER_TIMEOUT_MS = 30_000;

function environment() {
  const mailpitUrl = process.env.SUPABASE_MAILPIT_URL;
  if (!mailpitUrl) {
    throw new Error("Organization UI E2E requires SUPABASE_MAILPIT_URL.");
  }
  return { mailpitUrl };
}

function decodeHtmlHref(value: string): string {
  return value.replaceAll("&amp;", "&").replaceAll("&#x2F;", "/");
}

async function waitForConfirmationLink(mailpitUrl: string, email: string) {
  const deadline = Date.now() + PROVIDER_TIMEOUT_MS;
  const query = encodeURIComponent(`to:${email}`);
  const linkPattern = /href=["']([^"']*\/auth\/confirm\?[^"']*type=email[^"']*)["']/i;

  while (Date.now() < deadline) {
    const response = await fetch(`${mailpitUrl}/view/latest.html?query=${query}`);
    if (response.ok) {
      const html = await response.text();
      const match = linkPattern.exec(html);
      if (match?.[1]) return decodeHtmlHref(match[1]);
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for confirmation email for ${email}.`);
}

async function signupAndConfirm(page: Page, email: string, mailpitUrl: string) {
  await page.goto("/auth/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill("OrganizationUiTest-1234");
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("status")).toContainText("Check your email");
  await page.goto(await waitForConfirmationLink(mailpitUrl, email));
  await expect(page).toHaveURL(/\/app$/);
}

async function expectNoHorizontalOverflow(page: Page) {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
}

test.describe("organization tenant UI accessibility and responsiveness", () => {
  test("supports keyboard navigation without overflow on desktop and mobile", async ({ page }) => {
    test.setTimeout(120_000);
    const { mailpitUrl } = environment();
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await signupAndConfirm(page, `org-ui-${suffix}@example.test`, mailpitUrl);

    await page.goto("/app/organizations/new");
    await page.getByLabel("Organization name").fill(`Keyboard Org ${suffix}`);
    await page.getByLabel("Company size").fill("11-50");
    await page.getByLabel("Hiring use case").fill("Accessible technical hiring");
    await page.getByRole("button", { name: "Create organization" }).click();
    await expect(page).toHaveURL(/\/app\/o\/[0-9a-f-]+$/i);

    const organizationUrl = page.url();
    const organizationId = organizationUrl.split("/").at(-1);
    if (!organizationId) throw new Error("Missing organization id in redirected URL.");

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.reload();
    await expect(page.getByRole("navigation", { name: "Organization navigation" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Overview" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Team" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Settings" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    await page.getByRole("link", { name: "Overview" }).focus();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Team" })).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(page.getByRole("link", { name: "Settings" })).toBeFocused();

    await page.goto(`/app/o/${organizationId}/team`);
    await expect(page.getByRole("heading", { name: "Team", exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Invite teammate" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const inviteEmail = page.getByLabel("Email");
    const inviteRole = page.getByLabel("Role");
    const inviteButton = page.getByRole("button", { name: "Create invitation link" });
    await inviteEmail.focus();
    await page.keyboard.press("Tab");
    await expect(inviteRole).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(inviteButton).toBeFocused();

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    await expectNoHorizontalOverflow(page);
    await inviteEmail.focus();
    await expect(inviteEmail).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(inviteRole).toBeFocused();

    await page.goto(`/app/o/${organizationId}/settings`);
    await expect(page.getByRole("heading", { name: "Organization settings" })).toBeVisible();
    await expectNoHorizontalOverflow(page);

    const name = page.getByLabel("Organization name");
    const companySize = page.getByLabel("Company size");
    const hiringUseCase = page.getByLabel("Hiring use case");
    const save = page.getByRole("button", { name: "Save settings" });
    await name.focus();
    await page.keyboard.press("Tab");
    await expect(companySize).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(hiringUseCase).toBeFocused();
    await page.keyboard.press("Tab");
    await expect(save).toBeFocused();

    await page.setViewportSize({ width: 1280, height: 900 });
    await page.reload();
    await expectNoHorizontalOverflow(page);
    await expect(page.getByLabel("Organization name")).toHaveValue(`Keyboard Org ${suffix}`);
    await expect(page.getByLabel("Company size")).toHaveValue("11-50");
    await expect(page.getByLabel("Hiring use case")).toHaveValue("Accessible technical hiring");
  });
});
