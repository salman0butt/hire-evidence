import { createHash, randomBytes } from "node:crypto";

import { expect, test } from "@playwright/test";
import { createClient } from "@supabase/supabase-js";

const PASSWORD = "InvitationTest-1234";
const HOUR_MS = 60 * 60 * 1000;

function createTestClient(supabaseUrl: string, key: string) {
  return createClient(supabaseUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

type TestClient = ReturnType<typeof createTestClient>;

function requireProviderEnvironment() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !publishableKey || !serviceRoleKey) {
    throw new Error(
      "Invitation E2E requires NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY, and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  return { supabaseUrl, publishableKey, serviceRoleKey };
}

function requireString(value: unknown, label: string): string {
  expect(typeof value).toBe("string");
  if (typeof value !== "string") {
    throw new Error(`${label} must be a string.`);
  }
  return value;
}

function makeToken() {
  const rawToken = randomBytes(32).toString("base64url");
  const tokenHash = createHash("sha256").update(rawToken, "utf8").digest("hex");
  return { rawToken, tokenHash };
}

async function createConfirmedUser(
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
  expect(userId).toBeTruthy();
  if (!userId) throw new Error(`Supabase did not create ${email}.`);

  const client = createTestClient(supabaseUrl, publishableKey);
  const signedIn = await client.auth.signInWithPassword({ email, password: PASSWORD });
  expect(signedIn.error).toBeNull();
  expect(signedIn.data.user?.id).toBe(userId);

  return { client, userId };
}

async function createInvitation(
  actor: TestClient,
  input: {
    organizationId: string;
    email: string;
    role: "admin" | "recruiter" | "hiring_manager" | "reviewer" | "owner";
    tokenHash: string;
    expiresAt?: string;
  },
) {
  return actor.rpc("create_organization_invitation", {
    p_organization_id: input.organizationId,
    p_email: input.email,
    p_role: input.role,
    p_token_hash: input.tokenHash,
    p_expires_at: input.expiresAt ?? new Date(Date.now() + HOUR_MS).toISOString(),
  });
}

test.describe("provider-backed organization invitation security", () => {
  test.describe.configure({ mode: "serial" });

  test("enforces authorization, email binding, expiry, revocation, replay protection, and atomic membership", async () => {
    test.setTimeout(120_000);

    const { supabaseUrl, publishableKey, serviceRoleKey } = requireProviderEnvironment();
    const admin = createTestClient(supabaseUrl, serviceRoleKey);
    const suffix = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const ownerEmail = `invite-owner-${suffix}@example.test`;
    const reviewerEmail = `invite-reviewer-${suffix}@example.test`;
    const adminEmail = `invite-admin-${suffix}@example.test`;
    const targetEmail = `invite-target-${suffix}@example.test`;

    const owner = await createConfirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      ownerEmail,
    );
    const reviewer = await createConfirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      reviewerEmail,
    );
    const organizationAdmin = await createConfirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      adminEmail,
    );
    const target = await createConfirmedUser(
      admin,
      supabaseUrl,
      publishableKey,
      targetEmail,
    );

    const organization = await owner.client.rpc("create_organization", {
      p_name: `Invitation E2E ${suffix}`,
      p_company_size: null,
      p_hiring_use_case: null,
    });
    expect(organization.error).toBeNull();
    const organizationId = requireString(organization.data, "organization id");

    const ownerMembership = await owner.client
      .from("organization_memberships")
      .select("user_id,role")
      .eq("organization_id", organizationId)
      .eq("user_id", owner.userId)
      .single();
    expect(ownerMembership.error).toBeNull();
    expect(ownerMembership.data).toEqual({ user_id: owner.userId, role: "owner" });

    const reviewerToken = makeToken();
    const reviewerInvite = await createInvitation(owner.client, {
      organizationId,
      email: `  ${reviewerEmail.toUpperCase()}  `,
      role: "reviewer",
      tokenHash: reviewerToken.tokenHash,
    });
    expect(reviewerInvite.error).toBeNull();
    const reviewerInviteId = requireString(reviewerInvite.data, "reviewer invitation id");

    const storedReviewerInvite = await admin
      .from("organization_invitations")
      .select("id,email,role,token_hash,accepted_at,revoked_at")
      .eq("id", reviewerInviteId)
      .single();
    expect(storedReviewerInvite.error).toBeNull();
    expect(storedReviewerInvite.data).toMatchObject({
      email: reviewerEmail,
      role: "reviewer",
      token_hash: reviewerToken.tokenHash,
      accepted_at: null,
      revoked_at: null,
    });
    expect(Object.values(storedReviewerInvite.data ?? {})).not.toContain(
      reviewerToken.rawToken,
    );

    const acceptedReviewer = await reviewer.client.rpc(
      "accept_organization_invitation",
      { p_token_hash: reviewerToken.tokenHash },
    );
    expect(acceptedReviewer.error).toBeNull();
    expect(acceptedReviewer.data).toBe(organizationId);

    const reviewerMembership = await reviewer.client
      .from("organization_memberships")
      .select("organization_id,user_id,role")
      .eq("organization_id", organizationId)
      .eq("user_id", reviewer.userId)
      .single();
    expect(reviewerMembership.error).toBeNull();
    expect(reviewerMembership.data).toEqual({
      organization_id: organizationId,
      user_id: reviewer.userId,
      role: "reviewer",
    });

    const replay = await reviewer.client.rpc("accept_organization_invitation", {
      p_token_hash: reviewerToken.tokenHash,
    });
    expect(replay.error).not.toBeNull();

    const reviewerCreates = await createInvitation(reviewer.client, {
      organizationId,
      email: targetEmail,
      role: "recruiter",
      tokenHash: makeToken().tokenHash,
    });
    expect(reviewerCreates.error).not.toBeNull();

    const ownerRoleInvite = await createInvitation(owner.client, {
      organizationId,
      email: targetEmail,
      role: "owner",
      tokenHash: makeToken().tokenHash,
    });
    expect(ownerRoleInvite.error).not.toBeNull();

    const overlongInvite = await createInvitation(owner.client, {
      organizationId,
      email: targetEmail,
      role: "recruiter",
      tokenHash: makeToken().tokenHash,
      expiresAt: new Date(Date.now() + 8 * 24 * HOUR_MS).toISOString(),
    });
    expect(overlongInvite.error).not.toBeNull();

    const wrongEmailToken = makeToken();
    const wrongEmailInvite = await createInvitation(owner.client, {
      organizationId,
      email: targetEmail,
      role: "recruiter",
      tokenHash: wrongEmailToken.tokenHash,
    });
    expect(wrongEmailInvite.error).toBeNull();
    const wrongEmailInviteId = requireString(
      wrongEmailInvite.data,
      "wrong-email invitation id",
    );

    const wrongEmailAttempt = await reviewer.client.rpc(
      "accept_organization_invitation",
      { p_token_hash: wrongEmailToken.tokenHash },
    );
    expect(wrongEmailAttempt.error).not.toBeNull();

    const afterWrongEmail = await admin
      .from("organization_invitations")
      .select("accepted_at,revoked_at")
      .eq("id", wrongEmailInviteId)
      .single();
    expect(afterWrongEmail.error).toBeNull();
    expect(afterWrongEmail.data).toEqual({ accepted_at: null, revoked_at: null });

    const correctEmailAttempt = await target.client.rpc(
      "accept_organization_invitation",
      { p_token_hash: wrongEmailToken.tokenHash },
    );
    expect(correctEmailAttempt.error).toBeNull();
    expect(correctEmailAttempt.data).toBe(organizationId);

    const adminToken = makeToken();
    const adminInvite = await createInvitation(owner.client, {
      organizationId,
      email: adminEmail,
      role: "admin",
      tokenHash: adminToken.tokenHash,
    });
    expect(adminInvite.error).toBeNull();
    const acceptedAdmin = await organizationAdmin.client.rpc(
      "accept_organization_invitation",
      { p_token_hash: adminToken.tokenHash },
    );
    expect(acceptedAdmin.error).toBeNull();

    const adminManagedToken = makeToken();
    const adminManagedInvite = await createInvitation(organizationAdmin.client, {
      organizationId,
      email: targetEmail,
      role: "hiring_manager",
      tokenHash: adminManagedToken.tokenHash,
    });
    expect(adminManagedInvite.error).toBeNull();
    const adminManagedInviteId = requireString(
      adminManagedInvite.data,
      "admin-managed invitation id",
    );

    const reviewerRevokes = await reviewer.client.rpc(
      "revoke_organization_invitation",
      {
        p_organization_id: organizationId,
        p_invitation_id: adminManagedInviteId,
      },
    );
    expect(reviewerRevokes.error).not.toBeNull();

    const adminRevokes = await organizationAdmin.client.rpc(
      "revoke_organization_invitation",
      {
        p_organization_id: organizationId,
        p_invitation_id: adminManagedInviteId,
      },
    );
    expect(adminRevokes.error).toBeNull();

    const revokedAccept = await target.client.rpc("accept_organization_invitation", {
      p_token_hash: adminManagedToken.tokenHash,
    });
    expect(revokedAccept.error).not.toBeNull();

    const expiredToken = makeToken();
    const expiredInsert = await admin.from("organization_invitations").insert({
      organization_id: organizationId,
      email: targetEmail,
      role: "hiring_manager",
      invited_by: owner.userId,
      token_hash: expiredToken.tokenHash,
      expires_at: new Date(Date.now() - HOUR_MS).toISOString(),
    });
    expect(expiredInsert.error).toBeNull();

    const expiredAccept = await target.client.rpc("accept_organization_invitation", {
      p_token_hash: expiredToken.tokenHash,
    });
    expect(expiredAccept.error).not.toBeNull();

    const reviewerReadsInvites = await reviewer.client
      .from("organization_invitations")
      .select("id")
      .eq("organization_id", organizationId);
    expect(reviewerReadsInvites.error).toBeNull();
    expect(reviewerReadsInvites.data).toEqual([]);
  });
});
