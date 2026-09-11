import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

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

export async function createClient() {
  const cookieStore = await cookies();
  const env = getEnvironment();

  return createServerClient(env.supabaseUrl.href, env.supabasePublishableKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            cookieStore.set(name, value, options);
          });
        } catch {
          // Server Components cannot write cookies. The request proxy refreshes
          // sessions and persists refreshed cookies before rendering.
        }
      },
    },
  });
}
