import Link from "next/link";
import { Compass, LayoutDashboard, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/auth/session";
import { isAdmin } from "@/lib/auth/permissions";
import { Button } from "@/components/ui/button";
import { hasSupabaseEnv } from "@/lib/utils/env";

const navLinks = [
  { href: "/courses", label: "Courses" },
  { href: "/paths", label: "Paths" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/recommendations", label: "Recommendations" },
  { href: "/admin", label: "Admin" },
];

export async function SiteHeader() {
  const user = hasSupabaseEnv() ? await getCurrentUser() : null;
  const visibleLinks = navLinks.filter((link) => link.href !== "/admin" || isAdmin(user));

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-canvas/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-canvas">
            <Compass className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-lg font-bold tracking-tight">OpenCourseMap</div>
            <div className="text-xs uppercase tracking-[0.24em] text-ink/45">Free AI learning atlas</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink/70 md:flex">
          {visibleLinks.map((link) => (
            <Link key={link.href} href={link.href} className="transition hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  {user.fullName || "Dashboard"}
                </Button>
              </Link>
              <form action="/auth/signout" method="post">
                <Button type="submit" size="sm" variant="outline">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button variant="ghost" size="sm" className="hidden sm:inline-flex">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm">
                  <ShieldCheck className="mr-2 h-4 w-4" />
                  Start tracking
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
