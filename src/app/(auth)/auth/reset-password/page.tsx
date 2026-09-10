import { RecoveryForm } from "@/components/auth/recovery-form";

import { resetPasswordAction } from "../actions";

export default function ResetPasswordPage() {
  return <RecoveryForm mode="reset" action={resetPasswordAction} />;
}
