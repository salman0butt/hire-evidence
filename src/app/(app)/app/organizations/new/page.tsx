import { OrganizationForm } from "@/components/organization/organization-form";

import { createOrganizationAction } from "./actions";

export default function NewOrganizationPage() {
  return <OrganizationForm action={createOrganizationAction} />;
}
