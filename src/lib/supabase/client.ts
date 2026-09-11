import { createBrowserClient } from "@supabase/ssr";

import { parseEnvironment } from "@/config/env";

function getEnvironment() {
  return parseEnvironment({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  });
}

export function createClient() {
  const env = getEnvironment();

  return createBrowserClient(
    env.supabaseUrl.href,
    env.supabasePublishableKey,
  );
}
