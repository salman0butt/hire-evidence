export type NodeEnvironment = "development" | "test" | "production";

export type AppEnvironment = Readonly<{
  nodeEnv: NodeEnvironment;
  appUrl: URL;
}>;

export type EnvironmentInput = Readonly<{
  NODE_ENV?: string;
  NEXT_PUBLIC_APP_URL?: string;
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

function parseAppUrl(value: string | undefined): URL {
  let appUrl: URL;

  try {
    appUrl = new URL(value ?? DEFAULT_APP_URL);
  } catch {
    throw new Error("NEXT_PUBLIC_APP_URL must be an absolute http(s) URL");
  }

  if (appUrl.protocol !== "http:" && appUrl.protocol !== "https:") {
    throw new Error("NEXT_PUBLIC_APP_URL must be an absolute http(s) URL");
  }

  return appUrl;
}

export function parseEnvironment(input: EnvironmentInput): AppEnvironment {
  return {
    nodeEnv: parseNodeEnvironment(input.NODE_ENV),
    appUrl: parseAppUrl(input.NEXT_PUBLIC_APP_URL),
  };
}

export const appEnvironment = parseEnvironment(process.env);
