import type { ProviderTokenAdapter } from "./provider-token";

export const GEMINI_LIVE_MODEL = "gemini-3.1-flash-live-preview";

const GEMINI_AUTH_TOKEN_URL =
  "https://generativelanguage.googleapis.com/v1beta/auth_tokens";
const TOKEN_LIFETIME_MS = 4 * 60 * 1000;
const NEW_SESSION_LIFETIME_MS = 60 * 1000;

type GeminiProviderTokenOptions = Readonly<{
  apiKey: string;
  fetchImpl?: typeof fetch;
  now?: () => Date;
  model?: string;
}>;

type GeminiAuthTokenResponse = Readonly<{
  name?: unknown;
}>;

export function createGeminiProviderTokenAdapter(
  options: GeminiProviderTokenOptions,
): ProviderTokenAdapter {
  const apiKey = options.apiKey.trim();
  if (!apiKey) {
    throw new Error("Gemini API key is required");
  }

  const fetchImpl = options.fetchImpl ?? fetch;
  const now = options.now ?? (() => new Date());
  const model = options.model?.trim() || GEMINI_LIVE_MODEL;
  const constrainedModel = model.startsWith("models/") ? model : `models/${model}`;

  return async (input) => {
    void input;

    const issuedAt = now().getTime();
    const expireTime = new Date(issuedAt + TOKEN_LIFETIME_MS).toISOString();
    const newSessionExpireTime = new Date(
      issuedAt + NEW_SESSION_LIFETIME_MS,
    ).toISOString();

    const response = await fetchImpl(GEMINI_AUTH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        uses: 1,
        expireTime,
        newSessionExpireTime,
        liveConnectConstraints: {
          model: constrainedModel,
          config: {
            sessionResumption: {},
            responseModalities: ["AUDIO"],
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Gemini Live credential issuance failed");
    }

    const payload = (await response.json()) as GeminiAuthTokenResponse;
    if (typeof payload.name !== "string" || !payload.name.trim()) {
      throw new Error("Gemini Live credential response was invalid");
    }

    return {
      credential: payload.name,
      expiresAt: expireTime,
    };
  };
}
