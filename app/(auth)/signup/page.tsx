import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth/auth-form";
import { SectionHeading } from "@/components/layout/section-heading";
import { WorkInProgressBanner } from "@/components/layout/work-in-progress-banner";
import { Card } from "@/components/ui/card";
import { getSafeRedirectPath } from "@/lib/auth/redirects";
import { getCurrentUser } from "@/lib/auth/session";
import { hasSupabaseEnv } from "@/lib/utils/env";

export default async function SignupPage({
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
          eyebrow="Create account"
          title="Track every course in one place"
          description="Create an account with Google or email/password. Supabase Auth handles identity; the app handles progress tracking and recommendations."
        />
        <WorkInProgressBanner
          className="mt-6"
          message="Account creation is still being finalized, so signup behavior may change while authentication work is completed."
        />
        <AuthForm mode="signup" redirectTo={redirectTo} initialError={error} initialMessage={message} />
        <div className="mt-4 grid gap-2">
          <p className="text-sm text-ink/58">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-copper">
              Sign in
            </Link>
          </p>
          <p className="text-sm text-ink/48">
            If email confirmation is enabled in Supabase, we will send a confirmation link before first sign-in.
          </p>
        </div>
      </Card>
    </div>
  );
}
