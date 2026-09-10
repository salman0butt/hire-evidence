export type ProfileActionState = Readonly<{
  status: "idle" | "error" | "saved";
  message?: string;
}>;

export const idleProfileActionState: ProfileActionState = { status: "idle" };
