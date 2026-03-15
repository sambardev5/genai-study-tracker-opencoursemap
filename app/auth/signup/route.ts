import { NextResponse, type NextRequest } from "next/server";
import { buildAuthCallbackUrl, buildAuthPageUrl, getSafeRedirectPath } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/utils/env";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const fullName = String(formData.get("fullName") ?? "").trim();
  const redirectTo = getSafeRedirectPath(String(formData.get("redirectTo") ?? ""));

  if (!hasSupabaseEnv()) {
    return NextResponse.redirect(
      buildAuthPageUrl(request.url, "/signup", {
        redirectTo,
        error: "Authentication is not configured on the server.",
      }),
      303,
    );
  }

  if (!email || !password || fullName.length < 2) {
    return NextResponse.redirect(
      buildAuthPageUrl(request.url, "/signup", {
        redirectTo,
        error: "Full name, email, and password are required.",
      }),
      303,
    );
  }

  const supabase = await createSupabaseServerClient();

  if (!supabase) {
    return NextResponse.redirect(
      buildAuthPageUrl(request.url, "/signup", {
        redirectTo,
        error: "Authentication is not configured on the server.",
      }),
      303,
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: buildAuthCallbackUrl(request.nextUrl.origin, redirectTo),
      data: {
        full_name: fullName,
        name: fullName,
      },
    },
  });

  if (error) {
    return NextResponse.redirect(
      buildAuthPageUrl(request.url, "/signup", {
        redirectTo,
        error: error.message,
      }),
      303,
    );
  }

  if (data.session) {
    return NextResponse.redirect(new URL(redirectTo, request.url), 303);
  }

  return NextResponse.redirect(
    buildAuthPageUrl(request.url, "/login", {
      redirectTo,
      message: "Check your email to confirm your account, then come back to sign in.",
    }),
    303,
  );
}
