import type { ProviderCredential } from "./session-authorization";

export type ProviderTokenRequest = Readonly<{
  attemptId: string;
  interviewerVersionId: string;
  durationSeconds: number;
  language: string;
}>;

export type ProviderTokenAdapter = (
  input: ProviderTokenRequest,
) => Promise<ProviderCredential>;

export type ProviderTokenIssuerOptions = Readonly<{
  now?: () => Date;
  maxLifetimeMs?: number;
}>;

const DEFAULT_MAX_LIFETIME_MS = 5 * 60 * 1000;
const INVALID_CREDENTIAL_MESSAGE = "Provider credential must be short-lived";

export function createProviderTokenIssuer(
  issue: ProviderTokenAdapter,
  options: ProviderTokenIssuerOptions = {},
): ProviderTokenAdapter {
  const now = options.now ?? (() => new Date());
  const maxLifetimeMs = options.maxLifetimeMs ?? DEFAULT_MAX_LIFETIME_MS;

  if (!Number.isFinite(maxLifetimeMs) || maxLifetimeMs <= 0) {
    throw new Error("Provider credential lifetime bound must be positive");
  }

  return async (input) => {
    const credential = await issue(input);
    const issuedAt = now().getTime();
    const expiresAt = Date.parse(credential.expiresAt);

    if (
      !credential.credential.trim() ||
      !Number.isFinite(expiresAt) ||
      expiresAt <= issuedAt ||
      expiresAt - issuedAt > maxLifetimeMs
    ) {
      throw new Error(INVALID_CREDENTIAL_MESSAGE);
    }

    return credential;
  };
}
