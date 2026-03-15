import { NextResponse, type NextRequest } from "next/server";
import { buildAuthPageUrl, getSafeRedirectPath } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/utils/env";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const redirectTo = getSafeRedirectPath(String(formData.get("redirectTo") ?? ""));

  if (!hasSupabaseEnv()) {
    return NextResponse.redirect(
      buildAuthPageUrl(request.url, "/login", {
        redirectTo,
        error: "Authentication is not configured on the server.",
      }),
      303,
    );
  }

  if (!email || !password) {
    return NextResponse.redirect(
      buildAuthPageUrl(request.url, "/login", {
        redirectTo,
        error: "Email and password are required.",
      }),
      303,
    );
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.redirect(
      buildAuthPageUrl(request.url, "/login", {
        redirectTo,
        error: "Authentication is not configured on the server.",
      }),
      303,
    );
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return NextResponse.redirect(
      buildAuthPageUrl(request.url, "/login", {
        redirectTo,
        error: error.message,
      }),
      303,
    );
  }

  return NextResponse.redirect(new URL(redirectTo, request.url), 303);
}
