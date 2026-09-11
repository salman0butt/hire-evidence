import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PROVIDER_TIMEOUT_MS = 30_000;

function requireProviderEnvironment() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const mailpitUrl = process.env.SUPABASE_MAILPIT_URL;

  if (!supabaseUrl || !publishableKey || !mailpitUrl) {
    throw new Error(
      "Provider-backed Supabase E2E requires NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, and SUPABASE_MAILPIT_URL.",
    );
  }

  return { supabaseUrl, publishableKey, mailpitUrl };
}

function decodeHtmlHref(value: string): string {
  return value.replaceAll("&amp;", "&").replaceAll("&#x2F;", "/");
}

async function waitForAuthLink(
  mailpitUrl: string,
  email: string,
  type: "email" | "recovery",
): Promise<string> {
  const deadline = Date.now() + PROVIDER_TIMEOUT_MS;
  const query = encodeURIComponent(`to:${email}`);
  const linkPattern = new RegExp(
    `href=["']([^"']*\\/auth\\/confirm\\?[^"']*type=${type}[^"']*)["']`,
    "i",
  );

  while (Date.now() < deadline) {
    const response = await fetch(`${mailpitUrl}/view/latest.html?query=${query}`);

    if (response.ok) {
      const html = await response.text();
      const match = linkPattern.exec(html);

      if (match?.[1]) {
        return decodeHtmlHref(match[1]);
      }
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  throw new Error(`Timed out waiting for Supabase ${type} email for ${email}.`);
}

async function signupAndConfirm(
  page: Parameters<typeof test>[0] extends never ? never : import("@playwright/test").Page,
  email: string,
  password: string,
  mailpitUrl: string,
) {
  await page.goto("/auth/signup");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Create account" }).click();
  await expect(page.getByRole("status")).toContainText("Check your email");

  const confirmationLink = await waitForAuthLink(mailpitUrl, email, "email");
  await page.goto(confirmationLink);
  await expect(page).toHaveURL(/\/app$/);

  return confirmationLink;
}

test.describe("provider-backed Supabase auth and profile isolation", () => {
  test.describe.configure({ mode: "serial" });

  test("completes auth lifecycle and proves two-user RLS isolation", async ({ page }) => {
    test.setTimeout(120_000);

    const { supabaseUrl, publishableKey, mailpitUrl } = requireProviderEnvironment();
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const userAEmail = `m01-a-${suffix}@example.test`;
    const userBEmail = `m01-b-${suffix}@example.test`;
    const initialPassword = "ProviderTest-1234";
    const updatedPassword = "ProviderTest-5678";

    const userAConfirmationLink = await signupAndConfirm(
      page,
      userAEmail,
      initialPassword,
      mailpitUrl,
    );

    await page.goto("/app/profile");
    await page.getByLabel("Display name").fill("User A");
    await page.getByRole("button", { name: "Save profile" }).click();
    await expect(page.getByRole("status")).toContainText("Profile saved");
    await page.reload();
    await expect(page.getByLabel("Display name")).toHaveValue("User A");

    await page.getByRole("button", { name: "Log out" }).click();
    await expect(page).toHaveURL(/\/auth\/login$/);

    await page.getByLabel("Email").fill(userAEmail);
    await page.getByLabel("Password").fill(initialPassword);
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/app$/);

    await page.goto("/auth/forgot-password");
    await page.getByLabel("Email").fill(userAEmail);
    await page.getByRole("button", { name: "Send reset link" }).click();
    await expect(page.getByRole("status")).toContainText(
      "If an account exists for that email",
    );

    const recoveryLink = await waitForAuthLink(mailpitUrl, userAEmail, "recovery");
    await page.goto(recoveryLink);
    await expect(page).toHaveURL(/\/auth\/reset-password$/);
    await page.getByLabel("New password").fill(updatedPassword);
    await page.getByRole("button", { name: "Update password" }).click();
    await expect(page).toHaveURL(/\/app$/);

    await page.getByRole("button", { name: "Log out" }).click();
    await page.getByLabel("Email").fill(userAEmail);
    await page.getByLabel("Password").fill(updatedPassword);
    await page.getByRole("button", { name: "Log in" }).click();
    await expect(page).toHaveURL(/\/app$/);

    await page.getByRole("button", { name: "Log out" }).click();
    await signupAndConfirm(page, userBEmail, initialPassword, mailpitUrl);
    await page.goto("/app/profile");
    await page.getByLabel("Display name").fill("User B");
    await page.getByRole("button", { name: "Save profile" }).click();
    await expect(page.getByRole("status")).toContainText("Profile saved");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload();
    const pageWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    const viewportWidth = await page.evaluate(() => document.documentElement.clientWidth);
    expect(pageWidth).toBeLessThanOrEqual(viewportWidth);
    await page.getByRole("link", { name: "Hire Evidence" }).focus();
    await expect(page.getByRole("link", { name: "Hire Evidence" })).toBeFocused();

    const userA = createClient(supabaseUrl, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const userB = createClient(supabaseUrl, publishableKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    const userASignIn = await userA.auth.signInWithPassword({
      email: userAEmail,
      password: updatedPassword,
    });
    const userBSignIn = await userB.auth.signInWithPassword({
      email: userBEmail,
      password: initialPassword,
    });

    expect(userASignIn.error).toBeNull();
    expect(userBSignIn.error).toBeNull();
    expect(userASignIn.data.user?.id).toBeTruthy();
    expect(userBSignIn.data.user?.id).toBeTruthy();

    const userAId = userASignIn.data.user!.id;
    const userBId = userBSignIn.data.user!.id;

    const userAOwn = await userA
      .from("profiles")
      .select("id,display_name")
      .eq("id", userAId)
      .single();
    const userBOwn = await userB
      .from("profiles")
      .select("id,display_name")
      .eq("id", userBId)
      .single();

    expect(userAOwn.error).toBeNull();
    expect(userAOwn.data).toEqual({ id: userAId, display_name: "User A" });
    expect(userBOwn.error).toBeNull();
    expect(userBOwn.data).toEqual({ id: userBId, display_name: "User B" });

    const userAReadsB = await userA
      .from("profiles")
      .select("id,display_name")
      .eq("id", userBId);
    const userBReadsA = await userB
      .from("profiles")
      .select("id,display_name")
      .eq("id", userAId);

    expect(userAReadsB.error).toBeNull();
    expect(userAReadsB.data).toEqual([]);
    expect(userBReadsA.error).toBeNull();
    expect(userBReadsA.data).toEqual([]);

    const userAUpdatesB = await userA
      .from("profiles")
      .update({ display_name: "Forged by A" })
      .eq("id", userBId)
      .select("id");
    const userBUpdatesA = await userB
      .from("profiles")
      .update({ display_name: "Forged by B" })
      .eq("id", userAId)
      .select("id");

    expect(userAUpdatesB.error).toBeNull();
    expect(userAUpdatesB.data).toEqual([]);
    expect(userBUpdatesA.error).toBeNull();
    expect(userBUpdatesA.data).toEqual([]);

    const userAAfter = await userA
      .from("profiles")
      .select("display_name")
      .eq("id", userAId)
      .single();
    const userBAfter = await userB
      .from("profiles")
      .select("display_name")
      .eq("id", userBId)
      .single();

    expect(userAAfter.data?.display_name).toBe("User A");
    expect(userBAfter.data?.display_name).toBe("User B");

    await page.goto(userAConfirmationLink);
    await expect(page).toHaveURL(/\/auth\/login\?error=verification$/);
    await expect(page.locator("body")).not.toContainText(/token_hash/i);
  });
});
