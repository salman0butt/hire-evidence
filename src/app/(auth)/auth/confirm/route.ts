import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { parseEnvironment } from "@/config/env";
import { createClient } from "@/lib/supabase/server";

function isSupportedOtpType(value: string | null): value is EmailOtpType {
  return value === "signup" || value === "email" || value === "recovery";
}

function getAppOrigin(): string {
  return parseEnvironment({
    NODE_ENV: process.env.NODE_ENV,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY:
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  }).appUrl.origin;
}

function confirmationError(type: string | null, origin: string): URL {
  return new URL(
    type === "recovery"
      ? "/auth/forgot-password?error=recovery"
      : "/auth/login?error=verification",
    origin,
  );
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const appOrigin = getAppOrigin();
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  if (!tokenHash || !isSupportedOtpType(type)) {
    return NextResponse.redirect(confirmationError(type, appOrigin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    return NextResponse.redirect(confirmationError(type, appOrigin));
  }

  return NextResponse.redirect(
    new URL(type === "recovery" ? "/auth/reset-password" : "/app", appOrigin),
  );
}
