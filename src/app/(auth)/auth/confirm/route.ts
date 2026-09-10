import type { EmailOtpType } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

function isSignupOtpType(value: string | null): value is EmailOtpType {
  return value === "signup" || value === "email";
}

function loginVerificationError(origin: string): URL {
  return new URL("/auth/login?error=verification", origin);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const tokenHash = requestUrl.searchParams.get("token_hash");
  const type = requestUrl.searchParams.get("type");

  if (!tokenHash || !isSignupOtpType(type)) {
    return NextResponse.redirect(loginVerificationError(requestUrl.origin));
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash: tokenHash,
  });

  if (error) {
    return NextResponse.redirect(loginVerificationError(requestUrl.origin));
  }

  return NextResponse.redirect(new URL("/app", requestUrl.origin));
}
