export type NodeEnvironment = "development" | "test" | "production";

export type AppEnvironment = Readonly<{
  nodeEnv: NodeEnvironment;
  appUrl: URL;
  supabaseUrl: URL;
  supabasePublishableKey: string;
}>;

export type EnvironmentInput = Readonly<{
  NODE_ENV?: string;
  NEXT_PUBLIC_APP_URL?: string;
  NEXT_PUBLIC_SUPABASE_URL?: string;
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?: string;
}>;

const DEFAULT_APP_URL = "http://localhost:3000";
const VALID_NODE_ENVIRONMENTS = new Set<NodeEnvironment>([
  "development",
  "test",
  "production",
]);

function parseNodeEnvironment(value: string | undefined): NodeEnvironment {
  const candidate = value ?? "development";

  if (!VALID_NODE_ENVIRONMENTS.has(candidate as NodeEnvironment)) {
    throw new Error("NODE_ENV must be development, test, or production");
  }

  return candidate as NodeEnvironment;
}

function parseHttpUrl(value: string | undefined, variableName: string): URL {
  let parsed: URL;

  try {
    parsed = new URL(value ?? "");
  } catch {
    throw new Error(`${variableName} must be an absolute http(s) URL`);
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(`${variableName} must be an absolute http(s) URL`);
  }

  return parsed;
}

function parseAppUrl(value: string | undefined): URL {
  return parseHttpUrl(value ?? DEFAULT_APP_URL, "NEXT_PUBLIC_APP_URL");
}

function parsePublishableKey(value: string | undefined): string {
  const key = value?.trim();

  if (!key) {
    throw new Error("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY must be non-empty");
  }

  return key;
}

export function parseEnvironment(input: EnvironmentInput): AppEnvironment {
  return {
    nodeEnv: parseNodeEnvironment(input.NODE_ENV),
    appUrl: parseAppUrl(input.NEXT_PUBLIC_APP_URL),
    supabaseUrl: parseHttpUrl(
      input.NEXT_PUBLIC_SUPABASE_URL,
      "NEXT_PUBLIC_SUPABASE_URL",
    ),
    supabasePublishableKey: parsePublishableKey(
      input.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),
  };
}
