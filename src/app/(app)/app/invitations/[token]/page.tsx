import { AcceptInvitationForm } from "@/components/organization/accept-invitation-form";

import { acceptInvitationAction } from "../../o/[organizationId]/team/invite-actions";

type InvitationPageProps = Readonly<{
  params: Promise<{ token: string }>;
}>;

export default async function InvitationPage({ params }: InvitationPageProps) {
  const { token } = await params;

  return (
    <AcceptInvitationForm action={acceptInvitationAction.bind(null, token)} />
  );
}
