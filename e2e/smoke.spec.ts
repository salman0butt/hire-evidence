import { expect, test } from "@playwright/test";

test("marketing page exposes the product position, human boundary, and signup path", async ({ page }) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: /create structured ai interviews once\. interview candidates anytime\./i,
    }),
  ).toBeVisible();
  await expect(page.getByText(/humans make hiring decisions/i).first()).toBeVisible();
  await expect(page.getByRole("link", { name: /create your first interviewer/i }).first()).toHaveAttribute(
    "href",
    "/auth/signup",
  );
});

test("health endpoint reports only M00 service status", async ({ request }) => {
  const response = await request.get("/api/health");
  expect(response.status()).toBe(200);
  await expect(response.json()).resolves.toEqual({ status: "ok", service: "hire-evidence", milestone: "M00" });
});
