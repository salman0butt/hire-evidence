import { RecoveryForm } from "@/components/auth/recovery-form";

import { requestPasswordResetAction } from "../actions";

type ForgotPasswordPageProps = Readonly<{
  searchParams: Promise<{
    error?: string | string[];
  }>;
}>;

const RECOVERY_LINK_ERROR =
  "Your password reset link is invalid or expired. Request a new reset link.";

export default async function ForgotPasswordPage({
  searchParams,
}: ForgotPasswordPageProps) {
  const params = await searchParams;

  if (params.error === "recovery") {
    return (
      <RecoveryForm
        mode="request"
        action={requestPasswordResetAction}
        message={RECOVERY_LINK_ERROR}
        messageRole="alert"
      />
    );
  }

  return <RecoveryForm mode="request" action={requestPasswordResetAction} />;
}
