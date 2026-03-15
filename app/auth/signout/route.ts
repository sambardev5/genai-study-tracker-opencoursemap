import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasSupabaseEnv } from "@/lib/utils/env";

export async function POST(request: Request) {
  if (hasSupabaseEnv()) {
    const supabase = await createSupabaseServerClient();

    if (supabase) {
      await supabase.auth.signOut();
    }
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("message", "Signed out successfully.");

  return NextResponse.redirect(loginUrl);
}
