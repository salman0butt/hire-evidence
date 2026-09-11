export type AuthActionState = Readonly<{
  status:
    | "idle"
    | "error"
    | "verification-required"
    | "recovery-requested"
    | "password-updated";
  message?: string;
}>;

export const idleAuthActionState: AuthActionState = { status: "idle" };
