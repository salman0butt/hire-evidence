import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function isSupportedOtpType(value: string | null): value is EmailOtpType {
  return value === "signup" || value === "email" || value === "recovery";
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
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  if (!tokenHash || !isSupportedOtpType(type)) {
    return NextResponse.redirect(confirmationError(type, requestUrl.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    return NextResponse.redirect(confirmationError(type, requestUrl.origin));
  }

  return NextResponse.redirect(
    new URL(type === "recovery" ? "/auth/reset-password" : "/app", requestUrl.origin),
  );
}
