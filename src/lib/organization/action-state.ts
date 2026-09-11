export type OrganizationActionState = Readonly<{
  status: "idle" | "error";
  message: string | null;
}>;

export const idleOrganizationActionState: OrganizationActionState = {
  status: "idle",
  message: null,
};
