export type InvitationActionState = Readonly<{
  status: "idle" | "error" | "success";
  message: string | null;
  invitationUrl: string | null;
}>;

export const idleInvitationActionState: InvitationActionState = {
  status: "idle",
  message: null,
  invitationUrl: null,
};
