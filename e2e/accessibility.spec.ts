import { expect, test } from "@playwright/test";

const mobileViewport = { width: 390, height: 844 } as const;

test("marketing page remains usable without horizontal overflow on a mobile viewport", async ({ page }) => {
  await page.setViewportSize(mobileViewport);
  await page.goto("/");

  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /create structured ai interviews once\. interview candidates anytime\./i,
    }),
  ).toBeVisible();
  const headerLogin = page.getByRole("banner").getByRole("link", { name: /^log in$/i });
  await expect(headerLogin).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(hasHorizontalOverflow).toBe(false);
});

test("marketing page exposes a visible keyboard focus path to authentication", async ({ page }) => {
  await page.goto("/");

  await page.keyboard.press("Tab");
  await expect(page.getByRole("link", { name: /hire evidence home/i })).toBeFocused();

  const headerLogin = page.getByRole("banner").getByRole("link", { name: /^log in$/i });
  let reachedLogin = false;
  for (let index = 0; index < 8; index += 1) {
    await page.keyboard.press("Tab");
    reachedLogin = await headerLogin.evaluate((element) => element === document.activeElement);
    if (reachedLogin) break;
  }

  expect(reachedLogin).toBe(true);
  await expect(headerLogin).toBeFocused();
});

test("login and signup pages expose labeled credential controls", async ({ page }) => {
  for (const route of ["/auth/login", "/auth/signup"] as const) {
    await page.goto(route);

    await expect(page.getByLabel(/email/i)).toBeVisible();
    await expect(page.getByLabel(/password/i)).toBeVisible();
    await expect(page.getByRole("button")).toBeVisible();
  }
});

test("mobile unauthenticated application entry preserves the internal return path", async ({ page }) => {
  await page.setViewportSize(mobileViewport);
  await page.goto("/app");

  await expect(page).toHaveURL(/\/auth\/login\?next=\/app$/);
  await expect(page.getByRole("heading", { name: /log in to hire evidence/i })).toBeVisible();

  const hasHorizontalOverflow = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
  );

  expect(hasHorizontalOverflow).toBe(false);
});
