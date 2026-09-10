export type AuthActionState = Readonly<{
  status: "idle" | "error" | "verification-required";
  message?: string;
}>;

export const idleAuthActionState: AuthActionState = { status: "idle" };
