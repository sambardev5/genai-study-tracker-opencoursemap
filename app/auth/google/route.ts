import { NextResponse, type NextRequest } from "next/server";
import { buildAuthCallbackUrl, buildAuthPageUrl, getSafeRedirectPath } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/utils/env";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
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

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: buildAuthCallbackUrl(request.nextUrl.origin, redirectTo),
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(
      buildAuthPageUrl(request.url, "/login", {
        redirectTo,
        error: error?.message ?? "Unable to start Google sign-in.",
      }),
      303,
    );
  }

  return NextResponse.redirect(data.url, 303);
}
