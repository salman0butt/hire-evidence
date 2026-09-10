import { RecoveryForm } from "@/components/auth/recovery-form";

import { requestPasswordResetAction } from "../actions";

export default function ForgotPasswordPage() {
  return <RecoveryForm mode="request" action={requestPasswordResetAction} />;
}
