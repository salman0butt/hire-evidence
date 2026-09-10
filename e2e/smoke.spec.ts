import { expect, test } from "@playwright/test";

test("foundation page exposes the product and human-decision boundary", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "Hire Evidence" })).toBeVisible();
  await expect(page.getByText(/humans make hiring decisions/i)).toBeVisible();
});

test("health endpoint reports only M00 service status", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toEqual({ status: "ok", service: "hire-evidence", milestone: "M00" });
});
