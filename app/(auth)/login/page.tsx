import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { SectionHeading } from "@/components/layout/section-heading";
import { WorkInProgressBanner } from "@/components/layout/work-in-progress-banner";
import { Card } from "@/components/ui/card";
import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { getCurrentUser } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/utils/env";

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const resolved = (await searchParams) ?? {};
  const redirectTo = getSafeRedirectPath(
    typeof resolved.redirectTo === "string" ? resolved.redirectTo : undefined,
  );
  const error = typeof resolved.error === "string" ? resolved.error : undefined;
  const message = typeof resolved.message === "string" ? resolved.message : undefined;

  if (hasSupabaseEnv()) {
    const user = await getCurrentUser();

    if (user) {
      redirect(redirectTo);
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <SectionHeading
          eyebrow="Sign in"
          title="Access your learning tracker"
          description="Use Google OAuth or email/password through Supabase Auth. Your session is persisted server-side for protected pages and APIs."
        />
        <WorkInProgressBanner
          className="mt-6"
          message="Authentication is still being finalized, so sign-in behavior may change while the flow is completed."
        />
        <AuthForm mode="login" redirectTo={redirectTo} initialError={error} initialMessage={message} />
        <div className="mt-4 grid gap-2">
          <p className="text-sm text-ink/58">
            Need an account?{" "}
            <Link href="/signup" className="font-semibold text-copper">
              Create one
            </Link>
          </p>
          {redirectTo !== "/dashboard" ? (
            <p className="text-sm text-ink/48">You will be returned to `{redirectTo}` after sign in.</p>
          ) : null}
        </div>
      </Card>
    </div>
  );
}
