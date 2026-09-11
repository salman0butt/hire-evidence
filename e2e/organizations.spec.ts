import { createHash, randomBytes } from "node:crypto";

import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "OrganizationsTest-1234";
const HOUR_MS = 60 * 60 * 1000;

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
      "Organization isolation E2E requires local Supabase URL, publishable key, and service role key.",
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
  const userId = created.data.user?.id;
  if (!userId) throw new Error(`Supabase did not create ${email}.`);

  const authenticated = client(supabaseUrl, publishableKey);
  const signedIn = await authenticated.auth.signInWithPassword({
    email,
    password: PASSWORD,
  });
  expect(signedIn.error).toBeNull();
  return { client: authenticated, userId };
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

function tokenHash() {
  const raw = randomBytes(32).toString("base64url");
  return createHash("sha256").update(raw, "utf8").digest("hex");
}

test.describe("provider-backed organization tenant isolation", () => {
  test.describe.configure({ mode: "serial" });

  test("isolates two organizations and enforces role-restricted writes", async () => {
    test.setTimeout(120_000);
    const { supabaseUrl, publishableKey, serviceRoleKey } = environment();
    const admin = client(supabaseUrl, serviceRoleKey);
    const anon = client(supabaseUrl, publishableKey);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    const ownerA = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      `org-a-owner-${suffix}@example.test`,
    );
    const ownerB = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      `org-b-owner-${suffix}@example.test`,
    );
    const recruiter = await confirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      `org-a-recruiter-${suffix}@example.test`,
    );

    const orgA = await createOrganization(ownerA.client, `Org A ${suffix}`);
    const orgB = await createOrganization(ownerB.client, `Org B ${suffix}`);

    const ownerAVisible = await ownerA.client
      .from("organizations")
      .select("id,name")
      .order("id");
    expect(ownerAVisible.error).toBeNull();
    expect(ownerAVisible.data?.map((row) => row.id)).toContain(orgA);
    expect(ownerAVisible.data?.map((row) => row.id)).not.toContain(orgB);

    const ownerBVisible = await ownerB.client.from("organizations").select("id");
    expect(ownerBVisible.error).toBeNull();
    expect(ownerBVisible.data?.map((row) => row.id)).toContain(orgB);
    expect(ownerBVisible.data?.map((row) => row.id)).not.toContain(orgA);

    const crossMemberships = await ownerA.client
      .from("organization_memberships")
      .select("user_id,role")
      .eq("organization_id", orgB);
    expect(crossMemberships.error).toBeNull();
    expect(crossMemberships.data).toEqual([]);

    const crossInvitations = await ownerA.client
      .from("organization_invitations")
      .select("id")
      .eq("organization_id", orgB);
    expect(crossInvitations.error).toBeNull();
    expect(crossInvitations.data).toEqual([]);

    const forgedCrossUpdate = await ownerA.client
      .from("organizations")
      .update({ name: "forged-cross-tenant-name" })
      .eq("id", orgB)
      .select("id");
    expect(forgedCrossUpdate.error).toBeNull();
    expect(forgedCrossUpdate.data).toEqual([]);

    const ownerBStillOwnsName = await ownerB.client
      .from("organizations")
      .select("name")
      .eq("id", orgB)
      .single();
    expect(ownerBStillOwnsName.error).toBeNull();
    expect(ownerBStillOwnsName.data?.name).toBe(`Org B ${suffix}`);

    const ownerUpdate = await ownerA.client
      .from("organizations")
      .update({ company_size: "51-200" })
      .eq("id", orgA)
      .select("id,company_size")
      .single();
    expect(ownerUpdate.error).toBeNull();
    expect(ownerUpdate.data).toEqual({ id: orgA, company_size: "51-200" });

    const hash = tokenHash();
    const invite = await ownerA.client.rpc("create_organization_invitation", {
      p_organization_id: orgA,
      p_email: `org-a-recruiter-${suffix}@example.test`,
      p_role: "recruiter",
      p_token_hash: hash,
      p_expires_at: new Date(Date.now() + HOUR_MS).toISOString(),
    });
    expect(invite.error).toBeNull();

    const accepted = await recruiter.client.rpc("accept_organization_invitation", {
      p_token_hash: hash,
    });
    expect(accepted.error).toBeNull();
    expect(accepted.data).toBe(orgA);

    const recruiterUpdate = await recruiter.client
      .from("organizations")
      .update({ name: "recruiter-forged-name" })
      .eq("id", orgA)
      .select("id");
    expect(recruiterUpdate.error).toBeNull();
    expect(recruiterUpdate.data).toEqual([]);

    const recruiterInvite = await recruiter.client.rpc(
      "create_organization_invitation",
      {
        p_organization_id: orgA,
        p_email: `blocked-${suffix}@example.test`,
        p_role: "reviewer",
        p_token_hash: tokenHash(),
        p_expires_at: new Date(Date.now() + HOUR_MS).toISOString(),
      },
    );
    expect(recruiterInvite.error).not.toBeNull();

    const recruiterRoleMutation = await recruiter.client.rpc(
      "update_organization_member_role",
      {
        p_organization_id: orgA,
        p_user_id: recruiter.userId,
        p_role: "reviewer",
      },
    );
    expect(recruiterRoleMutation.error).not.toBeNull();

    const crossRoleMutation = await ownerA.client.rpc(
      "update_organization_member_role",
      {
        p_organization_id: orgB,
        p_user_id: ownerB.userId,
        p_role: "admin",
      },
    );
    expect(crossRoleMutation.error).not.toBeNull();

    const anonOrganizations = await anon.from("organizations").select("id");
    expect(anonOrganizations.data ?? []).toEqual([]);
    const anonMemberships = await anon.from("organization_memberships").select("user_id");
    expect(anonMemberships.data ?? []).toEqual([]);

    const orgAAfterDenials = await ownerA.client
      .from("organizations")
      .select("name,company_size")
      .eq("id", orgA)
      .single();
    expect(orgAAfterDenials.error).toBeNull();
    expect(orgAAfterDenials.data).toEqual({
      name: `Org A ${suffix}`,
      company_size: "51-200",
    });
  });
});
