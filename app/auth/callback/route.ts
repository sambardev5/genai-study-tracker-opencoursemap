import { NextResponse, type NextRequest } from "next/server";
import { buildAuthPageUrl, getSafeRedirectPath } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/utils/env";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const next = getSafeRedirectPath(request.nextUrl.searchParams.get("next"));

  if (!hasSupabaseEnv() || !code) {
    return NextResponse.redirect(
      buildAuthPageUrl(request.url, "/login", {
        redirectTo: next,
        error: "Unable to verify sign-in. Please try again.",
      }),
    );
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.redirect(
      buildAuthPageUrl(request.url, "/login", {
        redirectTo: next,
        error: "Authentication is not configured on the server.",
      }),
    );
  }

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      buildAuthPageUrl(request.url, "/login", {
        redirectTo: next,
        error: error.message,
      }),
    );
  }

  return NextResponse.redirect(new URL(next, request.url));
}
