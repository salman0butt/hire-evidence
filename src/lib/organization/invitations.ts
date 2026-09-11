import { createHash, randomBytes } from "node:crypto";

import {
  isManageableOrganizationRole,
  type ManageableOrganizationRole,
} from "@/lib/organization/rbac";
import { createClient } from "@/lib/supabase/server";

export const INVITATION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

export type PendingOrganizationInvitation = Readonly<{
  id: string;
  email: string;
  role: ManageableOrganizationRole;
  expiresAt: string;
}>;

export function hashInvitationToken(rawToken: string): string {
  return createHash("sha256").update(rawToken, "utf8").digest("hex");
}

export function generateInvitationToken(): {
  rawToken: string;
  tokenHash: string;
} {
  const rawToken = randomBytes(32).toString("base64url");
  return { rawToken, tokenHash: hashInvitationToken(rawToken) };
}

export async function listPendingOrganizationInvitations(
  organizationId: string,
): Promise<PendingOrganizationInvitation[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organization_invitations")
    .select("id,email,role,expires_at")
    .eq("organization_id", organizationId)
    .is("accepted_at", null)
    .is("revoked_at", null)
    .gt("expires_at", new Date().toISOString())
    .order("created_at", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error("Unable to load organization invitations.");
  }

  const invitations: PendingOrganizationInvitation[] = [];
  for (const row of data ?? []) {
    if (
      typeof row.id !== "string" ||
      typeof row.email !== "string" ||
      !isManageableOrganizationRole(row.role) ||
      typeof row.expires_at !== "string"
    ) {
      throw new Error("Invalid organization invitation data.");
    }

    invitations.push({
      id: row.id,
      email: row.email,
      role: row.role,
      expiresAt: row.expires_at,
    });
  }

  return invitations;
}

export async function createOrganizationInvitation(input: {
  organizationId: string;
  email: string;
  role: ManageableOrganizationRole;
}): Promise<string> {
  const { rawToken, tokenHash } = generateInvitationToken();
  const supabase = await createClient();
  const expiresAt = new Date(Date.now() + INVITATION_TTL_MS).toISOString();
  const { data, error } = await supabase.rpc("create_organization_invitation", {
    p_organization_id: input.organizationId,
    p_email: input.email,
    p_role: input.role,
    p_token_hash: tokenHash,
    p_expires_at: expiresAt,
  });

  if (error || typeof data !== "string" || !data) {
    throw new Error("Unable to create organization invitation.");
  }

  return rawToken;
}

export async function revokeOrganizationInvitation(input: {
  organizationId: string;
  invitationId: string;
}): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("revoke_organization_invitation", {
    p_organization_id: input.organizationId,
    p_invitation_id: input.invitationId,
  });

  if (error) throw new Error("Unable to revoke organization invitation.");
}

export async function acceptOrganizationInvitation(
  rawToken: string,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("accept_organization_invitation", {
    p_token_hash: hashInvitationToken(rawToken),
  });

  if (error || typeof data !== "string" || !data) {
    throw new Error("Unable to accept organization invitation.");
  }

  return data;
}
