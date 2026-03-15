import { NextResponse } from "next/server";
import { buildAuthPageUrl } from "@/lib/auth/redirects";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/utils/env";

export async function POST(request: Request) {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      await supabase.auth.signOut();
    }
  }

  return NextResponse.redirect(
    buildAuthPageUrl(request.url, "/login", {
      message: "Signed out successfully.",
    }),
  );
}
