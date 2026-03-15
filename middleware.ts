import { NextResponse, type NextRequest } from "next/server";

const protectedPrefixes = ["/dashboard", "/my-courses", "/recommendations", "/profile", "/admin"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedPrefixes.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  const hasSession =
    request.cookies.has("sb-access-token") || request.cookies.has("sb-refresh-token");

  if (hasSession || process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }

  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("redirectTo", pathname);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/my-courses/:path*",
    "/recommendations/:path*",
    "/profile/:path*",
    "/admin/:path*",
  ],
};
