import Link from "next/link";
import { SectionHeading } from "@/components/layout/section-heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 sm:px-6 lg:px-8">
      <Card>
        <SectionHeading
          eyebrow="Sign in"
          title="Access your learning tracker"
          description="Wire Google OAuth and email/password in Supabase, then connect these forms to the hosted auth flows."
        />
        <div className="mt-8 grid gap-4">
          <Button variant="secondary">Continue with Google</Button>
          <div className="grid gap-3">
            <Input type="email" placeholder="Email address" />
            <Input type="password" placeholder="Password" />
            <Button>Sign in with email</Button>
          </div>
          <p className="text-sm text-ink/58">
            Need an account?{" "}
            <Link href="/signup" className="font-semibold text-copper">
              Create one
            </Link>
          </p>
        </div>
      </Card>
    </div>
  );
}
