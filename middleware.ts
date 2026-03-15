import { NextResponse, type NextRequest } from "next/server";
import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { updateSession } from "@/lib/supabase/middleware";
import { hasSupabaseEnv } from "@/lib/utils/env";

const protectedPrefixes = ["/dashboard", "/my-courses", "/recommendations", "/profile", "/admin"];
const authPrefixes = ["/login", "/signup"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));
  const isAuthPage = authPrefixes.includes(pathname);

  if (!hasSupabaseEnv()) {
    return NextResponse.next();
  }

  const { response, user } = await updateSession(request);
  const redirectTarget = `${pathname}${request.nextUrl.search}`;

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", redirectTarget);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && user) {
    const destination = getSafeRedirectPath(request.nextUrl.searchParams.get("redirectTo"));
    return NextResponse.redirect(new URL(destination, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
