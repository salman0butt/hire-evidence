import { createClient } from "@/lib/supabase/server";

export type CreateOrganizationInput = Readonly<{
  name: string;
  companySize: string | null;
  hiringUseCase: string | null;
}>;

export type OrganizationSummary = Readonly<{
  id: string;
  name: string;
  companySize: string | null;
  hiringUseCase: string | null;
  candidateSupportEmail?: string | null;
  candidateSupportUrl?: string | null;
}>;

export type UpdateOrganizationSettingsInput = Readonly<{
  organizationId: string;
  name: string;
  companySize: string | null;
  hiringUseCase: string | null;
  candidateSupportEmail: string | null;
  candidateSupportUrl: string | null;
}>;

export async function createOrganization(
  input: CreateOrganizationInput,
): Promise<string> {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("create_organization", {
    p_name: input.name,
    p_company_size: input.companySize,
    p_hiring_use_case: input.hiringUseCase,
  });

  if (error || typeof data !== "string" || !data) {
    throw new Error("Unable to create organization.");
  }

  return data;
}

export async function listOrganizations(): Promise<OrganizationSummary[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("id,name,company_size,hiring_use_case,candidate_support_email,candidate_support_url")
    .order("name", { ascending: true })
    .order("id", { ascending: true });

  if (error) {
    throw new Error("Unable to load organizations.");
  }

  return (data ?? []).map((organization) => ({
    id: organization.id,
    name: organization.name,
    companySize: organization.company_size,
    hiringUseCase: organization.hiring_use_case,
    candidateSupportEmail: organization.candidate_support_email,
    candidateSupportUrl: organization.candidate_support_url,
  }));
}

export async function getOrganization(
  organizationId: string,
): Promise<OrganizationSummary> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .select("id,name,company_size,hiring_use_case,candidate_support_email,candidate_support_url")
    .eq("id", organizationId)
    .maybeSingle();

  if (error || !data) {
    throw new Error("Unable to load organization.");
  }

  return {
    id: data.id,
    name: data.name,
    companySize: data.company_size,
    hiringUseCase: data.hiring_use_case,
    candidateSupportEmail: data.candidate_support_email,
    candidateSupportUrl: data.candidate_support_url,
  };
}

export async function updateOrganizationSettings(
  input: UpdateOrganizationSettingsInput,
): Promise<void> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("organizations")
    .update({
      name: input.name,
      company_size: input.companySize,
      hiring_use_case: input.hiringUseCase,
      candidate_support_email: input.candidateSupportEmail,
      candidate_support_url: input.candidateSupportUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.organizationId)
    .select("id")
    .maybeSingle();

  if (error || data?.id !== input.organizationId) {
    throw new Error("Unable to update organization settings.");
  }
}
