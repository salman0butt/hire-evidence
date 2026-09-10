export type HealthPayload = Readonly<{
  status: "ok";
  service: "hire-evidence";
  milestone: "M00";
}>;

export function getHealthPayload(): HealthPayload {
  return {
    status: "ok",
    service: "hire-evidence",
    milestone: "M00",
  };
}
